const DivisoesGastos = require("../controllers/divisoesgastosController");


const baseUri = function (uri) {
    if (uri) {
        return `/divisoesgastos/${uri}`;
    }
    return '/divisoesgastos';
};

module.exports = application => {
    const divisoesgastosController = new DivisoesGastos(application);

    application.get(baseUri(), divisoesgastosController.index);
}