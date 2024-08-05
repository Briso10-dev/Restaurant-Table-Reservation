import { Router } from "express";
import tableControllers from "../controllers/table.controllers";

const routerTable = Router()

//getting the available list table
routerTable.get("/",tableControllers.getTables)
routerTable.post("/",tableControllers.createTable)

export default routerTable