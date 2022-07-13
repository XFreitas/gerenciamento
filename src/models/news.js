var fs = require('fs');

module.exports = class NewsModel {
    getLastNews() {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/noticias.json', 'utf8', function (err, result) {
                var data = [];

                if (!err) {
                    var obj = JSON.parse(result);

                    if (obj.noticias.length > 4) {
                        var i = 4;
                    } else {
                        var i = (obj.noticias.length - 1);
                    }

                    obj.noticias.forEach(function (noticia) {
                        if (i >= 0) {
                            data[i] = noticia;
                            i--;
                        }
                    });

                    resolve(data);
                }

                reject(err);
            });
        });
    }
}