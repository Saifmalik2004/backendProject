import Joi from "joi";

// Joi schema for user validation
const userSchema = Joi.object({
  username: Joi.string()
    .required()
    .lowercase()
    .trim()
    .messages({
      "any.required": "Username is required",
      "string.empty": "Username cannot be empty"
    }),

  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .trim()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address"
    }),

  fullName: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "Full name is required",
      "string.empty": "Full name cannot be empty"
    }),

  avatar: Joi.string()
    .required()
    .uri()
    .messages({
      "any.required": "Avatar URL is required",
      "string.empty": "Avatar URL cannot be empty",
      "string.uri": "Avatar URL must be a valid URI"
    }),

  coverImage: Joi.string()
    .required()
    .uri()
    .messages({
      "any.required": "Cover image URL is required",
      "string.empty": "Cover image URL cannot be empty",
      "string.uri": "Cover image URL must be a valid URI"
    }),

  

  password: Joi.string()
    .required()
    .min(6)
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters long"
    }),

  
});

// Export the Joi schema
export  { userSchema };
