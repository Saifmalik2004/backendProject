import mongoose from "mongoose"
import {Comment} from "../models/commentModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
  
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }
  
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };
  
    const aggregateQuery = Comment.aggregate([
      { $match: { video: mongoose.Types.ObjectId(videoId) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      { $unwind: "$ownerDetails" },
      {
        $project: {
          content: 1,
          createdAt: 1,
          "ownerDetails.username": 1,
          "ownerDetails.avatar": 1,
        },
      },
    ]);
  
    const comments = await Comment.aggregatePaginate(aggregateQuery, options);
  
    res.status(200).json(new ApiResponse(200, "Comments retrieved successfully", comments));
  });
  
  const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
  
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }
  
    if (!content || content.trim() === "") {
      throw new ApiError(400, "Content is required");
    }
  
    const comment = new Comment({
      content,
      video: videoId,
      owner: userId,
    });
  
    await comment.save();
  
    res.status(201).json(new ApiResponse(201, "Comment added successfully", comment));
  });
  
  const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
  
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment ID");
    }
  
    if (!content || content.trim() === "") {
      throw new ApiError(400, "Content is required");
    }
  
    const comment = await Comment.findOne({ _id: commentId, owner: userId });
  
    if (!comment) {
      throw new ApiError(404, "Comment not found or you are not authorized to update this comment");
    }
  
    comment.content = content;
    await comment.save();
  
    res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
  });
  
  const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
  
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment ID");
    }
  
    const comment = await Comment.findOneAndDelete({ _id: commentId, owner: userId });
  
    if (!comment) {
      throw new ApiError(404, "Comment not found or you are not authorized to delete this comment");
    }
  
    res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
  });
  
  
export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }