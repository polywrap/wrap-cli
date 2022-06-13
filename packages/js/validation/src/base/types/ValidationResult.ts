import { ValidationFailReason } from "./ValidationFailReason";

export type ValidationResult = {
  valid: boolean;
  failReason?: ValidationFailReason;
};
