import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResultView from "../ResultView";

describe("ResultView", () => {
  it("renders fallback title when payload root is invalid", () => {
    render(<ResultView data={null} />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Untitled report",
    });
    expect(heading).toBeTruthy();
  });

  it("renders unknown section fallback safely", () => {
    render(
      <ResultView
        data={{
          title: "Unknown",
          sections: [{ type: "future-type", anything: "x" }],
        }}
      />,
    );

    const fallback = screen.getByText(
      /Unsupported section type `future-type`/,
    );
    expect(fallback).toBeTruthy();
  });
});
