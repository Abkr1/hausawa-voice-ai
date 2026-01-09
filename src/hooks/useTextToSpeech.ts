import { useState, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (text: string) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ha-NG'; // Set language to Hausa (Nigeria)
      utterance.rate = 0.9;
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = (event) => {
          console.error("SpeechSynthesis Error:", event.error);
          setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) { 
      console.error("Text-to-speech failed:", error);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
      const handleBeforeUnload = () => {
          if(window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
          }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
      }
  }, []);

  return { isPlaying, speak };
};