import { Request,Response,NextFunction } from "express";
import prisma from "../core/config/prisma";
import TokenOps from "../core/constants/jwt.functions";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const verifyToken = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const { id } = req.params
            
        const user = await prisma.user.findUnique({
            select: {
                userID: true,
                name: true
            },
            where: {
                userID: id
            }
        })
        if(!user) return res.status(HttpCode.NOT_FOUND).json({msg:"user not found"})
        const accessToken = req.headers.authorization
        const refreshToken = req.cookies[`${user.name}-cookie`]
        // verifying if token exists
        if (!accessToken || !refreshToken)
            return res.status(HttpCode.UNAUTHORIZED).json({ message: `Unauthorized:${user.name} not actually connected` });
        const decodedUser = TokenOps.verifyAccessToken(accessToken);
        if (!decodedUser)
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ msg: "Invalid or expired token" })
        next()
    } catch (error) {
        sendError(res,error)
    }
}

export default verifyToken