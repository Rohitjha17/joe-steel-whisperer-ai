import React, { useEffect, useRef, useState } from 'react';

interface VoiceResponseProps {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  voice?: SpeechSynthesisVoice;
}

export function VoiceResponse({ text, onStart, onEnd, voice }: VoiceResponseProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis is not supported in this browser');
      setIsSupported(false);
      return;
    }

    if (!text || !isSupported) return;

    try {
      // Initialize speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        onEnd?.();
      };

      utteranceRef.current = utterance;

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Cleanup
      return () => {
        if (isSpeaking && window.speechSynthesis) {
          try {
            window.speechSynthesis.cancel();
          } catch (error) {
            console.error('Error canceling speech synthesis:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
      setIsSupported(false);
      onEnd?.();
    }
  }, [text, voice, onStart, onEnd, isSupported]);

  // This component doesn't render anything
  return null;
} 