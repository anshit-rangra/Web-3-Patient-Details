import { useCallback } from "react";
import axios from "axios";

export const useIpfsUpload = () => {

  const uploadFile = useCallback(async (file) => {
    if (!file) {
      console.warn("No file provided for upload");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);  

    try {
      const response = await axios.post(
        import.meta.env.VITE_PINATA_GATEWAY,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          },
        }
      );

      if (response.data && response.data.IpfsHash) {
        return response.data.IpfsHash;
      } else {
        console.error("Invalid response from Pinata:", response.data);
        return null;
      }
    } catch (err) {
      console.error("Error uploading file to IPFS:", err.message);
      if (err.response) {
        console.error("Response error:", err.response.data);
      }
      return null;
    }
  }, []);

  return { uploadFile };

};
