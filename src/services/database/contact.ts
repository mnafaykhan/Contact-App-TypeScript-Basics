import client from "../../config/dbClient";
import winstonLogger from "./../../utils/winston"
import {
  keyType,
  PhoneBook,
  UpdateRecord,
  PhoneBookFieldNames,
} from "./../../utils/customInterfacesAndTypes";
const fieldNames: PhoneBookFieldNames[] = [
  "email",
  "phoneNo",
  "address",
  "name",
  "password",
];
const getSingleRecord = async (
  key: keyType,
  value: string
): Promise<PhoneBook | string> => {
  const queryString = `Select * FROM contacts WHERE ${key} = '${value}'`;

  const result = await client.query(queryString);

  return result.rows.length > 0
    ? (delete result.rows[0].id, delete result.rows[0].password, result.rows[0])
    : "No record found in DB";
};

const getMultipleRecords = async (
  key: PhoneBookFieldNames,
  value: string
): Promise<PhoneBook[] | string> => {
  const queryString = `Select * FROM contacts WHERE ${key} LIKE '%${value}%'`;

  const result = await client.query(queryString);

  return result.rows.length > 0
    ? result.rows.map((row) => {
        const { id, password, ...rest } = row;
        return rest;
      })
    : "No record found in DB.";
};

const insertSingleRecord = async (reqBody: PhoneBook): Promise<boolean> => {
  const { name, phoneNo, email, address, password } = reqBody;

  const queryString = `INSERT INTO contacts (name, phoneNo, email, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

  const values = [name, phoneNo, email, address, password];

  const result = await client.query(queryString, values);
  return result.rowCount === 1 ? true : false;
};

const deleteSingleRecord = async (
  key: keyType,
  value: string
): Promise<boolean> => {
  const queryString = `DELETE FROM contacts WHERE ${key} = '${value}'`;

  const result = await client.query(queryString);
  return result.rowCount === 1 ? true : false;
};

const deleteMultipleRecords = async (
  key: PhoneBookFieldNames,
  value: string
): Promise<number> => {
  const queryString = `DELETE FROM contacts WHERE ${key} LIKE '%${value}%'`;

  const result = await client.query(queryString);
  return result.rowCount && result.rowCount > 0 ? result.rowCount : 0;
};

const insertMultipleRecords = async (
  reqBody: PhoneBook[]
): Promise<boolean> => {
  if (reqBody.length > 0) {
    const columns = fieldNames.join(", ");

    const values = reqBody
      .map((record) => {
        const singleRecordValues = fieldNames
          .map((value) =>
            record[value] !== undefined ? `'${record[value]}'` : "NULL"
          )
          .join(", ");
        return `(${singleRecordValues})`;
      })
      .join(", ");
    const queryString = `INSERT INTO contacts (${columns}) VALUES ${values}`;

    const result = await client.query(queryString);

    return result.rowCount && result.rowCount > 0 ? true : false;
  }
  return false;
};
const updateSingleRecord = async (
  keyName: keyType,
  keyValue: string,
  newValues: UpdateRecord
): Promise<boolean> => {
  const columnsToUpdate = Object.keys(newValues)
    .map((column) => `${column} = '${newValues[column as keyof UpdateRecord]}'`)
    .join(", ");

  const query = `UPDATE contacts SET ${columnsToUpdate} WHERE ${keyName} = '${keyValue}'`;

  const result = await client.query(query);

   winstonLogger.info(`Total updated contacts: ${result.rowCount}`);
  return result.rowCount ? true : false;
};
const contactDBService = {
  updateSingleRecord,
  getSingleRecord,
  getMultipleRecords,
  insertSingleRecord,
  insertMultipleRecords,
  deleteSingleRecord,
  deleteMultipleRecords,
};
export default contactDBService;
