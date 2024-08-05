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
            if (user)
                res.status(HttpCode.CREATED).json(user)
            else
                res.status(HttpCode.BAD_REQUEST).json({ msg: "User could not be created !" })
        } catch (error) {
            sendError(res, error)
        }
    },
    loginUser: async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const user = await prisma.user.findFirst({
                select:{
                    name:true,
                    email:true,
                    password:true
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
}