import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      }
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });

  } catch (error: any) {
    console.log("🔥 FULL ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};