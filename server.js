const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Quick Note listening on http://localhost:${PORT}`)
})