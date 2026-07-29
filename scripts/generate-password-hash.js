// Generates a bcrypt hash for APP_PASSWORD_HASH.
//
// Usage:
//   node scripts/generate-password-hash.js <plaintext-password>
//   npm run hash-password -- <plaintext-password>
const bcrypt = require("bcrypt");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-password-hash.js <plaintext-password>");
  process.exit(1);
}

bcrypt
  .hash(password, 10)
  .then((hash) => {
    // Docker Compose treats $ as the start of a variable reference even in
    // env_file values, so every literal $ in the hash must be doubled to
    // $$ or Compose silently truncates it down to the "$2b$10" prefix.
    const escapedHash = hash.replace(/\$/g, "$$$$");
    console.log("Add this line to your .env file:");
    console.log(`APP_PASSWORD_HASH=${escapedHash}`);
  })
  .catch((error) => {
    console.error("Failed to hash password:", error);
    process.exit(1);
  });
