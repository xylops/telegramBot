require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.port || 3000;
// const url = 'https://api.telegram.org/bot';
const token = process.env.TelegramToken;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});