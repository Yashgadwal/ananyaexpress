import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prismaClientSingleton = () => {
  if (process.env.VERCEL) {
    // In Vercel serverless environment, the root directory is read-only.
    // SQLite requires a writable directory (/tmp) for lock/journal files.
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), '.next', 'server', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (e) {
            console.error('Error copying dev.db to /tmp:', e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return new PrismaClient({
        datasources: {
          db: {
            url: `file:${tmpDbPath}`,
          },
        },
      });
    }
  }

  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
