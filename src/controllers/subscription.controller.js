import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/userModel.js"
import { Subscription } from "../models/subscriptionModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.user;  // Assuming the user ID is available from authenticated user

    // Validate channel ID
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID');
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    let message;
    if (existingSubscription) {
        // If subscription exists, unsubscribe
        await existingSubscription.remove();
        message = 'Unsubscribed successfully';
    } else {
        // If not subscribed, create a new subscription
        const newSubscription = new Subscription({
            subscriber: userId,
            channel: channelId
        });
        await newSubscription.save();
        message = 'Subscribed successfully';
    }

    res.status(200).json(new ApiResponse(200, message));
});

// Controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Validate channel ID
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID');
    }

    // Find subscriptions where the channel is the specified user
    const subscribers = await Subscription.find({ channel: channelId })
        .populate('subscriber', 'username fullname avatar');

    const response = subscribers.map(sub => ({
        userId: sub.subscriber._id,
        username: sub.subscriber.username,
        fullname: sub.subscriber.fullname,
        avatar: sub.subscriber.avatar
    }));

    res.status(200).json(new ApiResponse(200, 'Subscribers retrieved successfully', response));
});

// Controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // Validate subscriber ID
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid subscriber ID');
    }

    // Find subscriptions where the subscriber is the specified user
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', 'username fullname avatar');

    const response = subscriptions.map(sub => ({
        channelId: sub.channel._id,
        username: sub.channel.username,
        fullname: sub.channel.fullname,
        avatar: sub.channel.avatar
    }));

    res.status(200).json(new ApiResponse(200, 'Subscribed channels retrieved successfully', response));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};