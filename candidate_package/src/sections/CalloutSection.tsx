import React from "react";
import type { CalloutSectionModel } from "../core/types";

interface CalloutSectionProps {
  section: CalloutSectionModel;
}

const severityLabel = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

export function CalloutSection({ section }: CalloutSectionProps) {
  return (
    <aside aria-live="polite">
      <p>
        <strong>{severityLabel[section.severity]}:</strong>{" "}
        {section.icon ? `[${section.icon}] ` : ""}
        {section.content}
      </p>
    </aside>
  );
}
