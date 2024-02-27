export interface TypewriterOptions {
  typingSpeed: TypewriterSpeed;
  erasingSpeed: TypewriterSpeed;
  loopLimit?: number;
}

export interface TypewriterSpeed {
  numUnits: number;
  timeMs: number;
  startDelayMs: number;
}

export interface TypewriterProgress {
  phrase: string;
  phraseIdx: number;
  status: TypewriterStatus;
  loopsCompleted: number;
}

export enum TypewriterStatus {
  WaitingToType = "waitingToType",
  Typing = "typing",
  WaitingToErase = "waitingToErase",
  Erasing = "erasing",
}

export const initTypewriterProgress: TypewriterProgress = {
  phrase: "",
  phraseIdx: 0,
  status: TypewriterStatus.WaitingToType,
  loopsCompleted: 0,
};

export const typeNext = (
  phrases: string[],
  options: TypewriterOptions,
  progress: TypewriterProgress,
  onNext: (progress: TypewriterProgress) => void
) => {
  if (options.loopLimit && progress.loopsCompleted >= options.loopLimit) {
    return () => {};
  }

  const delay = getDelay(options, progress);

  const timeoutId = setTimeout(() => {
    const nextProgress = getNext(phrases, options, progress);
    onNext(nextProgress);
  }, delay);

  return () => clearTimeout(timeoutId);
};

const getDelay = (
  { typingSpeed, erasingSpeed }: TypewriterOptions,
  { status }: TypewriterProgress
): number => {
  const stateDelays = {
    [TypewriterStatus.WaitingToType]: typingSpeed.startDelayMs,
    [TypewriterStatus.Typing]: typingSpeed.timeMs,
    [TypewriterStatus.WaitingToErase]: erasingSpeed.startDelayMs,
    [TypewriterStatus.Erasing]: erasingSpeed.timeMs,
  };
  return stateDelays[status];
};

const getNext = (
  phrases: string[],
  options: TypewriterOptions,
  progress: TypewriterProgress
): TypewriterProgress => {
  const fullPhrase = phrases[progress.phraseIdx];
  let { phrase, phraseIdx, status, loopsCompleted } = progress;

  switch (progress.status) {
    case TypewriterStatus.Typing: {
      const startIdx = progress.phrase.length;
      const endIdx = startIdx + options.typingSpeed.numUnits;
      const eolReached = endIdx >= fullPhrase.length;

      phrase = fullPhrase.substring(0, endIdx);
      status = eolReached
        ? TypewriterStatus.WaitingToErase
        : TypewriterStatus.Typing;
      break;
    }
    case TypewriterStatus.WaitingToErase: {
      loopsCompleted =
        progress.phraseIdx === phrases.length - 1
          ? progress.loopsCompleted + 1
          : progress.loopsCompleted;
      status = TypewriterStatus.Erasing;
      break;
    }
    case TypewriterStatus.Erasing: {
      const startIdx = 0;
      const endIdx = progress.phrase.length - options.erasingSpeed.numUnits;
      const isFullyErased = endIdx <= 0;

      if (isFullyErased) {
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }

      phrase = fullPhrase.substring(startIdx, endIdx);
      status = isFullyErased
        ? TypewriterStatus.WaitingToType
        : TypewriterStatus.Erasing;
      break;
    }
    case TypewriterStatus.WaitingToType:
      status = TypewriterStatus.Typing;
      break;
  }

  return {
    phrase,
    phraseIdx,
    status,
    loopsCompleted,
  };
};
