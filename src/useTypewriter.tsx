import { useEffect, useState } from "react";
import {
  Typewriter,
  TypewriterProgress,
  defaultTypewriterProgress,
  typeNext,
} from "./typewriter";

interface Props {
  phrases: string[];
  typewriter: Typewriter;
}

const useTypewriter = ({ phrases, typewriter }: Props) => {
  const [typewriterProgress, setTypewriterProgress] =
    useState<TypewriterProgress>(defaultTypewriterProgress);

  useEffect(() => {
    if (!phrases.length) {
      return;
    }

    const stop = typeNext(
      phrases,
      typewriter,
      typewriterProgress,
      (progress) => {
        setTypewriterProgress(progress);
      }
    );

    return () => stop();
  }, [typewriterProgress, typewriter]);

  return { phrase: typewriterProgress.phrase };
};

export default useTypewriter;
