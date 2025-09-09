import crypto from "crypto";

export default function generateUID(length = 28) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let uid = '';

  for (let i = 0; i < length; i++) {
    uid += chars[bytes[i] % chars.length];
  }

  return uid;
}

