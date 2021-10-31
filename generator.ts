import {
  generateArgs,
  getAliasFieldName,
  getArgsFieldName,
  isAliasKey,
  isArgsKey,
  isInlineFragmentKey,
} from "./decorators";
import { GQObject, GQType } from "./types";

interface GQObjectInfo {
  fragment?: string;
  fields: Record<string, GQType>;
  fieldArgs: Record<string, any>;
  fieldAlias: Record<string, string>;
}

function extractDecorators(obj: GQObject) {
  const info: GQObjectInfo = {
    fragment: undefined,
    fields: {},
    fieldArgs: {},
    fieldAlias: {},
  };
  for (const [key, value] of Object.entries(obj)) {
    if (isInlineFragmentKey(key)) {
      info.fragment = value as string;
    } else if (isArgsKey(key)) {
      const fieldName = getArgsFieldName(key);
      info.fieldArgs[fieldName] = value;
    } else if (isAliasKey(key)) {
      const fieldName = getAliasFieldName(key);
      info.fieldAlias[fieldName] = value as string;
    } else {
      info.fields[key] = value;
    }
  }
  return info;
}

/**
 * Generates a gql query fields from an object
 * @param object
 *
 * @example
 * queryFields({foo: "", bar: 0}) => 'foo bar'
 */
export function queryFields(object: GQObject): string {
  const info = extractDecorators(object);
  const text = Object.entries(info.fields).reduce((acc, [k, v]) => {
    let field = `${k}`;
    if (info.fieldAlias[k]) field += `:${info.fieldAlias[k]}`;
    if (info.fieldArgs[k]) field += `(${generateArgs(info.fieldArgs[k])})`;
    acc += `${field} ${queryObject(v)}`;
    return acc;
  }, "");
  return info.fragment
    ? `... on ${info.fragment} { 
${text}}
`
    : text;
}

function isGQObject(obj: GQType): obj is GQObject {
  return (
    !!obj &&
    obj.constructor === Object && // isLiteralObject
    Object.keys(obj).length > 0
  );
}

/**
 * Generates a gql type query string from an object
 * @param object
 *
 * @example
 * queryObject({foo: "", bar: 0}) => '{ foo bar }'
 */
export function queryObject(object: GQType): string {
  let result = "";
  if (Array.isArray(object)) {
    result += object.map(queryObject);
  } else if (isGQObject(object)) {
    result += `{
${queryFields(object)}} 
`;
  }
  return result;
}

/**
 * Convenience function for creating queries with syntax coloring due to 'gql' tag naming
 *
 * @example
 * gql`query MyQuery($input: String) { ${GQueryObject} ${GQueryOtherObject} }`
 */
export const gql = (chunks: TemplateStringsArray, ...types: GQType[]) =>
  types.reduce<string>(
    (acc, val, i) =>
      (acc +=
        (isGQObject(val) ? queryFields(val) : queryObject(val)) +
        chunks[i + 1]),
    chunks[0]
  );
