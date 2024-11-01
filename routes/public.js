import express from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

// Cadastro dos alunos
router.post('/cadastro', async (req, res) => {
    try {
        const aluno = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(aluno.senha, salt);

        const alunoDB = await prisma.aluno.create({ // Deve ser "aluno" com minúsculo
            data: {
                nomeAluno: aluno.nomeAluno,
                emailAluno: aluno.emailAluno,
                senha: hashSenha,
            },
        });

        res.status(201).json(alunoDB);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: 'Erro no Servidor, tente novamente' });
    }
});

// Login dos Alunos

router.post('/login', async (req, res) => {
    try {
        const alunoInfo = req.body;

        const aluno = await prisma.aluno.findUnique({
            where: { emailAluno: alunoInfo.emailAluno },
        });

        if (!aluno) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(alunoInfo.senha , aluno.senha)

        if(!isMatch){
            return res.status(400).json({ message: 'Email ou Senha incorreta' });
        }

        const token =jwt.sign({id: aluno.id}, JWT_SECRET, {expiresIn: '7 days'})

        res.status(200).json(token);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: 'Erro no Servidor, tente novamente' });
    }
});


export default router;
