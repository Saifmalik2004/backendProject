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
     // Split the URL by '/'
  const urlParts = url.split('/');

  // Find the index of 'upload' which is right before the version number
  const uploadIndex = urlParts.indexOf('upload');

  // Extract everything after 'upload/' till the end and join it back
  const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');

  // Remove the file extension
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // This regex removes the extension

  return publicId;
  };
  
  


  // Function to delete a file from Cloudinary using its public ID
  const deleteFromCloudinary = async (publicId,type) => {
    try {
        if (!publicId) {
            console.error("Invalid public ID provided for Cloudinary deletion");
            return false;
        }
  
        console.log(`Attempting to delete file with public ID: ${publicId}`);
  
        // Delete the file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId,{resource_type: type});
        console.log("Cloudinary delete response:", result);
  
        if (result.result === "ok") {
          console.log("File deleted from Cloudinary successfully");
          return true;
        } else {
          console.error("Failed to delete file from Cloudinary");
          return false;
        }
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return false;
    }
  };
  



export {uploadOnCloudinary,extractPublicIdFromUrl,deleteFromCloudinary}