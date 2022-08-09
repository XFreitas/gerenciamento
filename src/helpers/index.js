module.exports.template = function (application, res, view, data) {
    application.src.libraries.template(res, view, data);
};

module.exports.isEmpty = value => (typeof value === 'undefined'
    || value === null
    || value.trim() === ''
    || value.length === 0
    || Object.keys(value).length === 0);

const removeVirgulaPonto = (valor) => {
    if (typeof valor === 'undefined') {
        return '';
    }

    // 0 000,00 => 0000.00
    valor = valor.replace(/\s/g, '');

    // 0.000.000,00 => 0000000.00
    if ((valor.indexOf(',') > -1) && (valor.indexOf('.') > -1)) {
        valor = valor.replace(/\./g, '');
        valor = valor.replace(/,/g, '.');
    }

    // 0,00 => 0.00
    if (valor.indexOf(',') > -1) {
        valor = valor.replace(/,/g, '.');
    }

    return valor;
}


module.exports.removeVirgulaPonto = removeVirgulaPonto;

module.exports.nArredonda = (numero, casasDecimais, formatar) => {
    if (typeof numero === 'undefined' || numero === null) {
        return 0;
    }

    if (typeof casasDecimais === 'undefined') {
        casasDecimais = 2;
    }

    if (typeof formatar === 'undefined') {
        formatar = false;
    }

    let aux = removeVirgulaPonto(numero.toString());

    let x = aux.split('.');

    let decimais = '';

    if (x[1]) {
        decimais = x[1].substring(0, casasDecimais);
    }

    decimais = (decimais + '0'.repeat(casasDecimais)).substring(0, casasDecimais);

    let n = x[0];

    if (formatar) {
        let negativo = n < 0;

        if (negativo) {
            n = n.substring(1);
        }

        let i = n.length;
        let newN = '';
        let j = 0;
        while (i--) {
            j++;
            newN = n[i] + newN;

            if (j == 3 && i > 0) {
                newN = '.' + newN;
                j = 0;
            }
        }

        if (negativo) {
            newN = '-' + newN;
        }

        return newN + ',' + decimais;
    }

    return parseFloat(n + '.' + decimais);
}