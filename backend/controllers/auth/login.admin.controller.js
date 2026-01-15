import { getReasonPhrase, StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import Models from "../../models/index.models.js";
import configs from "../../configs/index.configs.js";

const adminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // return res.render('errorpage', { errorMessage: getReasonPhrase(StatusCodes.BAD_REQUEST) });
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: "All fields are required!"
            });
        }
        const Admin = await Models.AdminModel.findOne({ email });
        if (Admin) {
            // console.log("Admin Found:", Admin);
            // console.log("Entered Password:", password);
            // console.log("Stored Password:", Admin.password);

            // If password is hashed, use bcrypt.compare
            // const isPasswordMatch = await bcrypt.compare(password, Admin.password);
            if (password === Admin.password) {
                const playLoad = {
                    _id: Admin._id,
                    name: Admin.name,
                    email: Admin.email,
                    role: Admin.role || "admin",
                };
                const token = await JWT.sign(playLoad, configs.JWT_SECRET);

                return res.status(StatusCodes.OK).json({
                    status: 'OK',
                    message: "Successfully logged in",
                    token: token,
                    data: {
                        name: playLoad.name,
                        email: playLoad.email,
                        role: "admin",
                    }
                });
            }

            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: "Unauthorized",
            });
        }

        return res.status(StatusCodes.CONFLICT).json({
            status: 'Failed',
            message: "Conflict",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
}

export default adminLoginController;