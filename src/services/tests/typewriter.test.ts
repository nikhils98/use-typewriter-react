import { typeNext, TypewriterStatus, TypewriterProgress } from "../typewriter";

describe("typeNext unit tests", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const phrases = ["test", "phrase"];
  const options = {
    typingSpeed: { numUnits: 1, timeMs: 100, startDelayMs: 10 },
    erasingSpeed: { numUnits: 1, timeMs: 50, startDelayMs: 5 },
    loopLimit: 2,
  };

  test("Should transition from WaitingToType to Typing after start delay", () => {
    const progress: TypewriterProgress = {
      phrase: "",
      phraseIdx: 0,
      status: TypewriterStatus.WaitingToType,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.typingSpeed.startDelayMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "",
      phraseIdx: 0,
      status: TypewriterStatus.Typing,
      loopsCompleted: 0,
    });
  });

  test("Should type 1 unit after typing time", () => {
    const progress: TypewriterProgress = {
      phrase: "",
      phraseIdx: 0,
      status: TypewriterStatus.Typing,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.typingSpeed.timeMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "t",
      phraseIdx: 0,
      status: TypewriterStatus.Typing,
      loopsCompleted: 0,
    });
  });

  test("Should transition from Typing to WaitingToErase after a phrase is completely typed", () => {
    const progress = {
      phrase: "tes",
      phraseIdx: 0,
      status: TypewriterStatus.Typing,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.typingSpeed.timeMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "test",
      phraseIdx: 0,
      status: TypewriterStatus.WaitingToErase,
      loopsCompleted: 0,
    });
  });

  test("Should transition from WaitingToErase to Erasing after delay", () => {
    const progress = {
      phrase: "test",
      phraseIdx: 0,
      status: TypewriterStatus.WaitingToErase,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.erasingSpeed.startDelayMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "test",
      phraseIdx: 0,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 0,
    });
  });

  test("Should erase 1 character after erase time", () => {
    const progress = {
      phrase: "test",
      phraseIdx: 0,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.erasingSpeed.timeMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "tes",
      phraseIdx: 0,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 0,
    });
  });

  test("Should move to the next phrase after erasing", () => {
    const progress = {
      phrase: "t",
      phraseIdx: 0,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.erasingSpeed.timeMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "",
      phraseIdx: 1,
      status: TypewriterStatus.WaitingToType,
      loopsCompleted: 0,
    });
  });

  test("Should increment loops count after last phrase is completely typed", () => {
    const progress = {
      phrase: "phrase",
      phraseIdx: 1,
      status: TypewriterStatus.WaitingToErase,
      loopsCompleted: 0,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.erasingSpeed.startDelayMs);
    expect(onNext).toHaveBeenCalledWith({
      phrase: "phrase",
      phraseIdx: 1,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 1,
    });
  });

  test("Should not invoke onNext after once loop limit is reached", () => {
    const progress = {
      phrase: "phrase",
      phraseIdx: 1,
      status: TypewriterStatus.Erasing,
      loopsCompleted: 2,
    };
    const onNext = jest.fn();

    typeNext(phrases, options, progress, onNext);

    jest.advanceTimersByTime(options.erasingSpeed.timeMs);
    expect(onNext).not.toHaveBeenCalled();
  });
});
