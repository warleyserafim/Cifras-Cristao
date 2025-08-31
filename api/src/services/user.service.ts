import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import { User, Role } from '@prisma/client';

interface IUserData {
  name?: string;
  email?: string;
  password?: string;
  profilePhotoUrl?: string;
  role?: Role;
}

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, profilePhotoUrl: true }, // Exclude password
  });
};

export const updateUser = async (id: string, data: IUserData) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, profilePhotoUrl: true }, // Exclude password
  });
};

export const addFavoriteMusic = async (userId: string, musicId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      favorites: {
        connect: { id: musicId },
      },
    },
    select: { id: true, favorites: { select: { id: true } } }, // Return user with favorite music IDs
  });
};

export const removeFavoriteMusic = async (userId: string, musicId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      favorites: {
        disconnect: { id: musicId },
      },
    },
    select: { id: true, favorites: { select: { id: true } } }, // Return user with favorite music IDs
  });
};

export const getFavoriteMusic = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      favorites: {
        select: {
          id: true,
          title: true,
          tone: true,
          content: true,
          videoUrl: true,
          artist: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      },
    },
  });
  return user?.favorites || [];
};