require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books-routes');
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use(cors({
    credentials: true,
}));
app.use('/api', booksRoutes);

const start = async () => {
    try {
        mongoose
            .connect(process.env.BD_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log('Connected to DB'))
            .catch((error) => console.log(`Connection error: ${error}`));
        app.listen(PORT, (error) => {
            error ? console.log(error) : console.log(`Server opened in PORT: ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();