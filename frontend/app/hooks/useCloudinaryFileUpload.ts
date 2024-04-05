"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function useCloudinaryFileUpload() {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (file: any, setImageUrl: any) => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "notes-app-unsigned");
      fetch("https://api.cloudinary.com/v1_1/dubzpy7hn/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Set the imageUrl using setImageUrl
          console.log(data);
          setImageUrl(data.url);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Error uploading image");
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  return { uploading, handleFileUpload };
}


// import {Cloudinary} from "@cloudinary/url-gen";

// const App = () => {
//   const cld = new Cloudinary({cloud: {cloudName: 'dgnd6ay3m'}});
// };


// import {v2 as cloudinary} from 'cloudinary';
          
// cloudinary.config({ 
//   cloud_name: 'dgnd6ay3m', 
//   api_key: '965714451628497', 
//   api_secret: '1BJfl7LcXr2dABhwfX8khpxiHbs' 
// });