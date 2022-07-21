const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Pessoa = require('../models/pessoa');

module.exports = [
    body('nome')
        .notEmpty()
        .withMessage('O campo nome é obrigatório.')
        .trim()
        .escape()
        .toUpperCase()
        .custom(async (value, { req }) => {
            if (value) {
                const where = { nome: value };
                if (req.body.id) {
                    where.id = { [Op.ne]: req.body.id };
                }
                const result = await Pessoa.findAndCountAll({ where });
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
];