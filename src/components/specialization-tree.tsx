import { useState } from "react";
import type { TreeData } from "./types";
// import { renderTreeNode } from "./renderTreeNode";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dot } from "lucide-react";

interface SpecializationTreeProps {
  specializationDate: TreeData[];
  spActive: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function SpecializationTree({
  specializationDate,
  spActive,
  onChange,
}: SpecializationTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderTreeNode = (node: TreeData, level = 0) => {
    const isExpanded = expandedNodes.has(node.value);
    const hasChildren = node.children && node.children.length > 0;
    const isActive = spActive === node.value;

    return (
      <div key={node.value} style={{ paddingLeft: level === 0 ? 0 : 12 }}>
        <div
          className={`
            cursor-pointer 
            ${node.disabled ? "cursor-not-allowed text-gray-400" : ""} 
            ${isActive ? "text-blue-600 font-bold" : ""}
          `}
          onClick={() => {
            if (!node.disabled)
              onChange((prev) => (prev === node.value ? "" : node.value));
          }}
        >
          {hasChildren ? (
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.value);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={16} className="inline" />
              ) : (
                <ChevronRight size={16} className="inline" />
              )}
            </span>
          ) : (
            <Dot size={24} className="inline" />
          )}
          <span>{node.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <CardTitle className="text-2xl font-semibold">Спеціалізація</CardTitle>
        {specializationDate.map((node) => renderTreeNode(node))}
      </CardContent>
    </Card>
  );
}
