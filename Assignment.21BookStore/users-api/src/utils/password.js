import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

//script is a slow , memory-hard hash built into Node - no extra package needed
//it runs on libuv's thread pool, so it doest not block the event loop
const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

// Returns "scrypt$<salt hex>$<hash hex>" — store this, never the plain password.

export async function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(plain, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")} $${hash.toString("hex")}`;
}

export async function verifyPasswor(plain, stored) {
  const [algorithm, saltHex, hashHex] = stored.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(
    plain,
    Buffer.from(saltHex, "hex"),
    expected.length,
  );
  //Constant - time comparision prevent timing attacks
  return timingSafeEqual(expected, actual);
}


