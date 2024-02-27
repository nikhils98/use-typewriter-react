import React, { ReactNode } from "react";
import { TypewriterOptions } from "../services/typewriter";
import useTypewriter from "../hooks/useTypewriter";
import "./typewriter.css";

interface Props {
  phrases: string[];
  options: TypewriterOptions & {
    cursor?: "_" | "|";
    customCursor?: ReactNode;
  };
}

const Typewriter = ({ phrases, options }: Props) => {
  const { phrase } = useTypewriter({
    phrases,
    options,
  });

  const getCursor = () => {
    const { cursor, customCursor } = options;
    if (customCursor) {
      return customCursor;
    }

    if (cursor) {
      return cursor === "_" ? (
        <span className="blinking-cursor">_</span>
      ) : (
        <span className="blinking-cursor blinking-cursor-vertical">|</span>
      );
    }

    return null;
  };

  return (
    <span>
      {phrase}
      {getCursor()}
    </span>
  );
};

export default Typewriter;
