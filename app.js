const express = require('express');
const app = express();

app.use(express.static('C:/temp/Erick/backend-integrador/frontend'));
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));
const userRoutes = require('./routes/users');
//const userRoutes = require('./routes/corredores');
//const userRoutes = require('./routes/voltas');
app.use('/usuarios', userRoutes);
//app.use('/corredores', userRoutes);
//app.use('/voltas', userRoutes);
const geradorRoutes = require('./routes/gerador');
app.use('/gerador', geradorRoutes);

module.exports = app;