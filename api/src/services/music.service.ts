import prisma from '../prisma';

interface IMusicData {
  title: string;
  tone: string;
  content: string; // Replaces lyrics and chord content
  videoUrl?: string; // Replaces youtubeUrl
  artistId: string;
  tagIds?: string[]; // For many-to-many tags
}

export const getAllMusic = async (tag?: string, searchQuery?: string) => {
  const where: any = {};

  if (tag) {
    where.tags = { some: { tag: { name: tag } } };
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { artist: { name: { contains: searchQuery, mode: 'insensitive' } } },
    ];
  }

  return await prisma.music.findMany({
    where,
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
  });
};


export const getMusicById = async (id: string) => {
  return await prisma.music.findUnique({
    where: { id },
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
  });
};

export const createMusic = async (data: IMusicData) => {
  const { tagIds, ...musicData } = data;
  return await prisma.music.create({
    data: {
      ...musicData,
      tags: {
        create: tagIds?.map(tagId => ({
          tag: { connect: { id: tagId } }
        })) || [],
      },
    },
  });
};

export const updateMusic = async (id: string, data: Partial<IMusicData>) => {
  const { tagIds, ...musicData } = data;

  // Handle tag updates: disconnect existing and connect new ones
  if (tagIds !== undefined) {
    await prisma.musicTag.deleteMany({ where: { musicId: id } }); // Disconnect all existing
  }

  return await prisma.music.update({
    where: { id },
    data: {
      ...musicData,
      tags: tagIds !== undefined ? { // Only update if tagIds is provided
        create: tagIds.map(tagId => ({
          tag: { connect: { id: tagId } }
        })),
      } : undefined,
    },
  });
};

export const deleteMusic = async (id: string) => {
  // Delete associated MusicTag entries first
  await prisma.musicTag.deleteMany({ where: { musicId: id } });
  return await prisma.music.delete({
    where: { id },
  });
};