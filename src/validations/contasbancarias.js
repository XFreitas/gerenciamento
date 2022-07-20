const { body, validationResult } = require('express-validator');

module.exports = {
    create: [
        body('tipoconta').notEmpty().withMessage('O campo tipo de conta é obrigatório'),
        // body('pessoa').notEmpty(),
        // body('numero').notEmpty(),
        // body('codigo_banco').notEmpty(),
        // body('nome_banco').notEmpty(),
        // body('descricao').notEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            else {
                next();
            }
        }
    ]
};