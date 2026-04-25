import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { JWT_SECRET } from '@repo/backend-common/config';
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from '@repo/common/types';
import { prisma } from '@repo/db/prisma';

const user = prisma.user;
const room = prisma.room;
const chat = prisma.chat;

export const signup = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    console.log(data);

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Inputs',
      });
    }

    const { username, password, email, name } = data.data;

    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Required field missing',
      });
    }

    const userExists = await user.findUnique({
      where: {
        username,
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists, please login to continue',
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const userCreated = await user.create({
      data: {
        username,
        password: encryptedPassword,
        email,
        name,
      },
    });

    const token = jwt.sign({ userId: userCreated.id }, JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: userCreated,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const data = SignInSchema.safeParse(req.body);

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
      });
    }

    const { email, password } = data.data;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password required',
      });
    }

    const userExists = await user.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const comparePassword = await bcrypt.compare(password, userExists.password);

    if (comparePassword === false) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect Password',
      });
    }

    const token = jwt.sign({ userId: userExists.id }, JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: 'Log in successful',
      data: userExists,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
      });
    }

    const { name } = parsedData.data;

    // @ts-ignore
    const user = req.user;

    const roomCreated = await room.create({
      data: {
        slug: name,
        adminId: user.userId,
        userId: user.userId,
      },
    });

    return res.status(200).json({
      success: false,
      message: 'Room created successfully',
      roomId: roomCreated.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const chats = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId as string;

    const messages = await chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: 'desc',
      },
      take: 50,
    });

    return res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const slug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const roomm = await room.findFirst({
      where: {
        slug: slug as string,
      },
    });

    return res.status(200).json({
      success: false,
      message: 'room found successfully',
      data: roomm,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
