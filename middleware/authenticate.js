const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
    let bearerToken = req.headers['authorization'] || "";

    const bearer = bearerToken.split(" ");

    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
        return res.status(403).json({ status: false, mensagem: "Token inválido" });
    }

    const token = bearer[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, obj) => {
        if (err) {
            return res.status(403).json({ status: false, mensagem: "Não autorizado" });
        }

        req.usuario = obj;
        next();
    });
};
