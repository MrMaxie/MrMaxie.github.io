type CssVariableName = `--${string}`;
type CssVariableValue = string | number | null | undefined;

export const cssVariables = (variables: Partial<Record<CssVariableName, CssVariableValue>>): string =>
  Object.entries(variables)
    .flatMap(([name, value]) => (value === null || value === undefined ? [] : [`${name}: ${value}`]))
    .join('; ');
