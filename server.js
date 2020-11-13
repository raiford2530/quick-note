const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Quick Note listening on http://localhost:${PORT}`)
})

const publicRoot = path.join(__dirname, "public");

//VIEW ROUTES
app.get('/notes', (req, res) => {
    res.sendFile(path.join(publicRoot, 'notes.html'));
})

//API ROUTES
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
        res.json(JSON.parse(data));
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(publicRoot, 'index.html'));
})

