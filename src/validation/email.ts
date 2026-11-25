import { matches, validate } from "./rules";
import { EMAIL_PATTERN } from "./patterns";

// Єдине правило нормалізації email: і для реєстрації, і для зміни email у профілі.
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// Ті самі правила перевірки, що й під час реєстрації.
export function validateEmail(email: string): string[] {
  return validate(email, [matches(EMAIL_PATTERN, "must be a valid email")]);
}
