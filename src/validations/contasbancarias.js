const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Conta = require('../models/conta');

module.exports = [
    body('tipoconta')
        .notEmpty()
        .withMessage('O campo tipo de conta é obrigatório.')
        .escape()
        .trim()
        .toUpperCase(),
    /* -------------------------------------------------------------------------------------------------------------------- */
    body('pessoa')
        .notEmpty()
        .withMessage('O campo pessoa é obrigatório.')
        .escape()
        .trim()
        .toUpperCase(),
    /* -------------------------------------------------------------------------------------------------------------------- */
    body('numero')
        .notEmpty()
        .customSanitizer(value => `${value.slice(0, -1)}-${value.slice(-1)}`)
        .withMessage('O campo número é obrigatório.')
        .custom(async (value, { req }) => {
            const codigo_banco = req.body.codigo_banco;

            if (value && codigo_banco) {
                const where = { numero: value, codigo_banco };

                if (req.body.id) {
                    where.id = { [Op.ne]: req.body.id };
                }

                const result = await Conta.findAndCountAll({ where });
                if (result.count > 0) {
                    throw new Error('Número de conta já cadastrado.');
                }
            }

            return true;
        })
        .escape()
        .trim()
        .toUpperCase(),
    /* -------------------------------------------------------------------------------------------------------------------- */
    body('codigo_banco')
        .notEmpty()
        .withMessage('O campo código do banco é obrigatório.')
        .escape()
        .trim()
        .toUpperCase(),
    /* -------------------------------------------------------------------------------------------------------------------- */
    body('nome_banco')
        .notEmpty()
        .withMessage('O campo nome do banco é obrigatório.')
        .escape()
        .trim()
        .toUpperCase(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        else {
            next();
        }
    }
];