import { useEffect, useState } from "react";

interface PhraseTyping {
  phrase: string;
  matrixPos: number[];
}

interface Options {
  unit: "word" | "character";
  speed: {
    numberOfUnits: number;
    timeDelayMs: number;
  };
  eraseAtOnce: boolean;
}

interface Props {
  phrases: string[];
  options?: Options;
}

const useTypewriter = ({
  phrases,
  options: { unit, speed, eraseAtOnce } = {
    unit: "word",
    speed: { numberOfUnits: 1, timeDelayMs: 500 },
    eraseAtOnce: true,
  },
}: Props) => {
  const [phraseMatrix, setPhraseMatrix] = useState<string[][]>([]);
  const [phraseTyping, setPhraseTyping] = useState<PhraseTyping>({
    phrase: "",
    matrixPos: [0, 0],
  });

  useEffect(() => {
    const matrix = phrases.map((phrase) => {
      const separator = unit === "word" ? " " : "";
      return phrase.split(separator).filter((c) => c !== " ");
    });
    setPhraseMatrix(matrix);
  }, []);

  const start = () => {
    if (!phrases.length) {
      return;
    }

    setInterval(() => {
      setPhraseTyping((curPhraseTyping) => {
        const matrixPos = [
          0,
          curPhraseTyping.matrixPos[1] + speed.numberOfUnits,
        ];
        const phrase = phraseMatrix[curPhraseTyping.matrixPos[0]]
          .filter((_, idx) => idx < matrixPos[1])
          .join(" ");
        return {
          phrase,
          matrixPos,
        };
      });
    }, speed.timeDelayMs);
  };

  return { phrase: phraseTyping.phrase, start };
};

export default useTypewriter;
