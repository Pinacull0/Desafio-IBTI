import React from "react";
import { CalloutSection } from "../sections/CalloutSection";
import { HighlightSection } from "../sections/HighlightSection";
import { ListSection } from "../sections/ListSection";
import { MetricSection } from "../sections/MetricSection";
import { TextSection } from "../sections/TextSection";
import { UnknownSection } from "../sections/UnknownSection";
import type { SectionModel } from "../core/types";

type SectionRenderer<K extends SectionModel["type"]> = (
  section: Extract<SectionModel, { type: K }>,
) => React.ReactElement;

const sectionRenderers: {
  [K in SectionModel["type"]]: SectionRenderer<K>;
} = {
  text: (section) => <TextSection section={section} />,
  list: (section) => <ListSection section={section} />,
  highlight: (section) => <HighlightSection section={section} />,
  callout: (section) => <CalloutSection section={section} />,
  metric: (section) => <MetricSection section={section} />,
  unknown: (section) => <UnknownSection section={section} />,
};

export function renderSection(section: SectionModel): React.ReactElement {
  const renderer = sectionRenderers[section.type] as (
    entry: SectionModel,
  ) => React.ReactElement;
  return renderer(section);
}
