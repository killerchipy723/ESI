const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let votos = { feliz: 0, bien: 0, triste: 0 };

// Página inicial con formulario
app.get('/', (req, res) => {
    res.render('form');
});

app.post('/submit-nick', (req, res) => {
    const nick = req.body.nick;
    const fecha = new Date();

    db.query('INSERT INTO alumnos (nick, fecha) VALUES (?, ?)', [nick, fecha], (err, result) => {
        if (err) throw err;
        res.redirect(`/emojis?nick=${encodeURIComponent(nick)}`);
    });
});

// Página de emojis
app.get('/emojis', (req, res) => {
    const nick = req.query.nick;
    res.render('emojis', { nick });
});

// Recibe voto
app.post('/votar', (req, res) => {
    const { nick, emocion } = req.body;
    const fecha = new Date();

    db.query('INSERT INTO respuestas (nick, emocion, fecha) VALUES (?, ?, ?)', [nick, emocion, fecha], (err, result) => {
        if (err) throw err;
        votos[emocion]++;
        io.emit('update', votos); // Actualiza en tiempo real
        res.redirect('/gracias');
    });
});

// Gracias
app.get('/gracias', (req, res) => {
    res.render('gracias');
});

// Admin
app.get('/admin', (req, res) => {
    res.render('admin', { votos });
});

io.on('connection', socket => {
    socket.emit('update', votos);
});

http.listen(1500, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
