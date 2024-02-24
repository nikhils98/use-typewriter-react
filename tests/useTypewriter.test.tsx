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

test("one phrase with default options", async () => {
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
