import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

export const createUser = async (
  email: string,
  username: string,
  password: string
) => {
  const existingUser =
    await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  return user;
};