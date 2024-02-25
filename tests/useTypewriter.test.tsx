import { renderHook, act } from "@testing-library/react";
import useTypewriter from "../src/useTypewriter";

test("empty phrases", () => {
  const {
    result: {
      current: { phrase, start },
    },
  } = renderHook(() =>
    useTypewriter({
      phrases: [],
    })
  );

  act(() => {
    start();
  });

  expect(phrase).toBe("");
});

test("one phrase with default (unit = word) options", async () => {
  jest.useFakeTimers();

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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("one phrase with character unit", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Stanley stands "],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 2,
          timeDelayMs: 200,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("multiple phrases with word unit", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["What came first?", "Chicken?", "Or", "Egg?"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("multiple phrases with characters unit", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Chicken?", "Or", "Egg?"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 3,
          timeDelayMs: 100,
        },
        eraseAtOnce: true,
      },
    })
  );

  act(() => {
    result.current.start();
  });

  const expectedResults = ["Chi", "Chicke", "Chicken?", "Or", "Egg", "Egg?"];

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("multiple phrases looping", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Chicken?", "Or", "Egg?", "Or"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 3,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("unit = word, eraseAtOnce = false", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Ke dil haare, pukaare", "Mann ja re, mana le"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 2,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("unit = character, eraseAtOnce = false", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Ke dil haare, pukaare", "Mann ja re, mana le"],
      options: {
        unit: "character",
        speed: {
          numberOfUnits: 7,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }
});

test("stop typing", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Pale blue dot"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }

  act(() => {
    stopFn();
    jest.advanceTimersByTime(100);
  });

  expect(result.current.phrase).toBe(
    expectedResults[expectedResults.length - 1]
  );
});

test("restart typing", async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() =>
    useTypewriter({
      phrases: ["Pale blue dot"],
      options: {
        unit: "word",
        speed: {
          numberOfUnits: 1,
          timeDelayMs: 100,
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

  for (const er of expectedResults) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.phrase).toBe(er);
  }

  act(() => {
    stopFn();
    jest.advanceTimersByTime(100);
    ({ stop: stopFn } = result.current.start());
    jest.advanceTimersByTime(100);
  });

  expect(result.current.phrase).toBe("Pale blue");
});
