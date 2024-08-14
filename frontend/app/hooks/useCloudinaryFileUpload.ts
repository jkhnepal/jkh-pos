// "use client";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function useCloudinaryFileUpload() {
//   const [uploading, setUploading] = useState(false);

//   const handleFileUpload = (file: any, setImageUrl: any) => {
//     if (file) {
//       setUploading(true);
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "jkh-preset");
//       //  fetch("https://api.cloudinary.com/v1_1/dgnd6ay3m/image/upload", {
//       fetch("https://api.cloudinary.com/v1_1/db9vimrao/image/upload", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           // Set the imageUrl using setImageUrl
//           // console.log(data);
//           // console.log(data.secure_url);
//           // console.log(data.url);
//           setImageUrl(data.secure_url);
//           // setImageUrl(data.url);
//         })
//         .catch((error) => {
//           console.error("Error uploading image:", error);
//           toast.error("Error uploading image");
//         })
//         .finally(() => {
//           setUploading(false);
//         });
//     }
//   };

//   return { uploading, handleFileUpload };
// }

"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function useCloudinaryFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>();

  const handleFileUpload = (file: any) => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "zyluxexpedition"); //unsigned upload preset
      formData.append("folder", "website"); // specify the folder
      fetch("https://api.cloudinary.com/v1_1/dwkp3w5ba/image/upload", {
        // using zyluxexpedition@.hotmail.com
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setImageUrl(data.url);
        })
        .catch((error) => {
          toast.error("Error uploading image");
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  return { uploading, handleFileUpload, imageUrl, setImageUrl };
}