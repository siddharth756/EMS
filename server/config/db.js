import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected.")
    } catch (error) {
        console.log("Error in Database connection:", error.message)
    }
}