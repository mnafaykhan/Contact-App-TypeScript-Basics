import { Request, Response } from "express";
import HttpCodes from "../constants/httpCodes";
import AppMessages from "../constants/appMessages";
import { contactDBService } from "../services/database";
import winstonLogger from "./../utils/winston"
import {
  keyType,
  PhoneBook,
  PhoneBookFieldNames,
  PhoneBookRequestBody,
  UpdateRecord,
} from "./../utils/customInterfacesAndTypes";
import appMessages from "../constants/appMessages";

function isKeyType(value: string): value is keyType {
  return value === "phoneNo" || value === "email";
}

function isPhoneBookFieldName(key: string): key is PhoneBookFieldNames {
  return ["name", "phoneNo", "email", "address", "password"].includes(key);
}
const getOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { key, value } = req.query;
    // Validate that key has one of the allowed values and value is of type string
    if ((key !== "phoneNo" && key !== "email") || typeof value !== "string") {
      return res
        .status(HttpCodes.BAD_REQUEST)
        .send(AppMessages.INVALID_REQUEST);
    }

    let result = await contactDBService.getSingleRecord(key, value);

    return res.status(HttpCodes.OK).send(result);
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};

const getMany = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { key, value } = req.query as { key: string; value: string };
    // Validate that value & key are of type string and has one of the allowed values

    if (
      typeof value === "string" &&
      typeof key === "string" &&
      isPhoneBookFieldName(key)
    ) {
      let result = await contactDBService.getMultipleRecords(key, value);

      return res.status(HttpCodes.OK).send(result);
    } else {
      return res
        .status(HttpCodes.BAD_REQUEST)
        .send(AppMessages.INVALID_REQUEST);
    }
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};
const insertOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reqBody: PhoneBook = req.body;
    let result = await contactDBService.insertSingleRecord(reqBody);

    return result
      ? res
          .status(HttpCodes.CREATED)
          .send(appMessages.RECORD_SUCCESSFULY_CREATED)
      : res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({
          message: appMessages.RECORD_INSERTION_FAILED,
          reason: "Invalid data or constraint violation",
        });
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};

const insertMany = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reqBody: PhoneBook[] = req.body;
    let result = await contactDBService.insertMultipleRecords(reqBody);

    return result
      ? res
          .status(HttpCodes.CREATED)
          .send(appMessages.RECORD_SUCCESSFULY_CREATED)
      : res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({
          message: appMessages.RECORD_INSERTION_FAILED,
          reason: "Invalid data or constraint violation",
        });
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};

const deleteOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { key, value }: { key: keyType; value: string } = req.body;

    let result = await contactDBService.deleteSingleRecord(key, value);

    return result
      ? res
          // .status(HttpCodes.DELETED)
          .status(HttpCodes.OK)
          .send(appMessages.RECORD_SUCCESSFULY_DELETED)
      : res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({
          message: appMessages.APP_DELETE_ERROR_RECORD_NOTFOUND,
        });
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};

const deleteMany = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { key, value }: { key: PhoneBookFieldNames; value: string } =
      req.body;

    let result = await contactDBService.deleteMultipleRecords(key, value);

    return result > 0
      ? res.status(HttpCodes.OK).send({
          message: `${result} ${appMessages.RECORD_SUCCESSFULY_DELETED}`,
        })
      : res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({
          message: appMessages.APP_DELETE_ERROR_RECORD_NOTFOUND,
        });
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};

const updateOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      keyName,
      keyValue,
      values,
    }: { keyName: keyType; keyValue: string; values: UpdateRecord } = req.body;

    let result = await contactDBService.updateSingleRecord(
      keyName,
      keyValue,
      values
    );

    return result
      ? res
          // .status(HttpCodes.DELETED)
          .status(HttpCodes.OK)
          .send(appMessages.RECORD_SUCCESSFULY_UPDATED)
      : res.status(HttpCodes.NOT_FOUND).send({
          message: appMessages.APP_RESOURCE_NOT_FOUND,
        });
  } catch (err: any) {
    winstonLogger.error(`Error occured in Server\n${err.message}`);
    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .send(appMessages.INTERNAL_SERVER_ERROR);
  }
};
// Exporting all functions under a single name
const contactController = {
  updateOne,
  getOne,
  getMany,
  insertOne,
  insertMany,
  deleteOne,
  deleteMany,
};

export default contactController;
