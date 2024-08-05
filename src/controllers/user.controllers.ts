import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import prisma from "../core/config/prisma";
import bcrypt from 'bcrypt'
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";
import TokenOps from "../core/constants/jwt.functions";

export const userControllers = {
    createUser: async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
        try {
            const { name, email, password } = req.body

            const passHash = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passHash
                }
            })
            if (!user)
                return res.status(HttpCode.BAD_REQUEST).json({ msg: "User could not be created !" })
            return res.status(HttpCode.OK).json(user)
        } catch (error) {
            sendError(res, error)
        }
    },
    loginUser: async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const user = await prisma.user.findFirst({
                select: {
                    name: true,
                    email: true,
                    password: true
                },
                where: {
                    email
                },
            })
            if (!user)
                return res.status(HttpCode.NOT_FOUND).json({ msg: `${email} not found` })
            const testPass = await bcrypt.compare(password, user.password)
            if (!testPass)
                return res.status(HttpCode.NOT_FOUND).json({ msg: `${password} not correct` })
            // jwt token generation
            user.password = "" //rendering the password null not to create token from it
            const accessToken = TokenOps.generateAccessToken(user)
            const refreshToken = TokenOps.generateRefreshToken(user)
            user.password = " "
            res.cookie(`${user.name}-cookie`, refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 1000
            }) //refresh token stored in cookie
            console.log(accessToken)
            res.json({ msg: "User successfully logged in" }).status(HttpCode.OK)

        } catch (error) {
            sendError(res, error)
        }
    },
    logoutUser: async (req: Request, res: Response) => {
        try {

            const { email } = req.body
            //confirming first by email if user exists 
            const user = await prisma.user.findFirst({
                select: {
                    name: true,
                    email: true
                },
                where: {
                    email
                }
            })
            if (!user)
                return res.status(HttpCode.NOT_FOUND).json({ msg: `${email} not found` })
            // obtaiining user's token
            const accessToken = req.headers.authorization
            const refreshToken = req.cookies[`${user.name}-cookie`]
            // verifying if token exists
            if (!accessToken || !refreshToken)
                return res.status(HttpCode.UNAUTHORIZED).json({ message: "Unauthorized: No token available or expired" });
            console.log("yo")
            const decodedUser = TokenOps.verifyAccessToken(accessToken);
            console.log("yo")
            if (!decodedUser)
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ msg: "Invalid or expired token" })
            res.clearCookie('${user.name}-cookie`')
            return res.status(HttpCode.OK).json({ msg: "User succesffully logout" })

        } catch (error) {
            sendError(res, error)
        }
    },
    // get user profile
    getUser: async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const userProfile = await prisma.user.findUnique({
                where: {
                    userID: id
                }
            })
            if(!userProfile)
                return res.status(HttpCode.NOT_FOUND).json({msg:"could not found user"})
            const accessToken = req.headers.authorization
            const refreshToken = req.cookies[`${userProfile.name}-cookie`]
            // verifying if token exists
            if (!accessToken || !refreshToken)
                return res.status(HttpCode.UNAUTHORIZED).json({ message: `Unauthorized:${userProfile.name} not actually connected` });
            console.log("yo")
            const decodedUser = TokenOps.verifyAccessToken(accessToken);
            console.log("yo")
            if (!decodedUser)
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ msg: "Invalid or expired token" })
            if (!userProfile)
                return res.json({ msg: "User info's failed retrieval" }).status(HttpCode.NOT_FOUND)
            return res.status(HttpCode.OK).json({msg:`${userProfile.name} successfully login`})
        } catch (error) {
            sendError(res, error)
        }
    },
}