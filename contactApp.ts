import { Client } from "pg";
import { connectDB, closeDB } from "./dbConnection";
import { PhoneBook } from "./customInterfacesAndTypes";
class Model {
  private dbClient!: Client | null;

  constructor() {
    this.dbClient = null;
  }

  async connect(): Promise<void> {
    try {
      this.dbClient = await connectDB();
      console.log("Connected to the database");
    } catch (err) {
      console.log("Failure in database connection!\n", err);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.dbClient) {
        await closeDB(this.dbClient);
        console.log("Disconnected from the database");
      }
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
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
}

(async () => {
  const myModel = new Model();

  try {
    await myModel.connect();

    await myModel.insertOne({
      name: "John Doe",
      phoneNo: "1234567890",
      email: "john.doe@example.com",
      address: "123 Main St",
      password: "securePassword",
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Ensure to disconnect from the database after the operation
    await myModel.disconnect();
  }
})();
