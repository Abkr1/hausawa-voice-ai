import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import FormData from "form-data";
import fetch from "node-fetch";

/**
 * Preprocess an audio file to 16kHz mono WAV using ffmpeg (fluent-ffmpeg wrapper).
 * Returns path to the converted WAV file (temporary).
 */
export async function preprocessTo16kMono(inputPath: string): Promise<string> {
  const outDir = path.join(path.dirname(inputPath), "processed");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(
    outDir,
    `${path.basename(inputPath, path.extname(inputPath))}-16k-mono.wav`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-ac 1", // mono
        "-ar 16000", // 16k sample rate
        "-vn", // no video
        "-f wav",
      ])
      .on("error", (err) => reject(err))
      .on("end", () => resolve(outPath))
      .save(outPath);
  });
}

/**
 * Transcribe a (preprocessed) audio file with OpenAI Whisper.
 * Uses the REST endpoint POST /v1/audio/transcriptions.
 *
 * Make sure process.env.OPENAI_API_KEY is set.
 *
 * Returns the transcription text.
 */
export async function transcribeWithWhisper(
  wavPath: string,
  opts?: { language?: string; temperature?: number }
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set in environment");

  const form = new FormData();
  form.append("file", fs.createReadStream(wavPath) as any);
  form.append("model", "whisper-1");
  if (opts?.language) form.append("language", opts.language); // e.g. "ha"
  if (typeof opts?.temperature !== "undefined")
    form.append("temperature", String(opts.temperature));

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      // form.getHeaders() will be merged automatically below (node-fetch doesn't merge; add explicitly)
      ...form.getHeaders(),
    },
    body: form as any,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Whisper API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  // OpenAI returns { text: "..." } (or similar). Return the text if present.
  return (data.text as string) || (data.transcript as string) || JSON.stringify(data);
}

/**
 * High-level convenience: preprocess and transcribe in one call.
 */
export async function transcribeHausa(inputFilePath: string) {
  const processed = await preprocessTo16kMono(inputFilePath);
  // language "ha" is Hausa; temperature 0 for deterministic transcription
  const text = await transcribeWithWhisper(processed, { language: "ha", temperature: 0 });
  return { text, processedPath: processed };
}