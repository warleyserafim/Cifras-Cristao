import prisma from '../prisma';

interface ICategoryData {
  name: string;
}

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const createCategory = async (data: ICategoryData) => {
  return await prisma.category.create({
    data,
  });
};

export const deleteCategory = async (id: string) => {
  // Before deleting a category, delete associated artists and their musics
  const artistsToDelete = await prisma.artist.findMany({
    where: { categoryId: id },
    select: { id: true },
  });

  for (const artist of artistsToDelete) {
    await prisma.music.deleteMany({
      where: { artistId: artist.id },
    });
  }

  await prisma.artist.deleteMany({
    where: { categoryId: id },
  });

  return await prisma.category.delete({
    where: { id },
  });
};