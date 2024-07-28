import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videoModel.js"
import {User} from "../models/userModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,extractPublicIdFromUrl,deleteFromCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // Retrieve video and thumbnail files
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Validate the presence of required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailFile) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    // Upload video and thumbnail to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoFile.path,"backend/vedio");
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path,"backend/thumbnail");

    // Check if uploads were successful
    if (!uploadedVideo || !uploadedThumbnail) {
        throw new ApiError(500, "Failed to upload video or thumbnail to Cloudinary");
    }

    const videoUrl = uploadedVideo.url;
    const thumbnailUrl = uploadedThumbnail.url;

    // Create a new video document in the database
    const video = await Video.create({
        video: videoUrl,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration: uploadedVideo.duration, // Duration fetched from Cloudinary response
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(500, "Failed to create video record");
    }

    // Send response to the client
    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate the video ID
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Convert videoId to a mongoose ObjectId
    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    // Use MongoDB aggregation pipeline to fetch video details
    const videoDetails = await Video.aggregate([
        // Match the video by its ID
        {
            $match: {
                _id: videoObjectId
            }
        },
        // Lookup to join the User collection
        {
            $lookup: {
                from: 'users', // Collection name for users
                localField: 'owner', // Field in Video collection
                foreignField: '_id', // Field in User collection
                as: 'ownerDetails'
            }
        },
        // Unwind the ownerDetails array
        {
            $unwind: '$ownerDetails'
        },
        // Add specific fields for more precise data representation
        {
            $addFields: {
                ownerFullName: '$ownerDetails.fullName',
                ownerUsername: '$ownerDetails.username',
                ownerAvatar: '$ownerDetails.avatar'
            }
        },
        // Project the required fields
        {
            $project: {
                video: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                ownerFullName: 1,
                ownerUsername: 1,
                ownerAvatar: 1
            }
        }
    ]);

    // Handle case where video is not found
    if (!videoDetails || videoDetails.length === 0) {
        throw new ApiError(404, "Video not found");
    }

    // Respond with the video details
    return res.status(200).json(
        new ApiResponse(200, videoDetails[0], "Video fetched successfully")
    );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    
    const newThumbnailFile = req.file ? req.file.path : null;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }


    if (![title, description, newThumbnailFile].some((field) => field?.trim() !== "")) {
        throw new ApiError(400, "At least one field (title, description, thumbnail) is required for update");
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);

  // Fetch the current video details
  const existingVideo = await Video.findById(videoObjectId);
  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }

// If a new thumbnail is provided, delete the old one and upload the new one
  let newThumbnailUrl;
  if (newThumbnailFile) {
    try {
      // Extract the public ID from the old thumbnail URL
      const oldThumbnailUrl = existingVideo.thumbnail;
      const publicId = extractPublicIdFromUrl(oldThumbnailUrl);
      
      // Delete the old thumbnail from Cloudinary
      if (publicId) {
        await deleteFromCloudinary(publicId);
        
      }

      // Upload the new thumbnail to Cloudinary
      const uploadResponse = await uploadOnCloudinary(newThumbnailFile,"backend/thumbnail");
      if (!uploadResponse) {
        throw new ApiError(500, "Failed to upload new thumbnail");
      }
      newThumbnailUrl = uploadResponse.url;
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      throw new ApiError(500, "Error updating thumbnail");
    }
  }

  // Update video details
  const updatedVideo = await Video.findByIdAndUpdate(
    videoObjectId,
    {
      $set: {
        ...(title && { title }), // Only update if a new title is provided
        ...(description && { description }), // Only update if a new description is provided
        ...(newThumbnailUrl && { thumbnail: newThumbnailUrl }) // Only update if a new thumbnail URL is set
      }
    },
    { new: true, runValidators: true } // Return the updated document and run validation
  );

  // Respond with the updated video details
  return res.status(200).json(
    new ApiResponse(200, updatedVideo, "Video updated successfully")
  );
});




const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}