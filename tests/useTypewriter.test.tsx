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
