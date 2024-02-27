import { useEffect, useState } from "react";
import {
  TypewriterOptions,
  TypewriterProgress,
  initTypewriterProgress,
  typeNext,
} from "../services/typewriter";

interface Props {
  phrases: string[];
  options: TypewriterOptions;
}

const useTypewriter = ({ phrases, options }: Props) => {
  const [typewriterProgress, setTypewriterProgress] =
    useState<TypewriterProgress>(initTypewriterProgress);

  useEffect(() => {
    if (!phrases.length) {
      return;
    }

    const stop = typeNext(phrases, options, typewriterProgress, (progress) => {
      setTypewriterProgress(progress);
    });

    return () => stop();
  }, [typewriterProgress, options]);

  return { phrase: typewriterProgress.phrase };
};

export default useTypewriter;
