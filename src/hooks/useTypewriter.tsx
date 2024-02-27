import { useEffect, useState } from "react";
import {
  TypewriterData,
  TypewriterProgress,
  defaultTypewriterProgress,
  typeNext,
} from "../domain/typewriter";

interface Props {
  phrases: string[];
  typewriterData: TypewriterData;
}

const useTypewriter = ({ phrases, typewriterData }: Props) => {
  const [typewriterProgress, setTypewriterProgress] =
    useState<TypewriterProgress>(defaultTypewriterProgress);

  useEffect(() => {
    if (!phrases.length) {
      return;
    }

    const stop = typeNext(
      phrases,
      typewriterData,
      typewriterProgress,
      (progress) => {
        setTypewriterProgress(progress);
      }
    );

    return () => stop();
  }, [typewriterProgress, typewriterData]);

  return { phrase: typewriterProgress.phrase };
};

export default useTypewriter;
