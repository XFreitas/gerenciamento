const { body, validationResult } = require('express-validator');

const Registro = require('../models/registro');

module.exports = {
    acao: [
        body('ids')
            .notEmpty()
            .withMessage('O campo ID é obrigatório.')
            .trim()
            .escape()
            .custom(async (value, { req }) => {
                if (value) {
                    const ids = value.split(',');
                    for (let index = 0; index < ids.length; index++) {
                        const id = ids[index];
                        const result = await Registro.findAndCountAll({ where: { id } });
                        if (!result.count) {
                            throw new Error('Registro não encontrado.');
                        }
                    }
                }
                return true;
            }),
        body('acao')
            .notEmpty()
            .withMessage('O campo Ação é obrigatório.')
            .trim()
            .escape()
            .custom(async (value, { req }) => {
                if (value) {
                    if (value == 'atualizar' && !req.body.campo) {
                        throw new Error('O campo Campo é obrigatório.');
                    }
                    if (value == 'atualizar' && req.body.campo == 'categoria' && !req.body.categoria) {
                        throw new Error('O campo Categoria é obrigatório.');
                    }
                }
                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            else {
                next();
            }
        },
    ]
};