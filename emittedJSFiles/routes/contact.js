"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./../controller");
const router = express_1.default.Router();
router.get("/getOne", controller_1.contactController.getOne);
router.get("/getMany", controller_1.contactController.getMany);
router.post("/insertOne", controller_1.contactController.insertOne);
router.post("/insertMany", controller_1.contactController.insertMany);
router.patch("/updateOne", controller_1.contactController.updateOne);
router.delete("/deleteOne", controller_1.contactController.deleteOne);
router.delete("/deleteMany", controller_1.contactController.deleteMany);
exports.default = router;
