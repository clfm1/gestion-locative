import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const locationSchema = z.object({
  bienId: z.string(),
  locataireIds: z.array(z.string()),
  dateDebut: z.string(),
  dateFin: z.string().optional(),
  loyerMensuel: z.number(),
  depot: z.number().optional(),
  statut: z.string().default('active'),
});

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const locations = await prisma.location.findMany({
      where: { userId: req.userId },
      include: {
        bien: true,
        locataires: {
          include: {
            locataire: true,
          },
        },
        frais: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des locations' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        bien: true,
        locataires: {
          include: {
            locataire: true,
          },
        },
        frais: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location non trouvée' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la location' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = locationSchema.parse(req.body);

    const location = await prisma.location.create({
      data: {
        bienId: data.bienId,
        dateDebut: new Date(data.dateDebut),
        dateFin: data.dateFin ? new Date(data.dateFin) : null,
        loyerMensuel: data.loyerMensuel,
        depot: data.depot,
        statut: data.statut,
        userId: req.userId!,
        locataires: {
          create: data.locataireIds.map(locataireId => ({
            locataireId,
          })),
        },
      },
      include: {
        bien: true,
        locataires: {
          include: {
            locataire: true,
          },
        },
      },
    });

    res.status(201).json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la création de la location' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = locationSchema.parse(req.body);

    await prisma.locationLocataire.deleteMany({
      where: { locationId: req.params.id },
    });

    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: {
        bienId: data.bienId,
        dateDebut: new Date(data.dateDebut),
        dateFin: data.dateFin ? new Date(data.dateFin) : null,
        loyerMensuel: data.loyerMensuel,
        depot: data.depot,
        statut: data.statut,
        locataires: {
          create: data.locataireIds.map(locataireId => ({
            locataireId,
          })),
        },
      },
      include: {
        bien: true,
        locataires: {
          include: {
            locataire: true,
          },
        },
      },
    });

    res.json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la location' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const location = await prisma.location.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (location.count === 0) {
      return res.status(404).json({ error: 'Location non trouvée' });
    }

    res.json({ message: 'Location supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la location' });
  }
});

export default router;
