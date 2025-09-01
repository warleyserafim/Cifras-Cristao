import prisma from '../prisma';

interface ICommentData {
  content: string;
  userId: string;
  musicId: string;
}

export const getCommentsByMusicId = async (musicId: string) => {
  return await prisma.comment.findMany({
    where: { musicId },
    include: { user: true },
  });
};

export const createComment = async (data: ICommentData) => {
  return await prisma.comment.create({
    data,
  });
};

export const deleteComment = async (id: string) => {
  return await prisma.comment.delete({
    where: { id },
  });
};

export const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: { id },
  });
};