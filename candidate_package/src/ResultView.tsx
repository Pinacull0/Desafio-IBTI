import React from "react";
import { normalizeResultData } from "./core/normalization";
import { renderSection } from "./renderers/sectionRegistry";
import type { RawResultData } from "./core/types";

interface ResultViewProps {
  data: RawResultData | null | undefined;
}

export default function ResultView({ data }: ResultViewProps) {
  const document = normalizeResultData(data);

  return (
    <div>
      <h1>{document.title}</h1>
      {document.sections.map((section) => (
        <React.Fragment key={section.key}>{renderSection(section)}</React.Fragment>
      ))}
    </div>
  );
}
