import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { transcribeHausa } from "../services/whisper";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * POST /transcribe
 * form-data: file=<audio file>
 */
router.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = path.resolve(req.file.path);

    const result = await transcribeHausa(inputPath);

    // Optional: cleanup uploaded file (keep processed if you want)
    try {
      fs.unlinkSync(inputPath);
    } catch (e) {}

    res.json({
      transcript: result.text,
      processedPath: result.processedPath,
    });
  } catch (err: any) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;