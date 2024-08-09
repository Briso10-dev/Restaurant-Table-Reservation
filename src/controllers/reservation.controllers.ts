import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import QRcode from "../core/constants/qrcode";
import sendMail from "../core/config/send.mail";
import EmailTemplate from "../core/template";
import { validationResult } from "express-validator";
import uploadImageToS3 from "../core/utils/upload.image";

const reservedControllers = {
    createReservation: async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        // Parse the JSON data from the form field
        let jsonData;
        try {
            jsonData = JSON.parse(req.body.json);
        } catch (error) {
            return res.status(400).send("Invalid JSON data");
        }

        // Check for validation errors
        const errors = validationResult(req.body.json);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
        try {
            const { user_id, table_id, dateReservation, hourReservation } = jsonData;
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
                        number: true,
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
                    state: "reserved"
                }
            })
            const updateReservation = await prisma.reservation.update({
                where: {
                    reservationID: reservation.reservationID
                },
                data: {
                    codeQR: `http://localhost:9001/browser/briso-bucket/images/${req.file.originalname}`
                }
            })
            const bucketName = "briso-bucket";
            const key = `images/${req.file.originalname}`;
            let filePath = req.file.path;

            await uploadImageToS3(bucketName, key, filePath);
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
    QRcodeScan: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            //finding user's reservation's id
            const reservation = await prisma.reservation.findUnique({
                select: {
                    user_id: true,
                    table_id: true,
                    dateReservation: true,
                    hourReservation: true
                },
                where: {
                    reservationID: id
                }
            })
            if (!reservation) return res.status(HttpCode.NOT_FOUND).json({ msg: "never reserved here" })
            //updating table's state
            await prisma.table.update({
                where: {
                    tableID: reservation.table_id
                },
                data: {
                    state: "occupied"
                }
            })
            //rendering QRcode invalid
            const updateReserved = await prisma.reservation.update({
                select: {
                    user_id: true,
                    table_id: true,
                    dateReservation: true,
                    codeQR: true
                },
                where: {
                    reservationID: id
                },
                data: {
                    codeQR: null,
                }
            })
            return res.status(HttpCode.OK).json(updateReserved)
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