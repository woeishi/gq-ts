import {
  GQBoolean as GQScalarBoolean,
  GQNumber as GQScalarNumber,
  GQString as GQScalarString,
  GQDate as GQScalarDate,
} from "./types";

export const GQBoolean: GQScalarBoolean = true;

export const GQNumber: GQScalarNumber = 1;

export const GQString: GQScalarString = "String";

export const GQDate: GQScalarDate = new Date("1970-01-01");
