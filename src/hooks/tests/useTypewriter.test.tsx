import { act, renderHook } from "@testing-library/react";
import useTypewriter from "../useTypewriter";

describe("useTypewriter hook", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const options = {
    typingSpeed: { numUnits: 10, timeMs: 100, startDelayMs: 10 },
    erasingSpeed: { numUnits: 10, timeMs: 50, startDelayMs: 1000 },
  };

  test("Should return empty phrase when empty phrases list is given", () => {
    const { result } = renderHook(() =>
      useTypewriter({
        phrases: [],
        options,
      })
    );

    act(() => {
      jest.advanceTimersByTime(options.typingSpeed.startDelayMs);
    });

    expect(result.current.phrase).toBe("");
  });

  test("Should return typing sequence in the given speed", () => {
    const { result } = renderHook(() =>
      useTypewriter({
        phrases: ["What came first?", "Chicken?", "Or", "Egg?"],
        options,
      })
    );

    act(() => {
      jest.advanceTimersByTime(options.typingSpeed.startDelayMs);
    });
    expect(result.current.phrase).toBe("");

    act(() => {
      jest.advanceTimersByTime(options.typingSpeed.timeMs);
    });
    expect(result.current.phrase).toBe("What came ");

    act(() => {
      jest.advanceTimersByTime(options.typingSpeed.timeMs);
    });
    expect(result.current.phrase).toBe("What came first?");

    act(() => {
      jest.advanceTimersByTime(options.erasingSpeed.startDelayMs);
    });
    expect(result.current.phrase).toBe("What came first?");

    act(() => {
      jest.advanceTimersByTime(options.erasingSpeed.timeMs);
    });
    expect(result.current.phrase).toBe("What c");
  });

  test("Should clean up pending timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() =>
      useTypewriter({
        phrases: ["What came first?", "Chicken?", "Or", "Egg?"],
        options,
      })
    );

    act(() => {
      unmount();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
