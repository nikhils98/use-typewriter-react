export interface TypewriterOptions {
  typingSpeed: TypewriterSpeed;
  erasingSpeed: TypewriterSpeed;
  loopLimit?: number;
}

interface TypewriterSpeed {
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

enum TypewriterStatus {
  WaitingToType = "waitingToType",
  Typing = "typing",
  WaitingToErase = "waitingToErase",
  Erasing = "erasing",
}

export const defaultTypewriterProgress: TypewriterProgress = {
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

  if (progress.status === TypewriterStatus.Typing) {
    const startIdx = progress.phrase.length;
    const endIdx = startIdx + options.typingSpeed.numUnits;
    const eolReached = endIdx >= fullPhrase.length;

    return {
      phrase: fullPhrase.substring(0, endIdx),
      phraseIdx: progress.phraseIdx,
      status: eolReached
        ? TypewriterStatus.WaitingToErase
        : TypewriterStatus.Typing,
      loopsCompleted: progress.loopsCompleted,
    };
  } else if (progress.status === TypewriterStatus.WaitingToErase) {
    const loopsCompleted =
      progress.phraseIdx === phrases.length - 1
        ? progress.loopsCompleted + 1
        : progress.loopsCompleted;
    let status = TypewriterStatus.Erasing;

    return {
      phrase: progress.phrase,
      phraseIdx: progress.phraseIdx,
      status,
      loopsCompleted,
    };
  } else if (progress.status === TypewriterStatus.Erasing) {
    let phraseIdx = progress.phraseIdx;
    const startIdx = 0;
    const endIdx = progress.phrase.length - options.erasingSpeed.numUnits;
    const isFullyErased = endIdx <= 0;

    if (isFullyErased) {
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }

    return {
      phrase: fullPhrase.substring(startIdx, endIdx),
      phraseIdx,
      status: isFullyErased
        ? TypewriterStatus.WaitingToType
        : TypewriterStatus.Erasing,
      loopsCompleted: progress.loopsCompleted,
    };
  }
  return {
    phrase: progress.phrase,
    phraseIdx: progress.phraseIdx,
    status: TypewriterStatus.Typing,
    loopsCompleted: progress.loopsCompleted,
  };
};
