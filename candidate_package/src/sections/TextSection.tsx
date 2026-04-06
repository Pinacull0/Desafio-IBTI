import React from "react";
import type { TextSectionModel } from "../core/types";

interface TextSectionProps {
  section: TextSectionModel;
}

export function TextSection({ section }: TextSectionProps) {
  return <p>{section.content}</p>;
}
