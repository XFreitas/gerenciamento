module.exports.index = async function (application, req, res) {
    const Produtos = require('../models/produtos');

    const produtos = await Produtos.findAll();

    application.src.libraries.template(res, 'produtos/index', { produtos });
}