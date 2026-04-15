import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema } from '@repo/common/types';
import { prisma } from '@repo/db/prisma';

const app = express();
app.use(express.json());
const port = 4020;

const user = prisma.user;

app.post('/api/signup', async (req, res) => {
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
        message: 'All Fields are required',
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

    const userCreated = await user.create({
      data: {
        username,
        password,
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
