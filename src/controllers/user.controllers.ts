import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import prisma from "../core/config/prisma";
import bcrypt from 'bcrypt'
import sendError from "../core/constants/errors";

export const userControllers = {
    createUser: async (req: Request, res: Response) => {
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
}