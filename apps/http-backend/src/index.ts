import express from 'express';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';
import bcrypt from 'bcrypt';

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

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      data: {
        email,
        password: encryptedPassword,
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

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    const existingUser = await User.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'User signed in successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to sign in' });
  }
});

app.post('/room', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
