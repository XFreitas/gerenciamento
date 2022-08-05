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
                const msgArray = [];
                if (value && value == 'atualizar') {
                    if (!req.body.campo) {
                        msgArray.push('O campo Campo é obrigatório.');
                    }
                    if (req.body.campo == 'categoria' && !req.body.categoria) {
                        msgArray.push('O campo Categoria é obrigatório.');
                    }
                    if (req.body.campo == 'divisao' && ['0', '1', 0, 1].indexOf(req.body.divisao) == -1) {
                        msgArray.push('O campo Divisão é obrigatório.');
                    }
                }
                if (msgArray.length > 0) {
                    console.log(`<p>${msgArray.join('</p><p>')}</p>`);
                    throw new Error(`<p>${msgArray.join('</p><p>')}</p>`);
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