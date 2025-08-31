import prisma from '../prisma';

interface IArtistData {
  name: string;
  photoUrl?: string;
  categoryId?: string; // New field
}

export const getAllArtists = async (categoryId?: string) => {
  return await prisma.artist.findMany({
    where: categoryId ? { categoryId } : {},
    include: { category: true }, // Include category
  });
};

export const getArtistById = async (id: string) => {
  return await prisma.artist.findUnique({
    where: { id },
    include: { musics: true, category: true }, // Include category
  });
};

export const createArtist = async (data: IArtistData) => {
  return await prisma.artist.create({
    data,
  });
};

export const updateArtist = async (id: string, data: IArtistData) => {
  return await prisma.artist.update({
    where: { id },
    data,
  });
};

export const deleteArtist = async (id: string) => {
  // Before deleting an artist, delete their associated musics
  await prisma.music.deleteMany({
    where: { artistId: id },
  });
  return await prisma.artist.delete({
    where: { id },
  });
};