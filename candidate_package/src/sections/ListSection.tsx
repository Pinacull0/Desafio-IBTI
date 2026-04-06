import React from "react";
import type { ListSectionModel } from "../core/types";

interface ListSectionProps {
  section: ListSectionModel;
}

export function ListSection({ section }: ListSectionProps) {
  if (section.items.length === 0) {
    return <p>No list items available.</p>;
  }

  return (
    <ul>
      {section.items.map((item, index) => (
        <li key={`${section.key}-item-${index}`}>
          {item.text}
          {item.meta ? ` (${item.meta})` : ""}
        </li>
      ))}
    </ul>
  );
}
