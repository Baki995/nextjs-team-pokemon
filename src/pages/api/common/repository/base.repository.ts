import { Model, Document, FilterQuery } from "mongoose";

export default abstract class BaseRepository<T extends Document> {
  protected constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const newDocument = new this.model(data);
    return await newDocument.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndRemove(id);
  }
}
