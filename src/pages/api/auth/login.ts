import { NextApiRequest, NextApiResponse } from "next";
import { LoginUserDTO } from "./dto/user.dto";
import { validate } from "class-validator";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/src/pages/api/auth/repository/user.repository";
const secret = process.env.JWT_SECRET;
const userRepository = new UserRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const loginUserDto = Object.assign(new LoginUserDTO(), req.body);
    const errors = await validate(loginUserDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existUser = await userRepository.findByEmail(loginUserDto.email);

    if (!existUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = existUser.toObject();

    const isValidPassword = await compare(loginUserDto.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
