// Discard 250–255: the remaining 250 byte values split evenly into ten buckets.
// Never fall back to Math.random if secure randomness is unavailable.
export function randomDigits(length, source = globalThis.crypto) {
  if (![2,3,6].includes(length)) throw new Error('จำนวนหลักไม่ถูกต้อง');
  if (!source?.getRandomValues) throw new Error('เบราว์เซอร์นี้ไม่รองรับการสุ่มที่ปลอดภัย กรุณาใช้เบราว์เซอร์รุ่นใหม่ผ่าน HTTPS');
  let result = '';
  while (result.length < length) {
    const bytes = source.getRandomValues(new Uint8Array(32));
    for (const byte of bytes) {
      if (byte < 250) result += String(byte % 10);
      if (result.length === length) break;
    }
  }
  return result;
}
