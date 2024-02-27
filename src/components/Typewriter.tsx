import React, { ReactNode } from "react";
import { TypewriterData } from "../domain/typewriter";
import useTypewriter from "../hooks/useTypewriter";
import style from "./typewriter.module.css";

interface Props {
  phrases: string[];
  typewriterData: TypewriterData;
  cursor?: "_" | "|";
  customCursor?: ReactNode;
}

const Typewriter = ({
  phrases,
  typewriterData,
  cursor,
  customCursor,
}: Props) => {
  const { phrase } = useTypewriter({
    phrases,
    typewriterData,
  });

  const getCursor = () => {
    if (customCursor) {
      return customCursor;
    }

    if (cursor) {
      return cursor === "_" ? (
        <span className={style["blinking-cursor"]}>_</span>
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
