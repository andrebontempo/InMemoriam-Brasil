const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const routes = require('./app/routes');

// Configurações do Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'app/views/partials'),
    layoutsDir: path.join(__dirname, 'app/views/layouts'),
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'app/views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', routes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
