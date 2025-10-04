import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const locataireSchema = z.object({
  nom: z.string(),
  prenom: z.string(),
  email: z.string().email(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
});

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const locataires = await prisma.locataire.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(locataires);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des locataires' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const locataire = await prisma.locataire.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        locations: {
          include: {
            location: {
              include: {
                bien: true,
              },
            },
          },
        },
      },
    });

    if (!locataire) {
      return res.status(404).json({ error: 'Locataire non trouvé' });
    }

    res.json(locataire);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du locataire' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = locataireSchema.parse(req.body);

    const locataire = await prisma.locataire.create({
      data: {
        ...data,
        userId: req.userId!,
      },
    });

    res.status(201).json(locataire);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la création du locataire' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = locataireSchema.parse(req.body);

    const locataire = await prisma.locataire.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      data,
    });

    if (locataire.count === 0) {
      return res.status(404).json({ error: 'Locataire non trouvé' });
    }

    const updatedLocataire = await prisma.locataire.findUnique({
      where: { id: req.params.id },
    });

    res.json(updatedLocataire);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du locataire' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const locataire = await prisma.locataire.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (locataire.count === 0) {
      return res.status(404).json({ error: 'Locataire non trouvé' });
    }

    res.json({ message: 'Locataire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du locataire' });
  }
});

export default router;
