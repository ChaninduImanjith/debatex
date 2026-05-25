import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUser,
} from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      username,
      password,
    } = req.body;

    const user = await createUser(
      email,
      username,
      password
    );

    res.json({
      message: "User created",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // check user exists
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const currentUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};