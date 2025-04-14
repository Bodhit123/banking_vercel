import { validateAccount, validateUser } from "../Utils/validation";

describe("Validation Tests", () => {
  test("User Validation", async () => {
    // Valid user data
    const validUser = await validateUser({
      full_name: "John Doe",
      email: "john@example.com",
      password_hash: "HashedPassword",
      phone_number: "1234567890",
      role: "user",
    });
    expect(validUser).toBeTruthy();

    // Invalid user data
    const invalidUser = await validateUser({
      full_name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(invalidUser).toBeNull();
  });

  test("Account Validation", async () => {
    // Valid savings account
    const validSavings = await validateAccount({
      user_id: 1,
      account_type: "savings",
      balance: 2000,
    });
    expect(validSavings).toBeTruthy();

    // Invalid savings account
    const invalidSavings = await validateAccount({
      user_id: 2,
      account_type: "savings",
      balance: 500,
    });
    expect(invalidSavings).toBeNull();

    // ... (add more test cases for other account types)
  });
});
