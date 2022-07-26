module.exports.template = function (application, res, view, data) {
    application.src.libraries.template(res, view, data);
};

module.exports.isEmpty = value => (typeof value === 'undefined'
    || value === null
    || value.trim() === ''
    || value.length === 0
    || Object.keys(value).length === 0);