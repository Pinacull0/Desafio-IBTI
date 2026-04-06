# Structured UI Renderer – Refactoring Challenge

## Objective

You will refactor and improve an existing implementation to make it scalable, robust, and maintainable—while **making reasonable product/engineering decisions** under an incomplete spec.

## Time

1–2 hours. Focus on quality.

**Important:** You do **not** need to implement perfect handling for every edge case in the provided data. **Prioritization and clear written assumptions** count as much as code coverage. Say what you deferred and why.
At minimum, your solution should correctly render at least the default `data` payload without runtime errors.

## Data

- Default payload: [`src/mockData.ts`](src/mockData.ts) (`data`).
- Optional named scenarios: `fixtures` in the same file (e.g. missing `sections`, empty title). Use them if helpful; you may also discuss them only in your write-up.

## Requirements (some are intentionally vague)

### 1. Refactor

Improve structure, remove duplication, and improve readability.

### 2. Extensible rendering system (architectural constraint)

Implement a scalable way to render different section types (including types you add, e.g. `callout`, and legacy/varied shapes).

**Hard constraint:** Avoid centralized conditional rendering logic (`if`/`else`/`switch`) as the primary mechanism for dispatching section types. Prefer an extensible renderer registry or strategy-based model.

### 3. New section feature (required)

Add support for a new section type: `metric` with `label` + `value`.

### 4. Error handling / safety

Handle invalid or partial data without crashing (e.g. null/missing fields, unknown section types). **Unknown or unsupported sections must be handled in a user-safe way**—we are not prescribing the exact UI or copy; defend your choice in **Assumptions & priorities** below.

### 5. Typing

Use TypeScript properly. Prefer explicit and safe typing over generic or loosely typed solutions. Avoid `any` in your final design (migrations from `any` during refactor are fine if explained).

### 6. Minimum componentization

Each section type must have its own dedicated component (avoid a single “god component” handling all section rendering).

### 7. Delivery write-up (MANDATORY)

#### Assumptions & priorities (required subsection)

Include a bullet list covering at least:

- **Priority order** — what you tackled first and what you skipped or simplified.
- **Explicit out-of-scope** — what you chose not to solve in the time box.
- **With more time** — the next 2–3 improvements you would make.

#### Reflective questions (answer all)

- What did you change and why?
- What would you improve next?
- How would you scale this if the number of section types grew ~10×?
- How did you handle unknown/invalid data and ambiguous payloads (e.g. legacy keys, mixed list items)?
- How would you test this (what cases, what layers—unit vs integration, etc.)?
- Which decision would you revisit first if this went to production tomorrow, and why?
- Did you use AI tools? If yes, how?

Prefer simple and pragmatic solutions over over-engineering. You are not expected to fully support every edge case—prioritization is part of the evaluation.

## Tasks (checklist)

1. Refactor
2. Extensible rendering
3. Add `metric` section type (`label` + `value`)
4. Error handling / graceful degradation
5. Typing
6. Componentize by section type
7. Write-up (Assumptions & priorities + reflective questions)

## Delivery

- GitHub repo link
- Ensure your README write-up or `SUBMISSION.md` is visible in the repo (same content as above is fine).
