export interface WorkflowStep {
  name: string;
  tool: string;
}

export interface WorkflowData {
  name: string;
  steps: WorkflowStep[];
}

/**
 * Validates and exports data to a formatted JSON string.
 *
 * @param data - The data to serialize.
 * @returns A pretty-printed JSON string representing the data.
 * @throws {Error} If the data cannot be serialized to JSON.
 */
export function exportToJson(data: unknown): string {
  if (data === undefined) {
    throw new Error("Cannot serialize undefined data to JSON.");
  }
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to serialize data to JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validates and exports data to a YAML-compatible format safely without external dependencies.
 *
 * @param data - The data to serialize.
 * @returns A YAML-compatible string representing the data.
 * @throws {Error} If the data cannot be serialized to YAML.
 */
export function exportToYaml(data: unknown): string {
  if (data === undefined) {
    throw new Error("Cannot serialize undefined data to YAML.");
  }

  function stringifyYaml(value: unknown, indent: string = ""): string {
    if (value === null) {
      return "null";
    }
    if (typeof value === "string") {
      // Basic string escaping for special YAML characters or multiline
      if (
        value.includes("\n") ||
        value.includes(":") ||
        value.includes("#") ||
        value.trim() !== value ||
        value === "" ||
        value.startsWith("- ")
      ) {
        return `"${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
      }
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      return (
        "\n" +
        value
          .map((item) => {
            let stringifiedItem = stringifyYaml(item, indent + "  ");
            if (stringifiedItem.startsWith("\n")) {
              stringifiedItem = stringifiedItem.substring(1);
            }
            return `${indent}- ${stringifiedItem.trimStart()}`;
          })
          .join("\n")
      );
    }
    if (typeof value === "object") {
      const keys = Object.keys(value as Record<string, unknown>);
      if (keys.length === 0) return "{}";

      const isRoot = indent === "";
      let result = isRoot ? "" : "\n";

      result += keys
        .map((key) => {
          const val = (value as Record<string, unknown>)[key];
          const stringifiedVal = stringifyYaml(val, indent + "  ");

          let safeKey = key;
          if (
            key.includes(":") ||
            key.includes(" ") ||
            key.includes("#") ||
            key === ""
          ) {
            safeKey = `"${key.replace(/"/g, '\\"')}"`;
          }

          if (stringifiedVal.startsWith("\n")) {
            return `${indent}${safeKey}:${stringifiedVal}`;
          }
          return `${indent}${safeKey}: ${stringifiedVal}`;
        })
        .join("\n");

      return result;
    }

    throw new Error(`Unsupported data type: ${typeof value}`);
  }

  try {
    const result = stringifyYaml(data).trim();
    return result || '""';
  } catch (error) {
    throw new Error(
      `Failed to serialize data to YAML: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validates and exports workflow data to a Markdown summary.
 *
 * @param workflow - The workflow data containing a name and steps.
 * @returns A Markdown string representing the workflow summary.
 * @throws {Error} If the workflow data is invalid.
 */
export function exportToMarkdown(workflow: WorkflowData): string {
  if (!workflow || typeof workflow !== "object") {
    throw new Error("Invalid workflow data: must be an object.");
  }

  if (typeof workflow.name !== "string" || !workflow.name.trim()) {
    throw new Error(
      "Invalid workflow data: 'name' must be a non-empty string."
    );
  }

  if (!Array.isArray(workflow.steps)) {
    throw new Error("Invalid workflow data: 'steps' must be an array.");
  }

  let markdown = `# Workflow: ${workflow.name}\n\n`;

  if (workflow.steps.length === 0) {
    markdown += "_No steps defined._\n";
    return markdown;
  }

  markdown += `## Steps\n\n`;

  workflow.steps.forEach((step, index) => {
    if (!step || typeof step !== "object") {
      throw new Error(
        `Invalid workflow step at index ${index}: must be an object.`
      );
    }
    if (typeof step.name !== "string") {
      throw new Error(
        `Invalid workflow step at index ${index}: 'name' must be a string.`
      );
    }
    if (typeof step.tool !== "string") {
      throw new Error(
        `Invalid workflow step at index ${index}: 'tool' must be a string.`
      );
    }
    markdown += `${index + 1}. **${step.name}**\n   - Tool: \`${step.tool}\`\n`;
  });

  return markdown;
}
