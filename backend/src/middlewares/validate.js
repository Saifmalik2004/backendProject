import { ApiError } from "../utils/ApiError.js";
import { userSchema } from "../validationSchema.js";

const validateuser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ApiError(400, errmsg);
    } else {
        next();
    }
};

export{validateuser}