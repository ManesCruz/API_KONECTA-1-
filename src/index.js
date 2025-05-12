const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 4000;

// Middlewares
app.use(express.json()); // ya hace lo que body-parser hacía
app.use(express.urlencoded({ extended: false }));

// Rutas
const usuarioRoutes = require('./routes/usuario');
const publicacionesRoutes = require('./routes/publicacion');
const chatsRoutes = require('./routes/chat');
const authRoutes = require('./routes/autenticacion');

app.use(express.json()); 
app.use('/api/usuarios', usuarioRoutes);
app.use('/', publicacionesRoutes);
app.use('/', chatsRoutes);
app.use('/api/auth', authRoutes); 
//Conexión a la base de datos
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log(error));
//Conexión al puerto
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

