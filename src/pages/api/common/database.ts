import mongoose from "mongoose";
import * as models from "./models";

class Database {
  private static instance: Database;
  private mongoose: mongoose.Mongoose;

  private constructor() {
    this.createConnection();
  }

  private async createConnection() {
    const mongoURI = process.env.MONGO_URI.toString();
    this.mongoose = await mongoose.connect(mongoURI);
    if (Object.keys(mongoose.models).length < 1) {
      Object.keys(models).forEach((item) => {
        let modelName = item.toString().replace("Schema", "");
        modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
        mongoose.model(modelName, models[item]);
      });
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public getMongoose() {
    return this.mongoose;
  }

  public getModel(modelName: string) {
    return mongoose.models[modelName];
  }
}

export default Database;
