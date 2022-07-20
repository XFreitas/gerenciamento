console.clear();
const express = require('express');
const consign = require('consign');

const app = express();
app.use(express.json());
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