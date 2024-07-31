import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweetModel.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const tweet = new Tweet({
    content,
    owner: userId,
  });

  await tweet.save();

  res.status(201).json(new ApiResponse(201, "Tweet created successfully", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const tweets = await Tweet.paginate({ owner: userId }, options);

  res.status(200).json(new ApiResponse(200, "User tweets retrieved successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: userId },
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or you are not authorized to update this tweet");
  }

  res.status(200).json(new ApiResponse(200, "Tweet updated successfully", tweet));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: userId });

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or you are not authorized to delete this tweet");
  }

  res.status(200).json(new ApiResponse(200, "Tweet deleted successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
  
    const skip = (pageNum - 1) * limitNum;
  
    const tweets = await Tweet.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          owner: 1,
          "userInfo.username": 1,
          "userInfo.fullname": 1,
          "userInfo.avatar": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNum,
      },
    ]);
  
    const totalTweets = await Tweet.countDocuments();
  
    const response = {
      docs: tweets,
      totalDocs: totalTweets,
      limit: limitNum,
      totalPages: Math.ceil(totalTweets / limitNum),
      page: pageNum,
      pagingCounter: skip + 1,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < Math.ceil(totalTweets / limitNum),
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < Math.ceil(totalTweets / limitNum) ? pageNum + 1 : null,
    };
  
    res.status(200).json(new ApiResponse(200, "All tweets retrieved successfully", response));
  });

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets, // Exporting the new function
};
