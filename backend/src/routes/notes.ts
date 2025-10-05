import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId! },
      orderBy: [
        { epingle: 'desc' },
        { updatedAt: 'desc' }
      ]
    })
    res.json(notes)
  } catch (error) {
    console.error('Erreur récupération notes:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { titre, contenu, couleur, epingle } = req.body
    
    if (!titre || !contenu) {
      return res.status(400).json({ error: 'Titre et contenu requis' })
    }

    const note = await prisma.note.create({
      data: {
        userId: req.userId!,
        titre,
        contenu,
        couleur: couleur || 'yellow',
        epingle: epingle || false,
      }
    })
    
    res.json(note)
  } catch (error) {
    console.error('Erreur création note:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { titre, contenu, couleur, epingle } = req.body

    const existingNote = await prisma.note.findUnique({
      where: { id }
    })

    if (!existingNote) {
      return res.status(404).json({ error: 'Note non trouvée' })
    }

    if (existingNote.userId !== req.userId!) {
      return res.status(403).json({ error: 'Non autorisé' })
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        titre,
        contenu,
        couleur,
        epingle,
      }
    })
    
    res.json(note)
  } catch (error) {
    console.error('Erreur modification note:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existingNote = await prisma.note.findUnique({
      where: { id }
    })

    if (!existingNote) {
      return res.status(404).json({ error: 'Note non trouvée' })
    }

    if (existingNote.userId !== req.userId!) {
      return res.status(403).json({ error: 'Non autorisé' })
    }

    await prisma.note.delete({
      where: { id }
    })
    
    res.json({ message: 'Note supprimée' })
  } catch (error) {
    console.error('Erreur suppression note:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
