import React from "react";
import type { HighlightSectionModel } from "../core/types";

interface HighlightSectionProps {
  section: HighlightSectionModel;
}

export function HighlightSection({ section }: HighlightSectionProps) {
  return <strong>{section.content}</strong>;
}
