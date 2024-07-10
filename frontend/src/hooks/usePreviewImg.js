import { useState } from "react";
import useShowToast from "./useShowToast";
import imageCompression from "browser-image-compression";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  // func to read the selected image file and update the imgUrl state variable with a preview URL.
  const handleImageChange = async (e) => {
    //This line retrieves the first file from the file input element, assuming a single file selection.
    const file = e.target.files[0];

    // check if file exits and the type is image or not
    // "image/", indicating it is an image file.
    if (file && file.type.startsWith("image/")) {
      try {
        const options = {
          maxSizeMB: 0.065, // Target size in MB (65 KB)
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // The FileReader object is a JS API, allows web applications to asynchronously read the contents of files (or raw data buffers) stored on the user's computer.
        const reader = new FileReader();

        // The "onloadend" event is triggered when the reading operation is completed.
        // "reader.result" contains the data URL of the read file.
        // "setImgUrl(reader.result);" updates the imgUrl state with the data URL, which is used to display a preview of the image.
        reader.onloadend = () => {
          setImgUrl(reader.result);
        };

        //"readAsDataURL()" method starts reading the contents of the specified Blob (in this case, the image file). It is used to read the contents of a "file" object and encode it as a "base64-encoded Data URL". This Data URL can then be used as the src attribute of an img element to display the image in the browser without needing to upload it to a server/db.
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        showToast("Error compressing image", error.message, "error");
      }
    } else {
      showToast("Invalid file type!", " Please select an image file", "error");
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl };
};

export default usePreviewImg;
