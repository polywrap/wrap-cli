import { ValidationFailReason } from "./ValidationFailReason";

export type ValidationResult = {
  valid: boolean;
  failError?: Error;
  failReason?: ValidationFailReason;
};
