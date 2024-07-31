import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlistModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
  
    // Validate required fields
    if (!name || !description) {
      throw new ApiError(400, 'Name and description are required');
    }
  
    // Ensure the user is authenticated and has an ID
    const ownerId = req.user._id; // Assuming the user is authenticated and req.user contains the user's data
  
    // Create a new playlist
    const newPlaylist = await Playlist.create({
      name,
      description,
      owner: ownerId, // Add the owner field
    });
  
    // Respond with success
    return res.status(201).json(new ApiResponse(201, newPlaylist, 'Playlist created successfully'));
  });
  

  // Get a user's playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
  
    const playlists = await Playlist.find({ owner: userId });
  
    if (!playlists) {
      throw new ApiError(404, "Playlists not found");
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, playlists, "User playlists retrieved successfully"));
  });
  
  // Get a playlist by its ID
  const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
  
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
  
    const playlist = await Playlist.findById(playlistId).populate("videos");
  
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist retrieved successfully"));
  });
  
  // Add a video to a playlist
  const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
  
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist or video ID");
    }
  
    const playlist = await Playlist.findById(playlistId);
  
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
  
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
  });
  
  // Remove a video from a playlist
  const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
  
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist or video ID");
    }
  
    const playlist = await Playlist.findById(playlistId);
  
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
  
    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
  
    await playlist.save();
  
    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
  });
  
  // Delete a playlist
  const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
  
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
  
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  
    if (!deletedPlaylist) {
      throw new ApiError(404, "Playlist not found");
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"));
  });
  
  // Update a playlist's details
  const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
  
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
  
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          ...(name && { name }), // Update name if provided
          ...(description && { description }), // Update description if provided
        },
      },
      { new: true, runValidators: true }
    );
  
    if (!updatedPlaylist) {
      throw new ApiError(404, "Playlist not found");
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
  });
  
  export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
  };