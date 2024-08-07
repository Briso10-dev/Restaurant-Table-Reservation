import { Request,Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

const tableControllers = {
    //get available tables
    getTables : async (req:Request,res:Response)=>{
        try {
            const tables = await prisma.table.findMany({
                select:{
                    tableID : true,
                    number : true,
                    capacity : true,
                    state: true
                },
                //testing condition
                where:{
                    state : "free"
                }
            })
            if(!tables) res.status(HttpCode.NOT_FOUND).json({msg:"No free table found"})
            res.status(HttpCode.OK).json(tables)
        } catch (error) {
            sendError(res,error)
        }
    },
    createTable : async (req:Request,res:Response)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
        try {
            const {number,capacity} = req.body

            const table = await prisma.table.create({
                data:{
                    number,
                    capacity
                }
            })
            if(!table) res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"could not create table"})
            return res.status(HttpCode.OK).json({table})
        } catch (error) {
            sendError(res,error)
        }
    },
    updateTable : async(req:Request,res:Response)=>{
        try {
            const {id} = req.params
            const {number,capacity} = req.body

            const updateTable = await prisma.table.update({
                select:{
                    tableID:true,
                    number:true,
                    capacity:true
                },
                where:{
                    tableID : id
                },
                data:{
                    number,
                    capacity
                }
            })
            if(!updateTable) res.status(HttpCode.INTERNAL_SERVER_ERROR).json(updateTable)
            return res.status(HttpCode.OK).json(updateTable)
        } catch (error) {
            sendError(res,error)
        }
    },
    deleteTable: async (req:Request,res:Response)=>{
        try {
            const {id} = req.params

            const table = await prisma.table.delete({
                where:{
                    tableID : id
                }
            })
            if(!table) res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"COuld not delete table"})
            return res.status(HttpCode.OK).json({msg:`table${table.number} successfully deleted`})
        } catch (error) {
            sendError(res,error)
        }
    }
}

export default tableControllers