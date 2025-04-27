import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        bookings: true,
        reviews: true,
        occurrences: true,
        creator: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      tours
    };

    const backupDir = path.join(__dirname, 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const fileName = `tours-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    await fs.writeFile(
      path.join(backupDir, fileName),
      JSON.stringify(backupData, null, 2)
    );

    console.log(`Backup completed: ${fileName}`);
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData(); 