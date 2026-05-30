import type { Architecture, FrameworkType, GeneratorType } from "@/types";
import { capitalize } from "@/utils/capitalize";
import { toCamelCase } from "@/utils/naming";


export function expressjsControllerTemplate({
  arch,
  className
}: {
  arch: Architecture;
  className: string;
}) {
  if (arch === "feature" || arch === "mvc") {
    return `import { Request, Response } from "express";

class ${capitalize(className)}Controller {
  async test(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: "Controller added successfully"
    });
  }
}

export const ${toCamelCase(className)}Controller = new ${capitalize(className)}Controller();`;
  }
}

export function expressjsServiceTemplate({
  arch,
  className
}: {
  arch: Architecture;
  className: string;
}) {
  if (arch === "feature" || arch === "mvc") {
    return `export class ${capitalize(className)}Service {
  constructor() {}

  async test() {
    return "service test";
  }
}

export const ${toCamelCase(className)}Service = new ${capitalize(className)}Service();
`;
  }
}

export function expressjsRoutesTemplate({ arch }: { arch: Architecture }) {
  if (arch === "feature" || arch === "mvc") {
    return `import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default router;
`;
  }
}

export function expressjsModelTemplate({
  arch,
  modelName
}: {
  arch: Architecture;
  modelName: string;
}) {
  if (arch === "feature" || arch === "mvc") {
    return `import mongoose, { Document, Model, Schema } from "mongoose";

export interface I${capitalize(modelName)} extends Document {
  _id: mongoose.Types.ObjectId;

  name: string;

  createdAt: Date;
  updatedAt: Date;
}

const ${toCamelCase(modelName)}Schema = new Schema<I${capitalize(modelName)}>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const ${capitalize(modelName)}: Model<I${capitalize(modelName)}> =
  mongoose.models.${capitalize(modelName)} || mongoose.model<I${capitalize(modelName)}>("${capitalize(modelName)}", ${toCamelCase(modelName)}Schema);

export default ${capitalize(modelName)};
`;
  }
}

export function getGeneratorTemplates({
  framework,
  type,
  arch,
  name
}: {
  framework: FrameworkType;
  type: GeneratorType;
  arch: Architecture;
  name: string;
}) {
  if (framework === "express") {
    switch (type) {
      case "controller":
        return expressjsControllerTemplate({ arch, className: name });
      case "service":
        return expressjsServiceTemplate({ arch, className: name });
      case "route":
        return expressjsRoutesTemplate({ arch });
      case "model":
        return expressjsModelTemplate({ arch, modelName: name });
    }
  }
  
}
