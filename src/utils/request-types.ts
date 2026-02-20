export type BodyType = "none" | "raw" | "urlencoded" | "formdata";

export interface KeyVal {
  key: string;
  value: string;
  isEnabled: boolean;
  type?: "text"; // For formdata
}

export interface StructuredBody {
  type: BodyType;
  raw: string;
  urlencoded: KeyVal[];
  formdata: KeyVal[];
}

export function parseBodyContent(content: string): StructuredBody {
  try {
    if (!content) throw new Error("empty");
    const parsed = JSON.parse(content);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.type === "string"
    ) {
      // Looks like a StructuredBody
      return {
        type: parsed.type,
        raw: parsed.raw || "",
        urlencoded: Array.isArray(parsed.urlencoded) ? parsed.urlencoded : [],
        formdata: Array.isArray(parsed.formdata) ? parsed.formdata : [],
      };
    }
    throw new Error("not structured");
  } catch {
    // If it fails to parse as StructuredBody, treat the whole content as raw string
    return {
      type: content ? "raw" : "none",
      raw: content,
      urlencoded: [],
      formdata: [],
    };
  }
}

export function stringifyBodyContent(body: StructuredBody): string {
  // If it's none, we might just store an empty string to save space or store the structured JSON.
  // Storing the structured JSON is safer for remembering the mode.
  return JSON.stringify(body);
}

export function substituteStructuredBody(
  body: StructuredBody,
  substituteFn: (val: string) => string,
): StructuredBody {
  return {
    ...body,
    raw: substituteFn(body.raw),
    urlencoded: body.urlencoded.map((item) => ({
      ...item,
      key: substituteFn(item.key),
      value: substituteFn(item.value),
    })),
    formdata: body.formdata.map((item) => ({
      ...item,
      key: substituteFn(item.key),
      value: substituteFn(item.value),
    })),
  };
}
