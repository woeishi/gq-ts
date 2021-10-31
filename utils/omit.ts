import { GQObject } from "../types";
import { gqFilter } from "./filter";

/**
 * The equivalent to typescript Omit<Type,Key> utility
 */
export function gqOmit<T, K extends keyof T>(
  object: T,
  keys: K[]
): Omit<T, K> & GQObject {
  return gqFilter(object, keys, (keys, key) => !keys.includes(key));
}
