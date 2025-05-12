const express = require('express');
const mongoose = require('mongoose');
const Publicacion = require('../models/Publicacion'); // Asegúrate de ajustar la ruta

const router = express.Router();

router.post('/publicaciones', async (req, res) => {
  try {
    const publicacion = new Publicacion(req.body);
    const saved = await publicacion.save();
    res.status(201).json(saved);
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

// PUT (Actualizar publicación)
router.put('/:id', async (req, res) => {
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

// DELETE (Eliminar publicación)
router.delete('/:id', async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;