# gq-ts Decorators

the current implementation augments plain js types with special properties for features which exist in gql but not in js/ts

those special properties are all prefixed with '@'

naming and prefix is chosen to align with typescript decorators. those, however, are not (yet) available on objects but only on classes.

in case the proposal gets implemented in the future, the code for treating those prefixed properties can be removed and the resolving of those features might be applied on compile-time instead of as functions during runtime.