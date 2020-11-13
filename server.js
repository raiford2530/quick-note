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

const dbPath = path.join(__dirname, "db/db.json");

//API ROUTES
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, (err, data) => {
        res.json(JSON.parse(data));
    })
})

app.post('/api/notes', (req, res) => {
    const note = req.body;

    fs.readFile(dbPath, (err, data) => {
        if(err) throw err;

        const notes = JSON.parse(data);
        notes.push(note);

        fs.writeFile(dbPath, JSON.stringify(notes), "utf8", (err) => {
            if(err) throw err;
        })
    })

    res.json(note);
})  

app.get('*', (req, res) => {
    res.sendFile(path.join(publicRoot, 'index.html'));
})

