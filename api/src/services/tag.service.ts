import prisma from '../prisma';

interface ITagData {
  name: string;
}

export const getAllTags = async () => {
  return await prisma.tag.findMany();
};

export const createTag = async (data: ITagData) => {
  return await prisma.tag.create({
    data,
  });
};

export const deleteTag = async (id: string) => {
  // Delete associated MusicTag entries first
  await prisma.musicTag.deleteMany({ where: { tagId: id } });
  return await prisma.tag.delete({
    where: { id },
  });
};