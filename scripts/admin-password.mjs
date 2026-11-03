import { randomBytes, scryptSync } from 'node:crypto';
// The generated credential is printed only for the owner to place in .env.local.
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
console.log(
  'Save this password in your password manager (never commit it):\n' + password,
);
console.log(
  '\nSet this server-only environment variable:\nADMIN_PASSWORD_HASH=scrypt:' +
    salt +
    ':' +
    scryptSync(password, salt, 64).toString('hex'),
);
