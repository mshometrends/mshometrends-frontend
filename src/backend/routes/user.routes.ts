import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  seedAdminUser,
} from '../controllers/user.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const userRouter = Router();

// Auth Endpoints (Public)
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Seed Admin Route (Ensures Admin exists in MongoDB Atlas)
userRouter.post('/seed-admin', seedAdminUser);
userRouter.get('/seed-admin', seedAdminUser);

// Admin User Management Routes (Protected - Superadmin Only)
userRouter.get('/', requireAdminAuth, getAllUsers);
userRouter.post('/', requireAdminAuth, createUser);
userRouter.put('/:id', requireAdminAuth, updateUser);
userRouter.patch('/:id', requireAdminAuth, updateUser);
userRouter.delete('/:id', requireAdminAuth, deleteUser);


