import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateAccessToken from "../utils/generatedAccesToken.js";

// login user
export const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;
        
        if (!email || !password) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email }).select("+password");
        

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "User not found"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid password"
            });
        }

        //create access token
        const accessToken = generateAccessToken(user);

        return response.status(200).json({
            success: true,
            error: false,
            message: "Login successful",
            data: {
                accessToken,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: "Login failed"
        });
    }
};

//register user
export const registerUser = async (request, response) => {
    try {
        const { name, email, password,} = request.body;
        if(!name || !email || !password){
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please provide name, email and password"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({
                success: false,
                error: true,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return response.status(201).json({
            success: true,
            error: false,
            message: "Registration successful",
        });
        
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: "Registration failed"
        });
        
    }
}