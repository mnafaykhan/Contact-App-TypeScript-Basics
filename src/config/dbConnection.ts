import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
let client!: Client;
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
};

export async function connectDB(): Promise<Client> {
  client = new Client(dbConfig);
  await client.connect();  
  return client;
}

export async function closeDB(dbClient: Client): Promise<void> {
  await dbClient.end();
}


export default client;
