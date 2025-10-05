import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const bienSchema = z.object({
  adresse: z.string(),
  ville: z.string(),
  codePostal: z.string(),
  type: z.string(),
  superficie: z.number().optional(),
  nbChambres: z.number().int().optional(),
  loyerBase: z.number(),
  charges: z.number().optional(),
  description: z.string().optional(),
  photos: z.string().optional(),
  organisationId: z.string().optional(),
});

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const biens = await prisma.bien.findMany({
      where: { userId: req.userId },
      include: {
        organisation: {
          select: {
            id: true,
            nom: true,
          },
        },
        locations: {
          where: {
            statut: 'active',
          },
          include: {
            locataires: {
              include: {
                locataire: {
                  select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to flatten locataires
    const biensWithLocataires = biens.map(bien => ({
      ...bien,
      locataires: bien.locations.flatMap(location => 
        location.locataires.map(ll => ll.locataire)
      ),
      locations: undefined, // Remove locations from response
    }));

    res.json(biensWithLocataires);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des biens' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const bien = await prisma.bien.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        locations: {
          include: {
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
    });

    if (!bien) {
      return res.status(404).json({ error: 'Bien non trouvé' });
    }

    res.json(bien);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du bien' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = bienSchema.parse(req.body);

    const bien = await prisma.bien.create({
      data: {
        ...data,
        userId: req.userId!,
      },
    });

    res.status(201).json(bien);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la création du bien' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = bienSchema.parse(req.body);

    const bien = await prisma.bien.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      data,
    });

    if (bien.count === 0) {
      return res.status(404).json({ error: 'Bien non trouvé' });
    }

    const updatedBien = await prisma.bien.findUnique({
      where: { id: req.params.id },
    });

    res.json(updatedBien);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du bien' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const bien = await prisma.bien.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (bien.count === 0) {
      return res.status(404).json({ error: 'Bien non trouvé' });
    }

    res.json({ message: 'Bien supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du bien' });
  }
});

// Get locataires for a bien
router.get('/:id/locataires', async (req: AuthRequest, res: Response) => {
  try {
    const bien = await prisma.bien.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        locations: {
          where: {
            statut: 'active',
          },
          include: {
            locataires: {
              include: {
                locataire: true,
              },
            },
          },
        },
      },
    });

    if (!bien) {
      return res.status(404).json({ error: 'Bien non trouvé' });
    }

    // Extract unique locataires from active locations
    const locataires = bien.locations.flatMap(location => 
      location.locataires.map(ll => ll.locataire)
    );

    // Remove duplicates
    const uniqueLocataires = Array.from(
      new Map(locataires.map(l => [l.id, l])).values()
    );

    res.json(uniqueLocataires);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des locataires' });
  }
});

// Associate locataires to a bien (create a new location)
router.post('/:id/locataires', async (req: AuthRequest, res: Response) => {
  try {
    const { locataireIds, dateDebut, dateFin, loyerMensuel, depot } = req.body;

    if (!locataireIds || !Array.isArray(locataireIds) || locataireIds.length === 0) {
      return res.status(400).json({ error: 'locataireIds requis et doit être un tableau non vide' });
    }

    const bien = await prisma.bien.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!bien) {
      return res.status(404).json({ error: 'Bien non trouvé' });
    }

    // Verify all locataires belong to the user
    const locataires = await prisma.locataire.findMany({
      where: {
        id: { in: locataireIds },
        userId: req.userId,
      },
    });

    if (locataires.length !== locataireIds.length) {
      return res.status(400).json({ error: 'Un ou plusieurs locataires invalides' });
    }

    // Create a new location
    const location = await prisma.location.create({
      data: {
        userId: req.userId!,
        bienId: req.params.id,
        dateDebut: dateDebut ? new Date(dateDebut) : new Date(),
        dateFin: dateFin ? new Date(dateFin) : null,
        loyerMensuel: loyerMensuel || bien.loyerBase,
        depot: depot || 0,
        statut: 'active',
        locataires: {
          create: locataireIds.map((locataireId: string) => ({
            locataireId,
          })),
        },
      },
      include: {
        locataires: {
          include: {
            locataire: true,
          },
        },
      },
    });

    res.status(201).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'association des locataires' });
  }
});

// Remove a locataire from a bien (terminate location)
router.delete('/:id/locataires/:locataireId', async (req: AuthRequest, res: Response) => {
  try {
    const { id: bienId, locataireId } = req.params;

    // Find active locations for this bien and locataire
    const locations = await prisma.location.findMany({
      where: {
        bienId,
        userId: req.userId,
        statut: 'active',
        locataires: {
          some: {
            locataireId,
          },
        },
      },
      include: {
        locataires: true,
      },
    });

    if (locations.length === 0) {
      return res.status(404).json({ error: 'Association non trouvée' });
    }

    // For each location, if this is the only locataire, terminate the location
    // Otherwise, just remove the locataire from the location
    for (const location of locations) {
      if (location.locataires.length === 1) {
        // Terminate the location
        await prisma.location.update({
          where: { id: location.id },
          data: {
            statut: 'terminée',
            dateFin: new Date(),
          },
        });
      } else {
        // Just remove this locataire
        await prisma.locationLocataire.deleteMany({
          where: {
            locationId: location.id,
            locataireId,
          },
        });
      }
    }

    res.json({ message: 'Locataire retiré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du retrait du locataire' });
  }
});

export default router;
