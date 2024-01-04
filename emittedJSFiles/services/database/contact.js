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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient_1 = __importDefault(require("../../config/dbClient"));
const fieldNames = [
    "email",
    "phoneNo",
    "address",
    "name",
    "password",
];
const getSingleRecord = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `Select * FROM contacts WHERE ${key} = '${value}'`;
    const result = yield dbClient_1.default.query(queryString);
    return result.rows.length > 0
        ? (delete result.rows[0].id, delete result.rows[0].password, result.rows[0])
        : "No record found in DB";
});
const getMultipleRecords = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `Select * FROM contacts WHERE ${key} LIKE '%${value}%'`;
    const result = yield dbClient_1.default.query(queryString);
    return result.rows.length > 0
        ? result.rows.map((row) => {
            const { id, password } = row, rest = __rest(row, ["id", "password"]);
            return rest;
        })
        : "No record found in DB.";
});
const insertSingleRecord = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNo, email, address, password } = reqBody;
    const queryString = `INSERT INTO contacts (name, phoneNo, email, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const values = [name, phoneNo, email, address, password];
    const result = yield dbClient_1.default.query(queryString, values);
    return result.rowCount === 1 ? true : false;
});
const deleteSingleRecord = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `DELETE FROM contacts WHERE ${key} = '${value}'`;
    const result = yield dbClient_1.default.query(queryString);
    return result.rowCount === 1 ? true : false;
});
const deleteMultipleRecords = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `DELETE FROM contacts WHERE ${key} LIKE '%${value}%'`;
    const result = yield dbClient_1.default.query(queryString);
    return result.rowCount && result.rowCount > 0 ? result.rowCount : 0;
});
const insertMultipleRecords = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reqBody.length ", reqBody.length);
    if (reqBody.length > 0) {
        const columns = fieldNames.join(", ");
        const values = reqBody
            .map((record) => {
            const singleRecordValues = fieldNames
                .map((value) => record[value] !== undefined ? `'${record[value]}'` : "NULL")
                .join(", ");
            return `(${singleRecordValues})`;
        })
            .join(", ");
        const queryString = `INSERT INTO contacts (${columns}) VALUES ${values}`;
        const result = yield dbClient_1.default.query(queryString);
        return result.rowCount && result.rowCount > 0 ? true : false;
    }
    return false;
});
const updateSingleRecord = (keyName, keyValue, newValues) => __awaiter(void 0, void 0, void 0, function* () {
    const columnsToUpdate = Object.keys(newValues)
        .map((column) => `${column} = '${newValues[column]}'`)
        .join(", ");
    const query = `UPDATE contacts SET ${columnsToUpdate} WHERE ${keyName} = '${keyValue}'`;
    const result = yield dbClient_1.default.query(query);
    console.log(`Total updated contacts: ${result.rowCount}`);
    return result.rowCount ? true : false;
});
const contactDBService = {
    updateSingleRecord,
    getSingleRecord,
    getMultipleRecords,
    insertSingleRecord,
    insertMultipleRecords,
    deleteSingleRecord,
    deleteMultipleRecords,
};
exports.default = contactDBService;
