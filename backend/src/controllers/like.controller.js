import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({ userId, videoId });

  if (existingLike) {
    await existingLike.remove();
    res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
  } else {
    const newLike = new Like({ userId, videoId });
    await newLike.save();
    res.status(200).json(new ApiResponse(200, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({ userId, commentId });

  if (existingLike) {
    await existingLike.remove();
    res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
  } else {
    const newLike = new Like({ userId, commentId });
    await newLike.save();
    res.status(200).json(new ApiResponse(200, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({ userId, tweetId });

  if (existingLike) {
    await existingLike.remove();
    res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"));
  } else {
    const newLike = new Like({ userId, tweetId });
    await newLike.save();
    res.status(200).json(new ApiResponse(200, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const likedVideos = await Like.find({ userId, videoId: { $exists: true } }).populate('videoId');

  if (!likedVideos) {
    throw new ApiError(404, "No liked videos found");
  }

  const videos = likedVideos.map(like => like.videoId);

  res.status(200).json(new ApiResponse(200, "Liked videos retrieved successfully", videos));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};
