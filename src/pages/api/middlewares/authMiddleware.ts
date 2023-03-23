import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const authMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const tokenPart = token.split(" ");
    try {
      req["user"] = jwt.verify(tokenPart[1], secret);
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
  };
