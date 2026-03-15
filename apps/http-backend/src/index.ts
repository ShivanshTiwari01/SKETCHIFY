import express from 'express';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';

const app = express();

const PORT = 3001;

const User = prismaClient.user;
const Room = prismaClient.room;

app.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, image } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        image,
      },
    });

    return res.status(201).json({ message: 'User created succesfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create user' });
  }
});

app.post('/signin', (req, res) => {});

app.post('/room', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
