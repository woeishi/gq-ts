import { FieldArgs, WithArgs } from "../types";

/**
 * Decorates an object property to be resolved with arguments in a graphql query
 * @param key property to add the arguments on
 * @param args input arguments as object, generates values starting with '$' as gql variables
 * @returns the input object with an additional field storing the arguments
 */
export function withArgs<T, K extends string & keyof T>(
  type: T,
  key: K,
  args: Record<string, any>
): WithArgs<T, K> {
  const keyArgs = {
    [`@${key}Args`]: args,
  } as FieldArgs<T, K>;
  return {
    ...keyArgs,
    ...type,
  };
}

export function generateArgs(args: Record<string, any>): string {
  return Object.entries(args)
    .map(([k, v]) => {
      return `${k}: ${generateValue(v)}`;
    })
    .join(" ");
}

function generateValue(value: any): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string")
    return value.startsWith("$") ? value : `"${value}"`;
  if (Array.isArray(value))
    return `[${value.map(v => generateValue(v)).join()}]`;
  if (value.constructor === Object) return `{${generateArgs(value)}}`;
  return typeof value;
}

export function isArgsKey(key: string) {
  return key.match(/@.*?Args/);
}

export function getArgsFieldName(key: string) {
  return key.substring(1, key.length - 4);
}
