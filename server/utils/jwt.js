import jwt from "jsonwebtoken"

export const generateToken = (empId, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    const token = jwt.sign({ empId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });
    return token;
};   