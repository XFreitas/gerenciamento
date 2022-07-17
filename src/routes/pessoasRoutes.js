const Pessoas = require("../controllers/pessoasController");

const baseUri = function (uri) {
    if (uri) {
        return `/pessoas/${uri}`;
    }
    return '/pessoas';
};

module.exports = function (application) {
    const pessoaController = new Pessoas(application);

    application.get(baseUri(), function (req, res) {
        pessoaController.index(req, res);
    });

    application.get(baseUri('inserireditar'), function (req, res) {
        pessoaController.loadmodal(req, res);
    });

    application.post(baseUri('inserireditar'), function (req, res) {
        pessoaController.create(req, res);
    });

    application.put(baseUri('inserireditar'), function (req, res) {
        pessoaController.update(req, res);
    });
}