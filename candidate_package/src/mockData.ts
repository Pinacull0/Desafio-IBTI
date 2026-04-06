/**
 * Challenge payloads: intentionally inconsistent contracts (legacy fields, mixed shapes).
 * You are not required to handle every fixture in code—prioritize, document assumptions.
 *
 * TODO(product): list items may soon include { text, deprecatedLabel } alongside plain strings;
 * contract still being finalized—treat as an ambiguity in your write-up.
 */

export const data = {
  title: "Payment Analysis",
  sections: [
    { type: "text", content: "Standard summary paragraph." },
    // Legacy API: same conceptual type, different key ("body" vs "content")
    {
      type: "text",
      body: "Legacy ingest still sends `body` instead of `content`.",
    },
    { type: "list", items: ["Bullet A", "Bullet B"] },
    // Heterogeneous items: string OR structured object (your typing + rendering decision)
    {
      type: "list",
      items: [
        "Plain string row",
        { text: "Structured row", meta: "auditors only" },
        { text: "Row with only text" },
      ],
    },
    { type: "highlight", content: "Funds may be delayed" },
    { type: "metric", label: "Fraud score", value: "82" },
    {
      type: "callout",
      content: "Severity and icon are optional in the new schema.",
      severity: "warning",
      icon: "alert",
    },
    { type: "callout", content: "This callout omits severity/icon—define sensible defaults or omit UI." },
    // Deliberately provocative string: consider safe rendering / XSS in your assumptions doc (README).
    {
      type: "text",
      content:
        'Customer note contains angle brackets: <script>alert("xss")</script> and "&" entities.',
    },
    { id: "sec-notice", type: "text", content: "Notice with stable id." },
    { id: "sec-notice", type: "text", content: "Duplicate id—how should lists/keys behave?" },
    { type: "freetext", payload: "Unknown section type for forward compatibility." },
    { type: "list", items: null },
    // Missing `type`: contract gap
    { content: "Section object without type field." },
  ],
};

/** Optional: narrow edge cases—support in UI, or explain why out of scope. */
export const fixtures = {
  emptyTitle: {
    title: "",
    sections: [{ type: "text", content: "Only body copy when title missing." }],
  },
  missingSections: {
    title: "Report without sections array",
  },
  minimalLegacy: {
    title: "Legacy-only",
    sections: [{ type: "text", body: "Body-only text node." }],
  },
};
