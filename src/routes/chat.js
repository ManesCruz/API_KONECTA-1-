const express = require('express');
const router = express.Router();  
const Chat = require('../models/Chat');

// GET: Obtener todos los chats
router.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find().populate('participantes ultimoMensaje mensajes');
    res.json(chats);
  } catch (err) {
    res.status(500).send(err);
  }
});


// POST: Crear un nuevo chat
router.post('/chat', async (req, res) => {
  try {
    // Extraemos los datos del body
    const { participantes, ultimoMensaje, mensajes } = req.body;

    // Verifica que los participantes sean un array de ObjectIds válidos
    if (!Array.isArray(participantes) || participantes.length < 2) {
      return res.status(400).json({ error: 'Debe haber al menos dos participantes en el chat' });
    }

    // Crea el chat con los datos proporcionados
    const chat = new Chat({
      participantes,
      ultimoMensaje,
      mensajes
    });

    // Guarda el chat en la base de datos
    await chat.save();

    // Responde con el chat creado
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'No se pudo crear el chat' });
  }
});


// PUT: Actualizar un chat
router.put('/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE: Eliminar un chat
router.delete('/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;  // Exporta router
