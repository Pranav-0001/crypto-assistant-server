import { query } from "express-validator";

export const commonGetValidationSchema = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
  query("q").optional().isString(),
];
