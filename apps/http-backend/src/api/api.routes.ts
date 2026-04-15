import express, { Router } from 'express';
import * as controller from './api.controller.js';

const router: Router = express.Router();

router.post('/signup', controller.signup);

router.post('/signin', controller.signin);

router.post('/room', controller.room);

export default router;
