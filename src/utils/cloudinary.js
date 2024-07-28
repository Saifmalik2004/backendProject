import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  const uploadOnCloudinary = async(localFilePath, folder = "backend")=>{
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder:folder

        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
  }


  const extractPublicIdFromUrl = (url) => {
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1617622640/sample.jpg
    // Extracts "v1617622640/sample" from the URL
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1]; // Get the last part of the URL
    const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
    return publicId;
  };


  // Function to delete a file from Cloudinary using its public ID
 const deleteFromCloudinary = async (publicId) => {
  try {
      // Ensure the public ID is valid
      if (!publicId) {
          console.error("Invalid public ID provided for Cloudinary deletion");
          return false;
      }

      // Delete the file from Cloudinary
      await cloudinary.uploader.destroy(publicId);
      console.log("File deleted from Cloudinary successfully");
      return true;
  } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      return false;
  }
};



export {uploadOnCloudinary,extractPublicIdFromUrl,deleteFromCloudinary}