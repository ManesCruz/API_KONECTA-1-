const express = require('express');
const mongoose = require('mongoose');
const Chat = require('./models/Chat'); // Asegúrate de que el path sea correcto
const app = express();

app.use(express.json());

// GET: Obtener todos los chats
app.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find().populate('participantes ultimoMensaje mensajes');
    res.json(chats);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST: Crear un nuevo chat
app.post('/chats', async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

// PUT: Actualizar un chat
app.put('/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE: Eliminar un chat
app.delete('/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Conectar a MongoDB y arrancar el servidor
mongoose.connect('mongodb://localhost:27017/tu_basededatos', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000')))
  .catch(err => console.error(err));