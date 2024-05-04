import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath);
        console.log("File is uploaded successfully", response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);
        console.log("file not uploaded error occured")
        //will remove the locally saved temporary file as upload failed
        return null;
    }
}

export {uploadOnCloudinary}