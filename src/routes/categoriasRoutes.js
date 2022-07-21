const Categorias = require("../controllers/categoriasController");

const baseUri = function (uri) {
    if (uri) {
        return `/categorias/${uri}`;
    }
    return '/categorias';
};

module.exports = function (application) {
    const categoriasController = new Categorias(application);

    application.get(baseUri(), function (req, res) {
        categoriasController.index(req, res);
    });

    application.get(baseUri('serverprocessing'), function (req, res) {
        categoriasController.serverProcessing(req, res);
    });
};