"use client";

import { useState } from "react";
import { Clock, ExternalLink, SparklesIcon } from "lucide-react";
import { getIconForAi, type AiName } from "./icons/ai-icons";
import { AI_QUERIES, SERVERCN_URL } from "@/lib/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { usePathname } from "next/navigation";

const defaultPrompt =
  "Read this ServerCN documentation properly and provide information i ask. \nMake it clear and concise.";

export function OpenInAi() {
  const pathname = usePathname();
  const [selectKey, setSelectKey] = useState(0);

  const redirectToAi = (_ai: AiName) => {
    const prompt = SERVERCN_URL + pathname + "\n" + defaultPrompt;

    const aiurl = AI_QUERIES.find(q => q.name === _ai)?.url(prompt);

    if (aiurl) {
      window.open(aiurl, "_blank");
    }

    setSelectKey(prev => prev + 1);
  };

  return (
    <div className="max-w-45">
      <Select key={selectKey} onValueChange={redirectToAi}>
        <SelectTrigger className="text-primary w-full md:w-44">
          <SelectValue
            placeholder={
              <div className="text-primary font-medium flex items-center justify-center space-x-2">
                <SparklesIcon size={16} className="text-primary" />
                <p>Open in AI</p>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          {AI_QUERIES.toSorted((a, b) => a.label.localeCompare(b.label)).map(
            query => (
              <SelectItem
                key={query.name}
                value={query.name}
                disabled={!query.isAvailable}>
                <div>{getIconForAi(query.name)}</div>
                <p className="text-primary capitalize">{query.label}</p>
                {!query.isAvailable && (
                  <span>
                    <Clock size={16} />
                  </span>
                )}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
