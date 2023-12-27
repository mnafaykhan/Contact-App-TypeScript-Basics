import { Client } from "pg";
import { connectDB, closeDB } from "./dbConnection";
import { PhoneBook } from "./customInterfacesAndTypes";
class Model {
  private dbClient: Client;

  constructor() {
    // Call an async function in the constructor
    (async () => {
      try {
        await this.connect();
        // Continue with other constructor logic if needed
      } catch (err) {
        console.error("Error in constructor:", err);
      }
    })();
  }

  private async connect(): Promise<void> {
    try {
      this.dbClient = await connectDB();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await closeDB(this.dbClient);
      console.log("Disconnected from the database");
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
  }
  async insertOne(contact: PhoneBook): Promise<boolean> {
    if (!this.dbClient) {
      console.error("Database connection not established");
      return false;
    }
    const { name, phoneNo, email, address, password } = contact;

    try {
      const query = `INSERT INTO contacts (name, phoneNo, email, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

      const values = [name, phoneNo, email, address, password];

      const result = await this.dbClient.query(query, values);

      console.log(`Contact inserted with ID: ${result.rows[0].id}`);
      return true;
    } catch (error) {
      console.error("Error inserting contact:", error);
      return false;
    }
  }
}
// Example usage
const myModel = new Model();

// Usage example
myModel
  .insertOne({
    name: "John Doe",
    phoneNo: "1234567890",
    email: "john.doe@example.com",
    address: "123 Main St",
    password: "securePassword",
  })
  .then((success) => {
    console.log("Insert success:", success);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
