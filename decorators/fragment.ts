import { InlineFragment, WithInlineFragment } from "../types";

/**
 * Decorates an object to be resolved wrapped as inline fragment in a graphql query
 * @param object properties to be wrapped in an inline fragment
 * @param key type or interface of the fragment '... on [key]'
 */
export function withInlineFragment<T>(
  object: T,
  key: string
): WithInlineFragment<T> {
  const fragment = {
    [`@inlineFragment`]: key,
  } as InlineFragment;
  return {
    ...fragment,
    ...object,
  };
}

export function isInlineFragmentKey(key: string) {
  return key === `@inlineFragment`;
}
