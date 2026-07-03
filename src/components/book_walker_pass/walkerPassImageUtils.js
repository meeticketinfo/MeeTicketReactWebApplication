export const getWalkerPassImageStorageKey = (passUserDetailsId) =>
    passUserDetailsId ? `walkerPassUserImage:${passUserDetailsId}` : "";

export const WALKER_PASS_MAX_IMAGE_SIZE = 200 * 1024;

export const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const dataUrlToBlob = (dataUrl) => {
    const [header, data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mime });
};

export const compressImageFile = (
    file,
    maxSizeBytes = WALKER_PASS_MAX_IMAGE_SIZE
) =>
    new Promise((resolve, reject) => {
        if (!file) {
            resolve({
                file: null,
                wasCompressed: false,
                originalSize: 0,
                compressedSize: 0,
            });
            return;
        }

        if (file.size <= maxSizeBytes) {
            resolve({
                file,
                wasCompressed: false,
                originalSize: file.size,
                compressedSize: file.size,
            });
            return;
        }

        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();

            img.onerror = () => reject(new Error("Failed to load image"));
            img.onload = () => {
                let maxDimension = 1200;
                let quality = 0.85;

                const tryCompress = () => {
                    const scale = Math.min(
                        1,
                        maxDimension / Math.max(img.width, img.height)
                    );
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.max(1, Math.round(img.width * scale));
                    canvas.height = Math.max(1, Math.round(img.height * scale));

                    const ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const dataUrl = canvas.toDataURL("image/jpeg", quality);
                    const blob = dataUrlToBlob(dataUrl);

                    if (
                        blob.size <= maxSizeBytes ||
                        (quality <= 0.3 && maxDimension <= 400)
                    ) {
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.(png|jpg|jpeg)$/i, ".jpg"),
                            {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            }
                        );

                        resolve({
                            file: compressedFile,
                            wasCompressed: true,
                            originalSize: file.size,
                            compressedSize: compressedFile.size,
                        });
                        return;
                    }

                    if (quality > 0.3) {
                        quality -= 0.1;
                    } else {
                        maxDimension = Math.round(maxDimension * 0.85);
                        quality = 0.85;
                    }

                    tryCompress();
                };

                tryCompress();
            };

            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

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
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.85));
            };

            img.src = originalDataUrl;
        };
        reader.readAsDataURL(file);
    });
