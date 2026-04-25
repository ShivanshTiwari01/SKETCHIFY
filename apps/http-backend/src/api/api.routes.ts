import express, { Router } from 'express';
import * as controller from './api.controller.js';
import { authenticationMiddleware } from '../middleware.js';

const router: Router = express.Router();

router.post('/signup', controller.signup);

router.post('/signin', controller.signin);

router.post('/room', authenticationMiddleware, controller.createRoom);

router.get('/chat/:roomId', controller.chats);

router.get('/room/:slug', controller.slug);

export default router;
