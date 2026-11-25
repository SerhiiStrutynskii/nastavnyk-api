import { changeEmail } from "./changeEmail";
import { ProfileError } from "./errors";
import { userRepository } from "../users/userRepository";

// Seed: id 1 — john@example.com, id 2 — olena@example.com
beforeEach(() => {
  userRepository.reset();
});

function catchError(fn: () => unknown): ProfileError {
  try {
    fn();
  } catch (error) {
    return error as ProfileError;
  }
  throw new Error("Expected function to throw");
}

describe("changeEmail", () => {
  it("AC1: changes email to a valid free address and stores it normalized", () => {
    const user = changeEmail(1, "  John.New@Example.COM ");

    expect(user).toMatchObject({ id: 1, email: "john.new@example.com", username: "John_Doe" });
    expect(userRepository.findByEmail("john.new@example.com")?.id).toBe(1);
    expect(userRepository.findByEmail("john@example.com")).toBeUndefined();
  });

  it("AC2: rejects an invalid email with the same error as registration and keeps the old one", () => {
    const error = catchError(() => changeEmail(1, "not-an-email"));

    expect(error).toBeInstanceOf(ProfileError);
    expect(error.code).toBe("INVALID_INPUT");
    expect(error.message).toBe("Please check the highlighted fields");
    expect(error.fields).toEqual({ email: ["must be a valid email"] });
    expect(userRepository.findById(1)?.email).toBe("john@example.com");
  });

  it("AC3: rejects an email that belongs to another user, regardless of case and spaces", () => {
    const error = catchError(() => changeEmail(1, " Olena@Example.com "));

    expect(error.code).toBe("EMAIL_TAKEN");
    expect(error.message).toBe("Email already registered");
    expect(userRepository.findById(1)?.email).toBe("john@example.com");
    expect(userRepository.findById(2)?.email).toBe("olena@example.com");
  });

  it("AC4: same email as current (after normalization) is a no-op, not EMAIL_TAKEN", () => {
    const updateSpy = jest.spyOn(userRepository, "updateEmail");

    const user = changeEmail(1, "  JOHN@example.com ");

    expect(user).toMatchObject({ id: 1, email: "john@example.com" });
    expect(updateSpy).not.toHaveBeenCalled();
    updateSpy.mockRestore();
  });

  it("AC5: rejects a change for a user that does not exist", () => {
    const error = catchError(() => changeEmail(999, "ghost@example.com"));

    expect(error.code).toBe("USER_NOT_FOUND");
    expect(userRepository.findByEmail("ghost@example.com")).toBeUndefined();
  });
});
