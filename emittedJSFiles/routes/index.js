"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_1 = __importDefault(require("./contact"));
function default_1(app) {
    app.use("/api/contact", contact_1.default);
}
exports.default = default_1;
;
