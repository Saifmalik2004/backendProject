import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videoModel.js"
import {User} from "../models/userModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


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
    const uploadedVideo = await uploadOnCloudinary(videoFile.path);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path);

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
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

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