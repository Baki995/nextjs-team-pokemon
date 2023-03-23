import BaseRepository from "@/src/pages/api/common/repository/base.repository";
import Database from "@/src/pages/api/common/database";
import { User } from "@/src/pages/api/common/models/user.model";
const instance = Database.getInstance();

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(instance.getModel("User"));
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
