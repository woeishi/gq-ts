export type GQBoolean = boolean;

export type GQNumber = number;

export type GQString = string;

export type GQDate = Date;

export type GQScalar = {};

export type GQUnknown<T> = GQScalar & T;

export type GQLeaf = GQBoolean | GQNumber | GQString | GQDate | GQScalar;

export type GQObject = Record<string, GQType>;

export type GQType =
  | GQLeaf
  | { [key: string]: GQType } // = GQObject
  | GQType[];
