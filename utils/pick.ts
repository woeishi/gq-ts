import { GQObject } from "../types";
import { gqFilter } from "./filter";

/**
 * The equivalent to typescript Pick<Type,Key> utility
 */
export function gqPick<T, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K> & GQObject {
  return gqFilter(object, keys, (keys, key) => keys.includes(key));
}
