import React from "react";
import type { UnknownSectionModel } from "../core/types";

interface UnknownSectionProps {
  section: UnknownSectionModel;
}

export function UnknownSection({ section }: UnknownSectionProps) {
  return (
    <div role="note">
      Unsupported section type `{section.rawType}`. {section.reason}
    </div>
  );
}
