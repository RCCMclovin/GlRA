import path from 'path';
import fs from 'fs/promises';
import { MediaDTO } from './media.types';
import { Media, PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();
const publicPath = process.env.PUBLIC_PATH as string;

async function createMedia(media: MediaDTO): Promise<Media> {
  const filePath = path.join(publicPath, 'user-uploads', media.name);
  try {
    const buffer = await new Response(media.data).arrayBuffer();

    await fs
      .writeFile(filePath, Buffer.from(buffer))
      .catch((err) => console.log('Error writing file:', err));
    return prisma.media.create({
      data: {
        name: media.name,
        link: filePath,
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function deleteMediaById(id: string): Promise<void> {
  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    fs.unlink(media.link).catch((err) =>
      console.log('Error deleting file:', err),
    );
  }
  await prisma.findingMedia.deleteMany({where:{mediaId: id}});
  await prisma.media.delete({ where: { id } });
}

async function getMediaById(id: string): Promise<string> {
  const media = await prisma.media.findUnique({ where: { id } });
  return media?.link || '';
}

async function getMediaByFinding(findingId: string): Promise<Media[]>{
    const medias: Media[] = [];
    (await prisma.findingMedia.findMany({where:{findingId}})).forEach(async (m) =>{
        medias.push(await prisma.media.findUnique({where:{id:m.mediaId}}) as Media);
    })
    return medias;
}

async function getFindingByMedia(mediaId: string): Promise<string | null>{
    return (await prisma.findingMedia.findFirst({where:{mediaId}}))?.findingId || null;
}

async function vinculateMediaFinding(mediaId: string, findingId: string) {
    await prisma.findingMedia.create({data:{mediaId, findingId}});
}

export default {
  createMedia,
  deleteMediaById,
  getMediaById,
  getMediaByFinding,
  getFindingByMedia,
  vinculateMediaFinding
};