const { body, validationResult } = require('express-validator');
const Conta = require('../models/conta');

module.exports = {
    create: [
        body('tipoconta').notEmpty().withMessage('O campo tipo de conta é obrigatório.'),
        body('pessoa').notEmpty().withMessage('O campo pessoa é obrigatório.'),
        body('numero')
            .notEmpty().withMessage('O campo número é obrigatório.')
            .custom(async (value, { req }) => {
                const codigo_banco = req.body.codigo_banco;

                if (value && codigo_banco) {
                    const result = await Conta.findAndCountAll({ where: { numero: value, codigo_banco } });

                    if (result.count > 0) {
                        throw new Error('Número de conta já cadastrado.');
                    }
                }

                return true;
            }),
        body('codigo_banco').notEmpty().withMessage('O campo código do banco é obrigatório.'),
        body('nome_banco').notEmpty().withMessage('O campo nome do banco é obrigatório.'),
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