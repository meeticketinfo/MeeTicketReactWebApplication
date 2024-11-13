import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import useAuthStore from "../store/authStore";

export const fetchQRFile = async (entityId) => {
    try {
        const token = useAuthStore.getState().token;
        const response = await axios.get(
            `${API_ENDPOINTS.ENTITIES.DOWNLOAD_FILE}/${entityId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",  // Set response type to blob for binary data
            }
        );
        if (response.status === 200) {
            // Process the response as a Blob object
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "EntityQR.png";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        handleApiError(error)
        throw error;
    }
};
