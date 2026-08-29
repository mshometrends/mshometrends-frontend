import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from '../controllers/user.controller.js';

export const userRouter = Router();

// Auth Endpoints
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Admin User Management Routes
userRouter.get('/', getAllUsers);
userRouter.delete('/:id', deleteUser);
