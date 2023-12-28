// 1. insertOne -> phone book.      2. insertMany         3. deleteOne
// 4. deleteMany   5. updateOne   6. updateMany    7. getOne   8. getMany

import { Client } from "pg";
import { connectDB, closeDB } from "./dbConnection";
import {
  PhoneBook,
  keyType,
  UpdateRecord,
  PhoneBookFieldNames,
} from "./customInterfacesAndTypes";
const fieldNames: PhoneBookFieldNames[] = [
  "email",
  "phoneNo",
  "address",
  "name",
  "password",
];
class Model {
  private dbClient!: Client;

  constructor(client: Client) {
    this.dbClient = client;
  }

  async insertOne(contact: PhoneBook): Promise<void> {
    try {
      if (this.dbClient) {
        const { name, phoneNo, email, address, password } = contact;

        const query = `INSERT INTO contacts (name, phoneNo, email, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

        const values = [name, phoneNo, email, address, password];

        const result = await this.dbClient.query(query, values);

        console.log(`Contact inserted with ID: ${result.rows[0].id}`);
      }
    } catch (error) {
      console.error("Error inserting contact:", error);
    }
  }

  async deleteOne(key: keyType, value: string): Promise<void> {
    try {
      if (this.dbClient) {
        const query = `DELETE FROM contacts WHERE ${key} = '${value}'`;

        const result = await this.dbClient.query(query);
        console.log(`Total deleted contacts: ${result.rowCount}`);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }
  async getOne(key: keyType, value: string): Promise<void> {
    try {
      if (this.dbClient) {
        const query = `Select * FROM contacts WHERE ${key} = '${value}'`;

        const result = await this.dbClient.query(query);
        console.log(result.rows[0])
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }

  async getMany(key: PhoneBookFieldNames, value: string): Promise<void> {
    try {
      if (this.dbClient) {
        const query = `Select * FROM contacts WHERE ${key} LIKE '%${value}%'`;

        const result = await this.dbClient.query(query);
        console.log(result.rows)
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }
  async updateOne(
    keyName: keyType,
    keyvalue: string,
    values: UpdateRecord
  ): Promise<void> {
    try {
      if (this.dbClient) {
        const columnsToUpdate = Object.keys(values)
          .map(
            (column) => `${column} = '${values[column as keyof UpdateRecord]}'`
          )

          .join(", ");

        const query = `UPDATE contacts SET ${columnsToUpdate} WHERE ${keyName} = '${keyvalue}'`;

        const result = await this.dbClient.query(query);

        console.log(`Total updated contacts: ${result.rowCount}`);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  }
  async insertMany(records: PhoneBook[]): Promise<void> {
    try {
      if (this.dbClient && records.length > 0) {
        const columns = fieldNames.join(", ");

        const values = records
          .map((record) => {
            const singleRecordValues = fieldNames
              .map((value) =>
                record[value] !== undefined ? `'${record[value]}'` : "NULL"
              )
              .join(", ");
            return `(${singleRecordValues})`;
          })
          .join(", ");

        const query = `INSERT INTO Contacts (${columns}) VALUES ${values}`;

        const result = await this.dbClient.query(query);

        console.log(`Total updated contacts: ${result.rowCount}`);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  }
}

(async () => {
  let dbClient: Client;
  try {
    dbClient = await connectDB();
    console.error("DB connection successful");

    const myModel = new Model(dbClient);

    // await myModel.insertMany([
    //   {
    //     name: "nafay3",
    //     phoneNo: "nafay3phoneNo",
    //     email: "nafay3@gmail.com",
    //     address: "nafay3 home",
    //     password: "nafay3Password",
    //   },
    //   {
    //     name: "nafay4",
    //     phoneNo: "nafay4phoneNo",
    //     email: "nafay4@gmail.com",
    //     address: "nafay4 home",
    //     password: "nafay4Password",
    //   },
    // ]);

    await myModel.getMany("email", "@gmail.com");
    // await myModel.deleteOne("email", "nafay1@gmail.com");
    // await myModel.updateOne("email", "nafay2@gmail.com", {
    //   name: "nafay2",
    // });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Ensure to disconnect from the database after the operation
    // await closeDB(dbClient);
  }
})();
