export type UnknownRecord = Record<string, unknown>;

export interface RawResultData extends UnknownRecord {
  title?: unknown;
  sections?: unknown;
}

export interface BaseSectionModel {
  key: string;
}

export interface TextSectionModel extends BaseSectionModel {
  type: "text";
  content: string;
}

export interface ListSectionItemModel {
  text: string;
  meta?: string;
}

export interface ListSectionModel extends BaseSectionModel {
  type: "list";
  items: ListSectionItemModel[];
}

export interface HighlightSectionModel extends BaseSectionModel {
  type: "highlight";
  content: string;
}

export type CalloutSeverity = "info" | "warning" | "critical";

export interface CalloutSectionModel extends BaseSectionModel {
  type: "callout";
  content: string;
  severity: CalloutSeverity;
  icon?: string;
}

export interface MetricSectionModel extends BaseSectionModel {
  type: "metric";
  label: string;
  value: string;
}

export interface UnknownSectionModel extends BaseSectionModel {
  type: "unknown";
  rawType: string;
  reason: string;
}

export type KnownSectionType =
  | "text"
  | "list"
  | "highlight"
  | "callout"
  | "metric";

export type KnownSectionModel =
  | TextSectionModel
  | ListSectionModel
  | HighlightSectionModel
  | CalloutSectionModel
  | MetricSectionModel;

export type SectionModel = KnownSectionModel | UnknownSectionModel;

export interface ResultDocumentModel {
  title: string;
  sections: SectionModel[];
}

export interface NormalizeContext {
  key: string;
  rawType: string;
}
