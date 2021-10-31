# gq-ts

'graph query - typescript': compose graphQL queries with plain js objects, type-checked by typescript

> __supports:__ _basic types_ (boolean, number, string), _GQL scalars_, _GQL Objects_, _GQL Lists_, _aliases_, _arguments_ & _inline fragments_

> __utils:__ _gqPick<T,K>_, _gqOmit<T,K>_

## Advantages

* gql queries typechecked in IDE or on ts compile instead of on execution during runtime
* ts type refactoring (property renaming) affect gql types as well
* safe composition without string manipulation, e.g. changing a nested interface to a specific type implementation
* less overfetching due to easier definition of derived partial types (pick/omit)

## How-To

use plain js objects as type definitions to compose the gql query. generate the query string with the composed object right before executing the query:
```typescript
gql`{ ${{ entity: { id: 0, label: "" }, image: { url: "" } }} }`
// => { entity { id label } image { url } }
```

### Simple

```typescript
// ts
interface IFoo { foo: string }
interface IBar extends IFoo { bar: number }

// gq-ts
import { GQString, GQNumber, gql } from "gq-ts";

const GQIFoo: IFoo = { foo: GQString }
const GQIBar: IBar = { ...GQIFoo, bar: GQNumber }

const queryText = gql`query Test { test { ${GQIBar} } }`
// => query Test { test { foo bar } }
```

create ad-hoc plain object with ts typing

use provided primitive constants for values

compose with usual operations (e.g. spread op, property assignment via index)

use helper tagged literal to get the query string

### Extended

#### with inline fragment:
```typescript
const aliased = withInlineFragment<IBar>(GQIBar,'FooBar');
// => ... on FooBar { foo bar }
```

#### with alias:
```typescript
interface IFooBar = { foobar: IBar }
const aliased = withAlias<IFooBar>({ foobar: GQIBar },'foobar','foo_bar');
// => foobar:foo_bar { foo bar }
```

#### with arguments:
```typescript
const args = withArgs<IBar>(GQIBar,'foo',{id: "$id", private: true});
// =>
// foo(id: $id, private: TRUE)
// bar
```

above functions are composable to generate complete queries
```typescript
const query =
  withInlineFragment(
    withArgs(
      withAlias({
        foobar: GQIBar
      },
      'foobar',
      'foo_bar'), 
    'foobar', 
    {input: ["what", "ever"], lang: "$lang"}),
  'FooBar')
const toString = gql`query MyQuery($lang: String) { ${query} }`;
// =>
// query MyQuery($lang: String) {
//   ... on FooBar {
//     foobar:foo_bar(input: ["what","ever"] lang: $lang) {
//       foo
//       bar
//     }
//   }   
// }
```

### Utils

with typescript util classes enable quick creation of derived types.
gq-ts provides analog typesafe functions for 'Pick' and 'Omit'

e.g.:
```typescript
interface IABC = { a: string, b: string, c: string};
const abc: IABC = {
  a: GQString,
  b: GQString,
  c: GQString,
}

const acByPick = gqPick(abc, ["a","c"]) 
// => Pick<IABC, "a"|"c">

const acByOmit = gqOmit(abc, ["b"]) 
// => Omit<IABC, "b">
```
