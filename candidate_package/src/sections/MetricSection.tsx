import React from "react";
import type { MetricSectionModel } from "../core/types";

interface MetricSectionProps {
  section: MetricSectionModel;
}

export function MetricSection({ section }: MetricSectionProps) {
  return (
    <section aria-label={`Metric ${section.label}`}>
      <p>{section.label}</p>
      <p>
        <strong>{section.value}</strong>
      </p>
    </section>
  );
}
