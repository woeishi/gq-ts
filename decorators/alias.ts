import { FieldAlias, WithAlias } from "../types";

/**
 * Decorates an object property to be resolved as alias in a graphql query
 * @param key property to (be the) alias
 * @param fieldName unaliased gql field name
 * @returns the input object with an additional field marking the alias
 */
export function withAlias<T, K extends string & keyof T>(
  object: T,
  key: K,
  fieldName: string
): WithAlias<T, K> {
  const keyAlias = {
    [`@${key}Alias`]: fieldName,
  } as FieldAlias<T, K>;
  return {
    ...keyAlias,
    ...object,
  };
}

export function isAliasKey(key: string) {
  return key.match(/@.*?Alias/);
}

export function getAliasFieldName(key: string) {
  return key.substring(1, key.length - 5);
}
