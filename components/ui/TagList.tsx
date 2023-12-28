import React from "react";
import { Pill, PillProps } from "./Pill";

type TagListProps = {
  label: string;
  tags: string[];
  color?: PillProps["color"];
};

const TagList: React.FC<TagListProps> = ({ label, tags, color = "green" }) => {
  return (
    <div>
      <h4 className="font-bold">{label}</h4>
      <ul className="flex flex-wrap">
        {tags.map((tag, index) => (
          <li key={index}>
            <Pill text={tag} color={color} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;
