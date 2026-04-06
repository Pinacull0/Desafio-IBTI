import { describe, expect, it } from "vitest";
import { normalizeResultData } from "../core/normalization";

describe("normalizeResultData", () => {
  it("uses fallback title and empty sections for null payload", () => {
    const result = normalizeResultData(null);

    expect(result.title).toBe("Untitled report");
    expect(result.sections).toEqual([]);
  });

  it("supports legacy text body field", () => {
    const result = normalizeResultData({
      title: "Legacy",
      sections: [{ type: "text", body: "Legacy body text" }],
    });

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]).toMatchObject({
      type: "text",
      content: "Legacy body text",
    });
  });

  it("maps unsupported section to unknown", () => {
    const result = normalizeResultData({
      title: "Unknown type case",
      sections: [{ type: "freetext", payload: "future schema" }],
    });

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]).toMatchObject({
      type: "unknown",
      rawType: "freetext",
    });
  });

  it("deduplicates repeated stable ids for safe keys", () => {
    const result = normalizeResultData({
      title: "duplicate ids",
      sections: [
        { id: "sec-a", type: "text", content: "one" },
        { id: "sec-a", type: "text", content: "two" },
      ],
    });

    expect(result.sections[0]?.key).toBe("sec-a");
    expect(result.sections[1]?.key).toBe("sec-a__dup1");
  });

  it("parses metric section with label and value", () => {
    const result = normalizeResultData({
      title: "metrics",
      sections: [{ type: "metric", label: "Fraud score", value: 82 }],
    });

    expect(result.sections[0]).toMatchObject({
      type: "metric",
      label: "Fraud score",
      value: "82",
    });
  });
});
