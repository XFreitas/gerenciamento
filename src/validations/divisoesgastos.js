const { body, validationResult } = require('express-validator');
const moment = require('moment');

module.exports = [
    body('data_inicio')
        .notEmpty()
        .withMessage('O campo Início é obrigatório.')
        .trim()
        .toUpperCase()
        .customSanitizer(value => moment(value, "DD/MM/YYYY").format("YYYY-MM-DD"))
        .isISO8601()
        .withMessage('O campo Início deve ser uma data válida.')
        .escape(),
    body('data_fim')
        .notEmpty()
        .withMessage('O campo Fim é obrigatório.')
        .trim()
        .toUpperCase()
        .customSanitizer(value => moment(value, "DD/MM/YYYY").format("YYYY-MM-DD"))
        .isISO8601()
        .withMessage('O campo Fim deve ser uma data válida.')
        .custom((value, { req }) => {
            if (moment(value).isAfter(moment(req.body?.data_inicio)) == false) {
                throw new Error('O campo Fim deve ser uma data posterior a Início.');
            }

            return true;
        })
        .escape(),
    body(`pessoas`)
        .notEmpty()
        .withMessage('O campo Pessoas é obrigatório.')
        .custom((value, { req }) => {
            if (value && value.length < 2) {
                throw new Error('É necessário selecionar pelo menos 2 pessoas.');
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