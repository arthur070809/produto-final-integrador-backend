const express = require('express');
const routes = express.Router();
const db = require('../db');

routes.post('/gerarvoltas', (req,res) => {
    const numeroDeVoltas = 2;

    db.query('SELECT * FROM corredores', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Erro ao buscar corredores'});
        }
        if (results.length === 0) {
            res.status(404).json({error: 'Nenhuma corredor encontrado'})
        }
    })
});