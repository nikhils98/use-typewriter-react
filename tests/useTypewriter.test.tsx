import { renderHook, act, waitFor } from "@testing-library/react";
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
    await waitFor(() => expect(result.current.phrase).toBe(er));
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
    await waitFor(() => expect(result.current.phrase).toBe(er));
  }
});
