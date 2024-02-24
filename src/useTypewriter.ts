import { useEffect, useState } from "react";

interface PhraseTyping {
  phrase: string;
  matrixPos: number[];
  isErasing: boolean;
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
    isErasing: false,
  });

  useEffect(() => {
    const matrix = phrases.map((phrase) => {
      const separator = unit === "word" ? " " : "";
      return phrase.split(separator);
    });
    setPhraseMatrix(matrix);
  }, []);

  const start = () => {
    if (!phrases.length) {
      return;
    }

    setInterval(() => {
      setPhraseTyping((curPhraseTyping) => {
        let matrixPos = [
          curPhraseTyping.matrixPos[0],
          curPhraseTyping.matrixPos[1] + speed.numberOfUnits,
        ];
        let isErasing = curPhraseTyping.isErasing;

        if (
          curPhraseTyping.isErasing ||
          curPhraseTyping.matrixPos[1] >=
            phraseMatrix[curPhraseTyping.matrixPos[0]].length
        ) {
          if (eraseAtOnce) {
            matrixPos = [
              (curPhraseTyping.matrixPos[0] + 1) % phraseMatrix.length,
              speed.numberOfUnits,
            ];
          } else {
            if (curPhraseTyping.isErasing === false) {
              isErasing = true;
            }

            if (curPhraseTyping.matrixPos[1] <= 0) {
              matrixPos = [
                (curPhraseTyping.matrixPos[0] + 1) % phraseMatrix.length,
                speed.numberOfUnits,
              ];
              isErasing = false;
            } else {
              matrixPos = [
                curPhraseTyping.matrixPos[0],
                curPhraseTyping.matrixPos[1] - speed.numberOfUnits,
              ];
            }
          }
        }

        const phrase = phraseMatrix[matrixPos[0]]
          .filter((_, idx) => idx < matrixPos[1])
          .join(unit === "word" ? " " : "");

        return {
          phrase,
          matrixPos,
          isErasing,
        };
      });
    }, speed.timeDelayMs);
  };

  return { phrase: phraseTyping.phrase, start };
};

export default useTypewriter;
