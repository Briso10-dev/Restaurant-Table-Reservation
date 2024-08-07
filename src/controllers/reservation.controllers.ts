import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import QRcode from "../core/constants/qrcode";
import sendMail from "../core/config/send.mail";
import EmailTemplate from "../core/template";

const reservedControllers = {
    createReservation: async (req: Request, res: Response) => {
        try {
            const { user_id, table_id, dateReservation, hourReservation } = req.body
            //verifying if user and table exists
            const [user, table] = await Promise.all([
                prisma.user.findUnique({
                    select: {
                        name: true,
                        email: true,
                    },
                    where: {
                        userID: user_id
                    }
                }),
                prisma.table.findUnique({
                    select: {
                        tableID: true,
                        number:true,
                    },
                    where: {
                        tableID: table_id
                    }
                })
            ])
            if (!user || !table) return res.status(HttpCode.NOT_FOUND).json({ msg: "No user or table found" })

            const reservation = await prisma.reservation.create({
                data: {
                    user_id,
                    table_id,
                    dateReservation,
                    hourReservation,
                }
            })
            // Generate QR code
            const qrCodeText = QRcode.formatData(reservation);
            const codeQR = await QRcode.generateQRCode(qrCodeText);
            //update  state's table and user's QRcode
            await prisma.table.update({
                where: {
                    tableID: reservation.table_id
                },
                data: {
                    state: "filled"
                }
            })
            const updateReservation = await prisma.reservation.update({
                where: {
                    reservationID: reservation.reservationID
                },
                data: {
                    codeQR
                }
            })
            if (!updateReservation) return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "could not provide you reservation" })
            const message = "Reservation succeed"
            sendMail(user.email, "Exercice3-Restaurant Table Reservation System", await EmailTemplate.QRcodeSender(
                user.name,
                table.number,
                reservation.dateReservation,
                reservation.hourReservation,
                message,
                reservation.codeQR))
            return res.status(HttpCode.OK).json(updateReservation)
        } catch (error) {
            sendError(res, error)
        }
    },
    freeReservation: async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const freeTable = await prisma.table.update({
                select: {
                    number: true,
                    capacity: true,
                    state: true
                },
                where: {
                    tableID: id
                },
                data: {
                    state: "free"
                }
            })
            if (!freeTable) return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "could not provide you reservation" })
            return res.status(HttpCode.OK).json(freeTable)

        } catch (error) {
            sendError(res, error)
        }
    }
}

export default reservedControllers