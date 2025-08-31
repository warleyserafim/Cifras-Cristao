import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '@prisma/client'; // Import Role enum

export const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      role: Role.USER, // Explicitly set default role for new registrations
    },
  });
  return user;
};

export const login = async (credentials: Pick<User, 'email' | 'password'>) => {
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Include user role in the JWT payload
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1h',
  });

  return { user, token };
};