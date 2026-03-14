export type ContributingGuideType = {
  title: string;
  docs: string;
  description?: string;
  meta?: {
    new: boolean;
  };
};

export const contributingGuides: ContributingGuideType[] = [
  {
    title: "Component",
    description:
      "Contribute reusable backend components for Node.js projects. Learn about component structure, testing, and submission guidelines.",
    docs: "/docs/contributing/component",
    meta: {
      new: true,
    },
  },
  {
    title: "Blueprint",
    description:
      "Create and share complete project blueprints. Understand blueprint architecture and how to design scalable application templates.",
    docs: "/docs/contributing/blueprint",
    meta: {
      new: true,
    },
  },
  {
    title: "Foundation",
    description:
      "Build foundational elements like authentication, database connections, and core utilities. Contribute to the base layers of Servercn.",
    docs: "/docs/contributing/foundation",
    meta: {
      new: true,
    },
  },
  {
    title: "Schema",
    description:
      "Define and contribute data schemas for consistent API structures. Learn about schema validation and documentation standards.",
    docs: "/docs/contributing/schema",
    meta: {
      new: true,
    },
  }
];
