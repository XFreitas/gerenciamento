const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Pessoa = require('../models/pessoa');

const bodyNome = body('nome')
    .notEmpty()
    .withMessage('O campo nome é obrigatório.');

module.exports = {
    create: [
        bodyNome.custom(async (value, { req }) => {
            if (value) {
                const result = await Pessoa.findAndCountAll({ where: { nome: value.toUpperCase().trim() } });
                if (result.count > 0) {
                    throw new Error('Nome já cadastrado.');
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
        }
    ],
    update: [
        body('id').notEmpty().withMessage('O campo id é obrigatório.'),
        bodyNome.custom(async (value, { req }) => {
            const id = req.body.id;
            if (value && id) {
                const result = await Pessoa.findAndCountAll({ where: { nome: value.toUpperCase().trim(), id: { [Op.ne]: id } } });
                if (result.count > 0) {
                    throw new Error('Nome já cadastrado.');
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
        }
    ]
};