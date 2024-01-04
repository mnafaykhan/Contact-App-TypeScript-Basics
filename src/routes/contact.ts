import express, { Express, Request, Response, Router } from "express";
import { contactController } from "./../controller";
const router: Router = express.Router();




router.get("/getOne", contactController.getOne);
router.get("/getMany", contactController.getMany);

router.post("/insertOne", contactController.insertOne);
router.post("/insertMany", contactController.insertMany);

router.patch("/updateOne", contactController.updateOne);

router.delete("/deleteOne", contactController.deleteOne);
router.delete("/deleteMany", contactController.deleteMany);

export default router;
