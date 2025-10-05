import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const fraisSchema = z.object({
  locationId: z.string(),
  type: z.string(),
  montant: z.number(),
  date: z.string(),
  description: z.string().optional(),
  estPaye: z.boolean().default(false),
});

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { locationId } = req.query;

    const whereClause: any = {};
    if (locationId) {
      const location = await prisma.location.findFirst({
        where: {
          id: locationId as string,
          userId: req.userId,
        },
      });

      if (!location) {
        return res.status(404).json({ error: 'Location non trouvée' });
      }

      whereClause.locationId = locationId;
    } else {
      const userLocations = await prisma.location.findMany({
        where: { userId: req.userId },
        select: { id: true },
      });

      whereClause.locationId = {
        in: userLocations.map(l => l.id),
      };
    }

    const frais = await prisma.frais.findMany({
      where: whereClause,
      include: {
        location: {
          include: {
            bien: true,
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(frais);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des frais' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const frais = await prisma.frais.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        location: {
          include: {
            bien: true,
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
    });

    if (!frais) {
      return res.status(404).json({ error: 'Frais non trouvé' });
    }

    const location = await prisma.location.findFirst({
      where: {
        id: frais.locationId,
        userId: req.userId,
      },
    });

    if (!location) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(frais);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du frais' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = fraisSchema.parse(req.body);

    const location = await prisma.location.findFirst({
      where: {
        id: data.locationId,
        userId: req.userId,
      },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location non trouvée' });
    }

    const frais = await prisma.frais.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        location: {
          include: {
            bien: true,
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(frais);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la création du frais' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = fraisSchema.partial().parse(req.body);

    const existingFrais = await prisma.frais.findUnique({
      where: { id: req.params.id },
      include: { location: true },
    });

    if (!existingFrais) {
      return res.status(404).json({ error: 'Frais non trouvé' });
    }

    if (existingFrais.location.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const updatedFrais = await prisma.frais.update({
      where: { id: req.params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        location: {
          include: {
            bien: true,
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedFrais);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du frais' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const frais = await prisma.frais.findUnique({
      where: { id: req.params.id },
      include: { location: true },
    });

    if (!frais) {
      return res.status(404).json({ error: 'Frais non trouvé' });
    }

    if (frais.location.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await prisma.frais.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Frais supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du frais' });
  }
});

export default router;
