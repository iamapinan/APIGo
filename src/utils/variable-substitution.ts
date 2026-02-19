export interface EnvironmentParameter {
  key: string;
  value: string;
  isEnabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentParameter[];
  headers?: EnvironmentParameter[]; // Global headers for this environment
}

/**
 * Replaces {{key}} with value from variables.
 * Handles recursive substitution up to a limit to prevent loops.
 */
export function substituteVariables(
  content: string,
  variables: EnvironmentParameter[],
): string {
  if (!content || !variables || variables.length === 0) {
    return content;
  }

  let result = content;
  let hasChanged = true;
  let iterations = 0;
  const maxIterations = 5; // Prevent infinite loops

  while (hasChanged && iterations < maxIterations) {
    hasChanged = false;
    iterations++;

    for (const variable of variables) {
      if (!variable.isEnabled) continue;

      const placeholder = `{{${variable.key}}}`;
      if (result.includes(placeholder)) {
        // global replace
        result = result.split(placeholder).join(variable.value);
        hasChanged = true;
      }
    }
  }

  return result;
}

/**
 * Substitutes variables in a headers array.
 * Returns a new array with substituted values.
 */
export function substituteHeaders(
  headers: { key: string; value: string; isEnabled: boolean }[],
  variables: EnvironmentParameter[],
) {
  return headers.map((h) => ({
    ...h,
    key: substituteVariables(h.key, variables),
    value: substituteVariables(h.value, variables),
  }));
}
