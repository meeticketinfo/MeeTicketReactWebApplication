export const getWalkerPassImageStorageKey = (passUserDetailsId) =>
    passUserDetailsId ? `walkerPassUserImage:${passUserDetailsId}` : "";

export const getStoredWalkerPassImage = (passUserDetailsId) => {
    const storageKey = getWalkerPassImageStorageKey(passUserDetailsId);
    if (!storageKey) return "";

    return sessionStorage.getItem(storageKey) || "";
};

export const storeWalkerPassImage = (passUserDetailsId, imageDataUrl) => {
    const storageKey = getWalkerPassImageStorageKey(passUserDetailsId);
    if (!storageKey || !imageDataUrl) return;

    try {
        sessionStorage.setItem(storageKey, imageDataUrl);
    } catch (error) {
        console.error("Unable to store walker pass image:", error);
    }
};

export const fileToCompressedDataUrl = (file) =>
    new Promise((resolve, reject) => {
        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const originalDataUrl = reader.result;
            const img = new Image();

            img.onerror = () => resolve(originalDataUrl);
            img.onload = () => {
                const maxSize = 800;
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(img.width * scale));
                canvas.height = Math.max(1, Math.round(img.height * scale));

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.85));
            };

            img.src = originalDataUrl;
        };
        reader.readAsDataURL(file);
    });
