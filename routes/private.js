import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Endpoint para atualizar o status do checkbox de um livro
router.put('/atualizar-livro/:id', async (req, res) => {
    const { id } = req.params; 
    const { isSelected } = req.body; 


    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {

        const livroAtualizado = await prisma.bookSelection.update({
            where: { id: new ObjectId(id) }, 
            data: { isSelected }, 
        });

        res.status(200).json({ message: 'Livro atualizado com sucesso', livroAtualizado });
    } catch (err) {
        res.status(500).json({ message: 'Falha ao atualizar livro', error: err.message });
    }
});
export default router;