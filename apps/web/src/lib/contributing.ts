export type ContributingGuideType = {
  title: string;
  docs: string;
  description?: string;
};



export  const contributingGuides: ContributingGuideType[] = [
   {
     title: "Component",
     description:
       "Contribute reusable backend components for Node.js projects. Learn about component structure, testing, and submission guidelines.",
     docs: "/docs/contributing/component"
   },
   {
     title: "Blueprint",
     description:
       "Create and share complete project blueprints. Understand blueprint architecture and how to design scalable application templates.",
     docs: "/docs/contributing/blueprint"
   },
   {
     title: "Foundation",
     description:
       "Build foundational elements like authentication, database connections, and core utilities. Contribute to the base layers of ServerCN.",
     docs: "/docs/contributing/foundation"
   },
   {
     title: "Schema",
     description:
       "Define and contribute data schemas for consistent API structures. Learn about schema validation and documentation standards.",
     docs: "/docs/contributing/schema"
   },
   {
     title: "Tooling",
     description:
       "Develop and contribute development tools, scripts, and utilities. Enhance the ServerCN development experience.",
     docs: "/docs/contributing/tooling"
   }
 ];