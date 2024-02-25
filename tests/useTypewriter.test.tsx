import { renderHook, act } from "@testing-library/react";
import useTypewriter from "../src/useTypewriter";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
  jest.clearAllTimers();
});

test("empty phrases list returns empty string phrase", () => {
  const { result } = renderHook(() =>
    useTypewriter({
      phrases: [],
    })
  );

  act(() => {
    result.current.start();
  });

  expect(result.current.phrase).toBe("");
});

test("one phrase with default options (unit = word) returns sequence increasing by a word", () => {
  const timeDelayMs = 500; //default options

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Stanley stands sadly on the steep steps"],
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "Stanley",
    "Stanley stands",
    "Stanley stands sadly",
    "Stanley stands sadly on",
    "Stanley stands sadly on the",
    "Stanley stands sadly on the steep",
    "Stanley stands sadly on the steep steps",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("one phrase with character unit and speed 2 returns sequence increasing by 2 chars", () => {
  const timeDelayMs = 200;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Stanley stands "],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 2,
          timeDelayMs,
        },
        eraseAtOnce: true,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "St",
    "Stan",
    "Stanle",
    "Stanley ",
    "Stanley st",
    "Stanley stan",
    "Stanley stands",
    "Stanley stands ",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("multiple phrases with word unit returns each phrase one after the other", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["What came first?", "Chicken?", "Or", "Egg?"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs,
        },
        eraseAtOnce: true,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "What",
    "What came",
    "What came first?",
    "Chicken?",
    "Or",
    "Egg?",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("multiple phrases with characters unit returns each phrase one after the other", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Chicken?", "Or", "Egg?"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 3,
          timeDelayMs,
        },
        eraseAtOnce: true,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = ["Chi", "Chicke", "Chicken?", "Or", "Egg", "Egg?"];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("multiple phrases return phrases looping once last phrase has completed", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Chicken?", "Or", "Egg?", "Or"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 3,
          timeDelayMs,
        },
        eraseAtOnce: true,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "Chi",
    "Chicke",
    "Chicken?",
    "Or",
    "Egg",
    "Egg?",
    "Or",
    "Chi",
    "Chicke",
    "Chicken?",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("setting eraseAtOnce to false with unit word tracks backward in the current phrase before returning the next", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Ke dil haare, pukaare", "Mann ja re, mana le"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 2,
          timeDelayMs,
        },
        eraseAtOnce: false,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "Ke dil",
    "Ke dil haare, pukaare",
    "Ke dil",
    "",
    "Mann ja",
    "Mann ja re, mana",
    "Mann ja re, mana le",
    "Mann ja re, mana",
    "Mann ja",
    "",
    "Ke dil",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("setting eraseAtOnce to false with unit character tracks backward in the current phrase before returning the next", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Ke dil haare, pukaare", "Mann ja re, mana le"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 7,
          timeDelayMs,
        },
        eraseAtOnce: false,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = [
    "Ke dil ",
    "Ke dil haare, ",
    "Ke dil haare, pukaare",
    "Ke dil haare, ",
    "Ke dil ",
    "",
    "Mann ja",
    "Mann ja re, ma",
    "Mann ja re, mana le",
    "Mann ja re, ma",
    "Mann ja",
    "",
    "Ke dil ",
  ];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);
});

test("calling stop function clears the interval and stops typing", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Pale blue dot"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs,
        },
        eraseAtOnce: false,
      },
    })
  );

  let stopFn = () => {};

  act(() => {
    ({ stop: stopFn } = result.current.start());
  });

  const expectedResults = ["Pale", "Pale blue", "Pale blue dot", "Pale blue"];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);

  act(() => {
    stopFn();
    jest.advanceTimersByTime(timeDelayMs);
  });

  expect(result.current.phrase).toBe(
    expectedResults[expectedResults.length - 1]
  );
});

test("calling start after stop restarts the typing from where it was stopped", () => {
  const timeDelayMs = 100;

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Pale blue dot"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs,
        },
        eraseAtOnce: false,
      },
    })
  );

  let stopFn = () => {};

  act(() => {
    ({ stop: stopFn } = result.current.start());
  });

  const expectedResults = ["Pale", "Pale blue", "Pale blue dot"];

  validateResultsByAdvancingTimer(result, expectedResults, timeDelayMs);

  act(() => {
    stopFn();
    jest.advanceTimersByTime(timeDelayMs);
    ({ stop: stopFn } = result.current.start());
    jest.advanceTimersByTime(timeDelayMs);
  });

  expect(result.current.phrase).toBe("Pale blue");
});

function validateResultsByAdvancingTimer(
  resultRef: { current: { phrase: string } },
  expectedResults: string[],
  timeDelayMs: number
) {
  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(timeDelayMs);
    });
    expect(resultRef.current.phrase).toBe(er);
  }
}
