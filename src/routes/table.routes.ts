import { Router } from "express";
import tableControllers from "../controllers/table.controllers";

const routerTable = Router()

//getting the available list table
routerTable.get("/",tableControllers.getTables)
//adding a new table
routerTable.post("/",tableControllers.createTable)
//update a table infos
routerTable.put("/:id",tableControllers.updateTable)
//delete a table
routerTable.delete("/:id",tableControllers.deleteTable)

export default routerTable