import { useEffect, useState } from "react";

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
  const [phrase, setPhrase] = useState<string>("");

  const start = () => {
    if (!phrases.length) {
      setPhrase("");
    }

    setPhrase(phrases[0]);
  };

  return { phrase, start };
};

export default useTypewriter;
