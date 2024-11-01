import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => { // Corrigido o parêntese aqui
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
    
        req.alunoId = decoded.id
    
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }


    next(); 
};

export default auth
