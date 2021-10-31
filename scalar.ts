import { GQUnknown } from "./types";

/**
 * Casts an empty object to T to keep type validity while querying a gql scalar
 */
export const GQScalar = <T>(): GQUnknown<T> => (({} as unknown) as T);

export function withGQScalar<T, K extends keyof T>(object: T, keys: K[]): T {
  let result = { ...object };
  keys.forEach(key => {
    result[key] = GQScalar<T[K]>();
  });
  return result;
}
