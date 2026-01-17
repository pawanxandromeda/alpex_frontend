import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_DECRYPT_KEY;

/**
 * Decrypts AES payload from backend
 * @param encryptedData Base64 string from backend
 * @returns Parsed JSON object or null if decryption fails
 */
const decryptData = (encryptedData) => {
  try {
    if (!SECRET_KEY) throw new Error("Decryption key is missing!");

    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) throw new Error("Decryption failed. Invalid data.");

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return null;
  }
};

export default decryptData;
