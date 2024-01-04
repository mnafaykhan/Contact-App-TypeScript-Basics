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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const dbClient_1 = __importDefault(require("./config/dbClient"));
const httpCodes_1 = __importDefault(require("./constants/httpCodes"));
const appMessages_1 = __importDefault(require("./constants/appMessages"));
const app = (0, express_1.default)();
const port = parseInt(process.env.APP_PORT || "8089", 10);
app.use(express_1.default.json());
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleDateString() + "    " + new Date().toLocaleTimeString();
    const routeName = req.originalUrl;
    console.log(`${timestamp}            Route: ${routeName}`);
    const methodsToLog = ["POST", "PUT", "DELETE"];
    if (methodsToLog.includes(req.method)) {
        console.log("Request Body:", req.body, "\n");
    }
    next();
});
app.get("/", (req, res) => {
    res.status(httpCodes_1.default.OK).send("Welcome to web api's by Nafay");
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbClient_1.default.connect();
        console.log("connected with Database!");
        (0, routes_1.default)(app);
        app.use((req, res, next) => {
            const error = new Error("API not found");
            next(error);
        });
        app.use((err, req, res, next) => {
            res.status(httpCodes_1.default.NOT_FOUND).send({
                error: {
                    message: err.message || appMessages_1.default.INTERNAL_SERVER_ERROR,
                },
            });
        });
        app.listen(port, () => {
            console.log(`app listening on port ${port}\n`);
        });
    }
    catch (err) {
        console.log("Error occured\n", err.message);
    }
}))();
