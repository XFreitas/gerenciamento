console.clear();
const express = require('express');
const bp = require('body-parser')
const consign = require('consign');

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));

consign()
    .include('./src/routes')
    .then('src/libraries')
    .into(app);

app.listen(4000, () => {
    console.log('Server started on port 4000');
});

app.get('*', function (req, res) {
    res.status(404).render('errors/404');
});