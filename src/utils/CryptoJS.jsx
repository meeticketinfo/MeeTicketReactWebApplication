import CryptoJS from "crypto-js";


const BASE64_KEY = "wVZtMeF6BShZD6ghPdpgz7Tk1A0v4E+jWmrV2Uolc8c=";
const BASE64_IV  = "zPojWAmUwJ0vTvYGFeMbfg==";

export const decryptRolesPayload = (encryptedBase64) => {
  try {
    const key = CryptoJS.enc.Base64.parse(BASE64_KEY);
    const iv = CryptoJS.enc.Base64.parse(BASE64_IV);
    const cipherText = CryptoJS.enc.Base64.parse(encryptedBase64);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: cipherText },
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Decryption failed (empty result)");
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Failed to decrypt roles payload:", error);
    return [];
  }
};
