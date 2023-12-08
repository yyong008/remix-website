import crypto from "crypto-js";

export function hashedPassword(password: string) {
  const salted = "saltedPassword";
  return crypto.SHA256(password + salted).toString();
}
