import { Client } from "pg";

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "Contacts",
  password: "FypGrammar@123",
  port: 5432,
};

export async function connectDB(): Promise<Client> {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

export async function closeDB(client: Client): Promise<void> {
  await client.end();
}
