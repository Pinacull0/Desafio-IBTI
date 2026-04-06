# Submission

## Assumptions & priorities

- Priority order:
  - First, I addressed the highest risk area: payload normalization and strong typing. Since the input is inconsistent, UI improvements would be fragile without this foundation.
  - Next, I replaced centralized dispatch with an extensible renderer registry.
  - Then, I implemented the required new section type (`metric`) and ensured each section type has its own component.
  - Finally, I completed graceful degradation for invalid/unknown data and added automated tests.
- Explicit out-of-scope:
  - I did not focus on visual polish/CSS design. The scope here was architecture and robustness.
  - I did not implement i18n for fallback messages.
  - I did not add an external schema-validation layer at the API boundary (for example, zod/io-ts).
- With more time:
  - Expand automated coverage with more fixture scenarios and deeper negative-path cases.
  - Introduce contract versioning and migration rules for legacy payloads.
  - Add telemetry to monitor malformed/unknown section frequency in production.

## Reflective questions

### What did you change and why?

I reorganized the codebase to separate responsibilities: `core` (types and normalization), `renderers` (registry), `sections` (UI components), `utils` (sanitization), and `tests`.
I made this change because the original implementation concentrated too much logic in one place, making safe extension difficult.

Main changes:
- Replaced `any`-based flow with explicit TypeScript models (`src/core/types.ts`).
- Added a normalization step before rendering (`src/core/normalization.ts`).
- Implemented extensible dispatch through a registry (`src/renderers/sectionRegistry.tsx`), instead of centralized `if/else/switch` logic as the main mechanism.
- Added the new required `metric` section type with `label` + `value`.
- Added safe handling for unknown sections and partial payloads without runtime crashes.
- Added `src/utils/sanitization.ts` for sanitization/coercion/validation and malicious payload mitigation.
- Added automated tests (currently 14/14 passing).

### What would you improve next?

- Cover more edge cases for heterogeneous list items and malformed payloads.
- Add more fixture-driven integration tests to reduce regression risk.
- Improve UX/copy strategy for invalid/unknown sections in production contexts.

### How would you scale this if the number of section types grew ~10x?

- Keep parser and renderer registries as extension points.
- Standardize a per-section module pattern (parser + component + tests), so each new type remains isolated.
- If needed, evolve to plugin-like registration to reduce coupling between teams and feature sets.

### How did you handle unknown/invalid data and ambiguous payloads (e.g. legacy keys, mixed list items)?

- I normalize payloads before rendering.
- `text` supports both `content` and legacy `body`.
- `list` supports both string items and object items with `text` (optional `meta`).
- Missing/unknown section types are mapped to `unknown` with a safe fallback.
- Missing `sections`, null items, or malformed values degrade gracefully without crashes.
- Duplicate IDs are deduplicated using a suffix (`__dupN`) to keep stable render keys.

### How would you test this (what cases, what layers - unit vs integration, etc.)?

- Unit tests:
  - section normalization rules
  - fallback behavior
  - key deduplication
  - sanitization (XSS, SQLi, coercion, and type/value validation)
- Component tests:
  - rendering per section type
  - unknown-section fallback rendering
- Integration tests:
  - full render of the default payload
  - fixture scenarios (empty title, missing sections, legacy payload)

Current result: `npm test` passes with 14/14 tests.

### Which decision would you revisit first if this went to production tomorrow, and why?

I would revisit the UX behavior for invalid/unknown data first.
The current behavior is safe and functional, but for production I would further align copy, user-facing noise level, and observability (logs/metrics).

### Did you use AI tools? If yes, how?

Yes. I used AI tools to accelerate implementation, structure reviews, and technical writing support.
Final architectural decisions, trade-offs, and requirement validation were reviewed manually against the challenge brief.