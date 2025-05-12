const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { verificarToken } = require('./validar_token');

// Obtener listado de usuarios
router.get('/', verificarToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, buscar = '' } = req.query;
    const query = buscar
      ? {
          $or: [
            { nombre: { $regex: buscar, $options: 'i' } },
            { apellido: { $regex: buscar, $options: 'i' } },
            { email: { $regex: buscar, $options: 'i' } }
          ],
          estado: 'activo'
        }
      : { estado: 'activo' };
    
    const total = await Usuario.countDocuments(query);
    const usuarios = await Usuario.find(query)
      .select('nombre apellido email foto_perfil biografia seguidores siguiendo')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ nombre: 1 });
    
    res.json({
      exito: true,
      paginacion: {
        total,
        pagina: Number(page),
        paginas: Math.ceil(total / limit),
        por_pagina: Number(limit)
      },
      usuarios: usuarios.map(usuario => ({
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        biografia: usuario.biografia,
        seguidores: usuario.seguidores.length,
        siguiendo: usuario.siguiendo.length
      }))
    });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al obtener usuarios', 
      error: error.message 
    });
  }
});

// Obtener un usuario por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .select('-__v')
      .populate('seguidores', 'nombre apellido foto_perfil')
      .populate('siguiendo', 'nombre apellido foto_perfil')
      .populate('publicaciones');
    
    if (!usuario) {
      return res.status(404).json({ 
        exito: false, 
        mensaje: 'Usuario no encontrado' 
      });
    }

    if (usuario.estado !== 'activo' && req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        exito: false, 
        mensaje: 'Usuario no disponible' 
      });
    }
    
    res.json({
      exito: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        biografia: usuario.biografia,
        seguidores: usuario.seguidores,
        siguiendo: usuario.siguiendo,
        publicaciones: usuario.publicaciones,
        estado: usuario.estado,
        fecha_registro: usuario.fecha_registro,
        ultima_conexion: usuario.ultima_conexion,
        rol: req.usuario.rol === 'admin' ? usuario.rol : undefined
      }
    });
    
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al obtener usuario', 
      error: error.message 
    });
  }
});

// Actualizar información de usuario
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        exito: false, 
        mensaje: 'No tienes permiso' 
      });
    }
    
    const { nombre, apellido, biografia } = req.body;
    const camposActualizables = {};
    if (nombre) camposActualizables.nombre = nombre;
    if (apellido) camposActualizables.apellido = apellido;
    if (biografia !== undefined) camposActualizables.biografia = biografia;
    
    if (req.usuario.rol === 'admin') {
      if (req.body.estado) camposActualizables.estado = req.body.estado;
      if (req.body.rol) camposActualizables.rol = req.body.rol;
    }
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: camposActualizables },
      { new: true, runValidators: true }
    ).select('-__v');
  
    if (!usuarioActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
  
    res.json({
      exito: true,
      mensaje: 'Usuario actualizado',
      usuario: {
        id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        apellido: usuarioActualizado.apellido,
        email: usuarioActualizado.email,
        foto_perfil: usuarioActualizado.foto_perfil,
        biografia: usuarioActualizado.biografia,
        estado: usuarioActualizado.estado,
        rol: usuarioActualizado.rol
      }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

module.exports = router;