import {
  getAliasFieldName,
  getArgsFieldName,
  isAliasKey,
  isArgsKey,
  isInlineFragmentKey,
} from "../decorators/index";
import { GQObject } from "../types";

export function gqFilter<T, K extends keyof T>(
  obj: T,
  keys: K[],
  predicate: (keys: string[], key: string) => boolean
): T & GQObject {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if (isInlineFragmentKey(k)) return true;
      let key = k;
      if (isArgsKey(k)) key = getArgsFieldName(k);
      else if (isAliasKey(k)) key = getAliasFieldName(k);
      return predicate(keys as string[], key);
    })
  ) as T & GQObject;
}
