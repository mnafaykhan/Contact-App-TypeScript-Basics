"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpCodes_1 = __importDefault(require("../constants/httpCodes"));
const appMessages_1 = __importDefault(require("../constants/appMessages"));
const database_1 = require("../services/database");
const appMessages_2 = __importDefault(require("../constants/appMessages"));
function isKeyType(value) {
    return value === "phoneNo" || value === "email";
}
function isPhoneBookFieldName(key) {
    return ["name", "phoneNo", "email", "address", "password"].includes(key);
}
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.query;
        if ((key !== "phoneNo" && key !== "email") || typeof value !== "string") {
            return res
                .status(httpCodes_1.default.BAD_REQUEST)
                .send(appMessages_1.default.INVALID_REQUEST);
        }
        let result = yield database_1.contactDBService.getSingleRecord(key, value);
        return res.status(httpCodes_1.default.OK).send(result);
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const getMany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.query;
        if (typeof value === "string" &&
            typeof key === "string" &&
            isPhoneBookFieldName(key)) {
            let result = yield database_1.contactDBService.getMultipleRecords(key, value);
            return res.status(httpCodes_1.default.OK).send(result);
        }
        else {
            return res
                .status(httpCodes_1.default.BAD_REQUEST)
                .send(appMessages_1.default.INVALID_REQUEST);
        }
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const insertOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        let result = yield database_1.contactDBService.insertSingleRecord(reqBody);
        return result
            ? res
                .status(httpCodes_1.default.CREATED)
                .send(appMessages_2.default.RECORD_SUCCESSFULY_CREATED)
            : res.status(httpCodes_1.default.INTERNAL_SERVER_ERROR).send({
                message: appMessages_2.default.RECORD_INSERTION_FAILED,
                reason: "Invalid data or constraint violation",
            });
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const insertMany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        let result = yield database_1.contactDBService.insertMultipleRecords(reqBody);
        return result
            ? res
                .status(httpCodes_1.default.CREATED)
                .send(appMessages_2.default.RECORD_SUCCESSFULY_CREATED)
            : res.status(httpCodes_1.default.INTERNAL_SERVER_ERROR).send({
                message: appMessages_2.default.RECORD_INSERTION_FAILED,
                reason: "Invalid data or constraint violation",
            });
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.body;
        let result = yield database_1.contactDBService.deleteSingleRecord(key, value);
        return result
            ? res
                .status(httpCodes_1.default.OK)
                .send(appMessages_2.default.RECORD_SUCCESSFULY_DELETED)
            : res.status(httpCodes_1.default.INTERNAL_SERVER_ERROR).send({
                message: appMessages_2.default.APP_DELETE_ERROR_RECORD_NOTFOUND,
            });
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const deleteMany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.body;
        let result = yield database_1.contactDBService.deleteMultipleRecords(key, value);
        return result > 0
            ? res.status(httpCodes_1.default.OK).send({
                message: `${result} ${appMessages_2.default.RECORD_SUCCESSFULY_DELETED}`,
            })
            : res.status(httpCodes_1.default.INTERNAL_SERVER_ERROR).send({
                message: appMessages_2.default.APP_DELETE_ERROR_RECORD_NOTFOUND,
            });
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyName, keyValue, values, } = req.body;
        let result = yield database_1.contactDBService.updateSingleRecord(keyName, keyValue, values);
        return result
            ? res
                .status(httpCodes_1.default.OK)
                .send(appMessages_2.default.RECORD_SUCCESSFULY_UPDATED)
            : res.status(httpCodes_1.default.NOT_FOUND).send({
                message: appMessages_2.default.APP_RESOURCE_NOT_FOUND,
            });
    }
    catch (err) {
        console.log("Error occured in Server\n", err.message);
        return res
            .status(httpCodes_1.default.INTERNAL_SERVER_ERROR)
            .send(appMessages_2.default.INTERNAL_SERVER_ERROR);
    }
});
const contactController = {
    updateOne,
    getOne,
    getMany,
    insertOne,
    insertMany,
    deleteOne,
    deleteMany,
};
exports.default = contactController;
