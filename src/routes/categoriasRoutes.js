const Categorias = require("../controllers/categoriasController");
const validate = require("../validations/categorias");

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

    application.get(baseUri('createupdate'), (req, res) => categoriasController.createupdate(req, res));
    application.post(baseUri('createupdate'), validate.createUpdate, (req, res) => categoriasController.createupdate(req, res));
    application.put(baseUri('createupdate'), validate.createUpdate, (req, res) => categoriasController.createupdate(req, res));
    
    application.delete(baseUri('delete'), validate.delete, (req, res) => categoriasController.delete(req, res));

    application.get(baseUri('serverprocessing'), function (req, res) {
        categoriasController.serverProcessing(req, res);
    });
};