import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false); // Add loading state

  // func to read the selected image file and update the imgUrl state variable with a preview URL.
  const handleImageChange = async (e) => {
    setUpdating(true); // Start loading when image selection starts

    //This line retrieves the first file from the file input element, assuming a single file selection.
    const file = e.target.files[0];

    // check if file exits and the type is image or not
    // "image/", indicating it is an image file.
    if (file && file.type.startsWith("image/")) {
      // The FileReader object is a JS API, allows web applications to asynchronously read the contents of files (or raw data buffers) stored on the user's computer.
      const reader = new FileReader();

      // The "onloadend" event is triggered when the reading operation is completed.
      // "reader.result" contains the data URL of the read file.
      // "setImgUrl(reader.result);" updates the imgUrl state with the data URL, which is used to display a preview of the image.
      reader.onloadend = () => {
        setImgUrl(reader.result);
        setUpdating(false); // Stop loading after image is loaded
      };

      //"readAsDataURL()" method starts reading the contents of the specified Blob (in this case, the image file). It is used to read the contents of a "file" object and encode it as a "base64-encoded Data URL". This Data URL can then be used as the src attribute of an img element to display the image in the browser without needing to upload it to a server/db.
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type!", " Please select an image file", "error");
      setImgUrl(null);
      setUpdating(false); // Stop loading if file is invalid
    }
  };

  return { handleImageChange, imgUrl, setImgUrl, updating };
};

export default usePreviewImg;
