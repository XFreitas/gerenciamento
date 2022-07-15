const { default: axios } = require('axios');
const ContasBancarias = require('../controllers/contasbancarias');

const baseUri = function (uri) {
    if (uri) {
        return `/contasbancarias/${uri}`;
    }
    return '/contasbancarias';
};

module.exports = function (application) {
    const contasBancariasController = new ContasBancarias(application);

    application.get(baseUri(), function (req, res) {
        contasBancariasController.index(req, res);
    });

    application.get(baseUri('create'), function (req, res) {
        contasBancariasController.create(req, res);
    });
}