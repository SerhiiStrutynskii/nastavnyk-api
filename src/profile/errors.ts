import { FieldErrors } from "../registration/errors";

export type ProfileErrorCode = "INVALID_INPUT" | "EMAIL_TAKEN" | "USER_NOT_FOUND";

// Повідомлення для INVALID_INPUT та EMAIL_TAKEN збігаються з реєстрацією.
export const PROFILE_MESSAGES: Record<ProfileErrorCode, string> = {
  INVALID_INPUT: "Please check the highlighted fields",
  EMAIL_TAKEN: "Email already registered",
  USER_NOT_FOUND: "User not found",
};

export class ProfileError extends Error {
  constructor(
    public readonly code: ProfileErrorCode,
    public readonly fields: FieldErrors = {},
  ) {
    super(PROFILE_MESSAGES[code]);
    this.name = "ProfileError";
  }
}
