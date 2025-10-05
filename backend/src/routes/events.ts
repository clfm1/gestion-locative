import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query
    
    let events
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1)
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59)
      
      events = await prisma.event.findMany({
        where: {
          userId: authReq.userId!,
          dateDebut: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { dateDebut: 'asc' }
      })
    } else {
      events = await prisma.event.findMany({
        where: { userId: req.userId! },
        orderBy: { dateDebut: 'asc' }
      })
    }
    
    res.json(events)
  } catch (error) {
    console.error('Erreur récupération événements:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { titre, description, dateDebut, dateFin, type, couleur, rappel } = req.body
    
    if (!titre || !dateDebut) {
      return res.status(400).json({ error: 'Titre et date de début requis' })
    }

    const event = await prisma.event.create({
      data: {
        userId: req.userId!,
        titre,
        description,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        type: type || 'general',
        couleur: couleur || 'blue',
        rappel: rappel || false,
      }
    })
    
    res.json(event)
  } catch (error) {
    console.error('Erreur création événement:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { titre, description, dateDebut, dateFin, type, couleur, rappel } = req.body

    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' })
    }

    if (existingEvent.userId !== req.userId!) {
      return res.status(403).json({ error: 'Non autorisé' })
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        titre,
        description,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin: dateFin ? new Date(dateFin) : null,
        type,
        couleur,
        rappel,
      }
    })
    
    res.json(event)
  } catch (error) {
    console.error('Erreur modification événement:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' })
    }

    if (existingEvent.userId !== req.userId!) {
      return res.status(403).json({ error: 'Non autorisé' })
    }

    await prisma.event.delete({
      where: { id }
    })
    
    res.json({ message: 'Événement supprimé' })
  } catch (error) {
    console.error('Erreur suppression événement:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
