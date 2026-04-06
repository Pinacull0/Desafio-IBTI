# Submission

## Assumptions & priorities

- Priority order:
  - Build a typed normalization layer first, because payload inconsistency is the main source of runtime risk.
  - Replace centralized conditional rendering with a registry-based renderer dispatch.
  - Add required `metric` section type and ensure each section has a dedicated component.
  - Handle unknown/invalid sections with safe fallback rendering instead of crashes.
- Explicit out-of-scope:
  - No visual design system/CSS polish; focus stayed on architecture and behavior.
  - No full i18n strategy for fallback/error messages.
  - No schema validation library integration (e.g. zod/io-ts) due timebox.
- With more time:
  - Expand automated coverage (fixtures-driven integration and deeper negative-path rendering assertions).
  - Introduce schema versioning and migration utilities for legacy contracts.
  - Add telemetry hooks to count malformed/unknown sections in production payloads.

## Reflective questions

### What did you change and why?

- Replaced `any`-based rendering logic with explicit TypeScript models (`src/core/types.ts`).
- Added `normalizeResultData` (`src/core/normalization.ts`) to sanitize and normalize ambiguous payloads before UI rendering.
- Implemented renderer registry (`src/renderers/sectionRegistry.tsx`) so section dispatch is extensible and not centered on `if/else/switch`.
- Split each section type into its own component under `src/sections`.
- Added required `metric` support in parser/renderer/components and included a `metric` sample in `src/mockData.ts`.
- Added automated tests for normalization and rendering safety in critical scenarios.
- Added `src/utils/sanitization.ts` with threat detection/neutralization (XSS, obfuscated payloads, SQLi patterns), value/type validation and forced conversion helpers.

### What would you improve next?

- Expand tests around:
  - mixed list item edge cases
  - missing `type` and malformed section payloads
  - fixture-driven integration coverage
- Add stricter payload contracts at API boundary (schema validation + typed decode errors).
- Improve UX copy and visual hierarchy for unknown/invalid sections.

### How would you scale this if the number of section types grew ~10x?

- Keep parser and renderer registries as extension points.
- Add per-section modules (`normalize`, `component`, `tests`) so new types are isolated and low-risk.
- Optionally move to plugin-like registration so section types can be shipped independently.

### How did you handle unknown/invalid data and ambiguous payloads (e.g. legacy keys, mixed list items)?

- Normalization handles contract ambiguity before render:
  - `text` supports `content` and legacy `body`.
  - `list` accepts string items and object items with `text` (optional `meta`).
  - missing/unsupported section type returns `unknown` section model with reason.
  - invalid shapes degrade safely (empty list or unknown section), never crash render.
- Duplicate `id` values are deduplicated for stable React keys (`id__dupN`).

### How would you test this (what cases, what layers - unit vs integration, etc.)?

- Unit tests:
  - normalization helpers and each section parser.
  - key generation and duplicate id behavior.
  - fallback title and fallback unknown section generation.
- Component tests:
  - each section component renders expected content.
  - unknown section message for unsupported types.
- Integration tests:
  - render full default `data` payload without runtime errors.
  - render each fixture (`emptyTitle`, `missingSections`, `minimalLegacy`) and assert graceful output.

### Which decision would you revisit first if this went to production tomorrow, and why?

- Unknown/invalid section UX. Current fallback is safe and explicit, but production may need product-approved copy, suppression rules, and monitoring integration to avoid noisy UI while preserving observability.

### Did you use AI tools? If yes, how?

- Yes. I used AI for implementation acceleration, architecture structuring, and write-up drafting. Final decisions and tradeoffs were validated against the challenge constraints.
