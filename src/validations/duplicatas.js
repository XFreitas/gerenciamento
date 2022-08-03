const { body, validationResult } = require('express-validator');
const { Op } = require("sequelize");
const Categoria = require("../models/categoria");
const Registro = require("../models/registro");

module.exports = {
    createUpdate: [
        body('categoria')
            .notEmpty()
            .withMessage('O campo categoria é obrigatório.'),
        body('conta')
            .notEmpty()
            .withMessage('O campo conta é obrigatório.'),
        body('data')
            .notEmpty()
            .withMessage('O campo data é obrigatório.')
            .customSanitizer(value => {
                if (!value) return value;
                const date = value.split('/');
                return `${date[2]}-${date[1]}-${date[0]}`;
            })
            .isDate()
            .withMessage('O campo data deve conter uma data válida.'),
        body('valor')
            .notEmpty()
            .withMessage('O campo valor é obrigatório.')
            .trim()
            .escape()
            .toUpperCase()
            .customSanitizer(value => {
                return value.slice(0, -2) + '.' + value.slice(-2);
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
    delete: [
        body('id')
            .notEmpty()
            .withMessage('O campo ID é obrigatório.')
            .trim()
            .escape()
            .custom(async (value, { req }) => {
                if (value) {
                    const result = await Categoria.findAndCountAll({ where: { id: value } });
                    if (!result.count) {
                        throw new Error('Categoria não encontrada.');
                    }
                    const registros = await Registro.findAndCountAll({ where: { id: value } });
                    if (registros.count > 0) {
                        throw new Error('Categoria possui registros associados.');
                    }
                    const categoriaFilha = await Categoria.findAndCountAll({ where: { categoria: value } });
                    if (categoriaFilha.count > 0) {
                        throw new Error('Categoria possui subcategorias.');
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