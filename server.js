const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

//Create instance of server
const app = express();

app.use(express.static('public'));
//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Quick Note listening on http://localhost:${PORT}`)
})

const publicRoot = path.join(__dirname, "public");

//GET /notes 
//Return note.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(publicRoot, 'notes.html'));
})

const dbPath = path.join(__dirname, "db/db.json");

///GET /api/notes
//Return all notes from db.json file
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, (err, data) => {
        res.json(JSON.parse(data));
    })
})

let noteID = 1;

//POST /api/notes
//Retreive data from form and assign it an id and then save it to db.json
app.post('/api/notes', (req, res) => {
    let note = req.body;
    note.id = noteID++;

    //Get json from db.json to retrieve the array of notes 
    //and then add the note from the request to the array
    fs.readFile(dbPath, (err, data) => {
        if(err) throw err;

        const notes = JSON.parse(data);
        notes.push(note);

        //Write the modified array as a json object to db.json
        fs.writeFile(dbPath, JSON.stringify(notes), "utf8", (err) => {
            if(err) throw err;

            res.json(note);
        })
    })   
})  

//DELETE /api/notes/:id
//Delete note with the specified id from the request
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    //Get json from db.json to retrieve the array of notes 
    fs.readFile(dbPath, (err, data) => {
        if(err) throw err;

        let notes = JSON.parse(data);
        
        //Find the index of the note with the id from the request
        const deleteIndex = notes.findIndex(note => note.id === noteId)

        if(deleteIndex > -1){
            //Delete the note from the array
            notes.splice(deleteIndex, 1);

            //Write the modified array as a json object to db.json
            fs.writeFile(dbPath, JSON.stringify(notes), "utf8", (err) => {
                if(err) throw err;
    
                res.sendStatus(204);
            })
        }else{
            res.sendStatus(404);
        }     
    })   
})

//GET *
//Send the index.html file for all routes that doesn't match our created routes
app.get('*', (req, res) => {
    res.sendFile(path.join(publicRoot, 'index.html'));
})

