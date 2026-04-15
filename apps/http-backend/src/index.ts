import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema } from '@repo/common/types';
import { prisma } from '@repo/db/prisma';

const app = express();

const port = 4020;

app.post('/api/signup', async (req, res) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Inputs',
      });
    }

    const { username, password, name } = data;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and Password required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and Password required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.post('/api/room', async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'roomId is required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
