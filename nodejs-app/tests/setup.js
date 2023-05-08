import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongo = await MongoMemoryServer.create();

export const connect = () => {
  const uri = mongo.getUri();
  mongoose.set("strictQuery", false).connect(uri);
};

export const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};
