import { Router } from "express";
import tableControllers from "../controllers/table.controllers";
import { tableValidator } from "../middleware/validator.middleware";

const routerTable = Router()

//getting the available list table
routerTable.get("/",tableControllers.getTables)
//adding a new table
routerTable.post("/",tableValidator,tableControllers.createTable)
//update a table infos
routerTable.put("/:id",tableControllers.updateTable)
//delete a table
routerTable.delete("/:id",tableControllers.deleteTable)

export default routerTable