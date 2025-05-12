const express = require('express');
const mongoose = require('mongoose');
const Publicacion = require('./models/Publicacion'); 
const router = express.Router();


// Crear una nueva publicación
router.post('/publicaciones', async (req, res) => {
  try {
    const publicacion = new Publicacion(req.body);
    const savedPublicacion = await publicacion.save();
    res.status(201).json(savedPublicacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las publicaciones
router.get('/publicaciones', async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate('autor', 'nombre') // Ajusta el 'nombre' al campo que necesitas
      .exec();
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una publicación por ID
router.get('/publicaciones/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id)
      .populate('autor', 'nombre')
      .exec();
    if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una publicación por ID
router.put('/publicaciones/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una publicación por ID
router.delete('/publicaciones/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;