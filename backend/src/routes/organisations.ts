import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const organisationSchema = z.object({
  nom: z.string(),
  description: z.string().optional(),
  adresse: z.string().optional(),
});

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const organisations = await prisma.organisation.findMany({
      where: { userId: req.userId },
      include: {
        biens: {
          select: {
            id: true,
            adresse: true,
            ville: true,
            type: true,
            loyerBase: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(organisations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des organisations' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const organisation = await prisma.organisation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        biens: true,
      },
    });

    if (!organisation) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    res.json(organisation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'organisation' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = organisationSchema.parse(req.body);

    const organisation = await prisma.organisation.create({
      data: {
        ...data,
        userId: req.userId!,
      },
      include: {
        biens: true,
      },
    });

    res.status(201).json(organisation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la création de l\'organisation' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = organisationSchema.parse(req.body);

    const organisation = await prisma.organisation.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      data,
    });

    if (organisation.count === 0) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    const updatedOrganisation = await prisma.organisation.findUnique({
      where: { id: req.params.id },
      include: {
        biens: true,
      },
    });

    res.json(updatedOrganisation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'organisation' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const organisation = await prisma.organisation.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (organisation.count === 0) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    res.json({ message: 'Organisation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'organisation' });
  }
});

router.post('/:id/biens', async (req: AuthRequest, res) => {
  try {
    const { bienIds } = req.body;

    if (!Array.isArray(bienIds)) {
      return res.status(400).json({ error: 'bienIds doit être un tableau' });
    }

    const organisation = await prisma.organisation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!organisation) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    await prisma.bien.updateMany({
      where: {
        id: { in: bienIds },
        userId: req.userId,
      },
      data: {
        organisationId: req.params.id,
      },
    });

    const updatedOrganisation = await prisma.organisation.findUnique({
      where: { id: req.params.id },
      include: {
        biens: true,
      },
    });

    res.json(updatedOrganisation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout des biens à l\'organisation' });
  }
});

router.delete('/:id/biens/:bienId', async (req: AuthRequest, res) => {
  try {
    const organisation = await prisma.organisation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!organisation) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    await prisma.bien.updateMany({
      where: {
        id: req.params.bienId,
        userId: req.userId,
        organisationId: req.params.id,
      },
      data: {
        organisationId: null,
      },
    });

    const updatedOrganisation = await prisma.organisation.findUnique({
      where: { id: req.params.id },
      include: {
        biens: true,
      },
    });

    res.json(updatedOrganisation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du retrait du bien de l\'organisation' });
  }
});

export default router;
