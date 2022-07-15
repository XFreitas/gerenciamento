module.exports.index = async function (application, req, res) {
    application.src.libraries.template(res, 'news/teste.ejs', {});
}