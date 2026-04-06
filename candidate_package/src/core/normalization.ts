import type {
  CalloutSectionModel,
  CalloutSeverity,
  HighlightSectionModel,
  KnownSectionModel,
  KnownSectionType,
  ListSectionItemModel,
  ListSectionModel,
  MetricSectionModel,
  NormalizeContext,
  RawResultData,
  ResultDocumentModel,
  TextSectionModel,
  UnknownRecord,
  UnknownSectionModel,
} from "./types";
import {
  asPlainRecord,
  toSafeNonEmptyString,
  toSafeStringFromStringOrNumber,
  validateValueType,
} from "../utils/sanitization";

const FALLBACK_TITLE = "Untitled report";
const FALLBACK_RAW_TYPE = "missing-type";

type SectionParser = (
  section: UnknownRecord,
  context: NormalizeContext,
) => KnownSectionModel | UnknownSectionModel;

const sectionParsers: Record<KnownSectionType, SectionParser> = {
  text: parseTextSection,
  list: parseListSection,
  highlight: parseHighlightSection,
  callout: parseCalloutSection,
  metric: parseMetricSection,
};

export function normalizeResultData(
  data: RawResultData | null | undefined,
): ResultDocumentModel {
  const safeData = asPlainRecord(data) ?? {};
  const title = toSafeNonEmptyString(safeData.title) ?? FALLBACK_TITLE;
  const rawSections = Array.isArray(safeData.sections) ? safeData.sections : [];
  const seenKeys = new Map<string, number>();

  const sections = rawSections.map((candidate, index) => {
    const record = asPlainRecord(candidate);

    if (!record) {
      return createUnknownSection(
        `section-${index}`,
        FALLBACK_RAW_TYPE,
        "Section entry is not an object.",
      );
    }

    const key = buildSectionKey(record, index, seenKeys);
    const rawType =
      (toSafeNonEmptyString(record.type) ?? FALLBACK_RAW_TYPE).toLowerCase();

    if (!isKnownSectionType(rawType)) {
      return createUnknownSection(
        key,
        rawType,
        "Section type is unsupported or missing.",
      );
    }

    const parser = sectionParsers[rawType];
    return parser(record, { key, rawType });
  });

  return { title, sections };
}

function parseTextSection(
  section: UnknownRecord,
  context: NormalizeContext,
): TextSectionModel | UnknownSectionModel {
  const content =
    toSafeNonEmptyString(section.content) ?? toSafeNonEmptyString(section.body);

  if (!content) {
    return createUnknownSection(
      context.key,
      context.rawType,
      "Text section has no content/body.",
    );
  }

  return {
    key: context.key,
    type: "text",
    content,
  };
}

function parseListSection(
  section: UnknownRecord,
  context: NormalizeContext,
): ListSectionModel {
  return {
    key: context.key,
    type: "list",
    items: parseListItems(section.items),
  };
}

function parseHighlightSection(
  section: UnknownRecord,
  context: NormalizeContext,
): HighlightSectionModel | UnknownSectionModel {
  const content = toSafeNonEmptyString(section.content);

  if (!content) {
    return createUnknownSection(
      context.key,
      context.rawType,
      "Highlight section has no content.",
    );
  }

  return {
    key: context.key,
    type: "highlight",
    content,
  };
}

function parseCalloutSection(
  section: UnknownRecord,
  context: NormalizeContext,
): CalloutSectionModel | UnknownSectionModel {
  const content = toSafeNonEmptyString(section.content);

  if (!content) {
    return createUnknownSection(
      context.key,
      context.rawType,
      "Callout section has no content.",
    );
  }

  return {
    key: context.key,
    type: "callout",
    content,
    severity: parseSeverity(section.severity),
    icon: toSafeNonEmptyString(section.icon) ?? undefined,
  };
}

function parseMetricSection(
  section: UnknownRecord,
  context: NormalizeContext,
): MetricSectionModel | UnknownSectionModel {
  const label = toSafeNonEmptyString(section.label);
  const value = toSafeStringFromStringOrNumber(section.value);

  if (!label || !value) {
    return createUnknownSection(
      context.key,
      context.rawType,
      "Metric section requires label and value.",
    );
  }

  return {
    key: context.key,
    type: "metric",
    label,
    value,
  };
}

function parseListItems(items: unknown): ListSectionItemModel[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const normalizedItems: ListSectionItemModel[] = [];

  for (const item of items) {
    if (validateValueType(item, "string")) {
      const text = toSafeNonEmptyString(item);
      if (text) {
        normalizedItems.push({ text });
      }
      continue;
    }

    const itemRecord = asPlainRecord(item);
    if (!itemRecord) {
      continue;
    }

    const text = toSafeNonEmptyString(itemRecord.text);
    if (!text) {
      continue;
    }

    normalizedItems.push({
      text,
      meta: toSafeNonEmptyString(itemRecord.meta) ?? undefined,
    });
  }

  return normalizedItems;
}

function parseSeverity(value: unknown): CalloutSeverity {
  const normalized = toSafeNonEmptyString(value)?.toLowerCase();
  if (
    normalized === "warning" ||
    normalized === "critical" ||
    normalized === "info"
  ) {
    return normalized;
  }
  return "info";
}

function isKnownSectionType(value: string): value is KnownSectionType {
  return Object.prototype.hasOwnProperty.call(sectionParsers, value);
}

function createUnknownSection(
  key: string,
  rawType: string,
  reason: string,
): UnknownSectionModel {
  return {
    key,
    type: "unknown",
    rawType,
    reason,
  };
}

function buildSectionKey(
  section: UnknownRecord,
  index: number,
  seenKeys: Map<string, number>,
): string {
  const candidateId = toSafeNonEmptyString(section.id);
  const baseKey = candidateId ?? `section-${index}`;
  const count = seenKeys.get(baseKey) ?? 0;
  seenKeys.set(baseKey, count + 1);

  if (count === 0) {
    return baseKey;
  }

  return `${baseKey}__dup${count}`;
}
