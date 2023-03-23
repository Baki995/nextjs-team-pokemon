import { NextApiRequest, NextApiResponse } from "next";
import { CreateUserDTO } from "./dto/user.dto";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import { UserRepository } from "@/src/pages/api/auth/repository/user.repository";
const userRepository = new UserRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const createUserDto = Object.assign(new CreateUserDTO(), req.body);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    let user;
    try {
      user = await userRepository.create(createUserDto);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(200).json({ user });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
