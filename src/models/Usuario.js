const mongoose = require('mongoose');
const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Proporciona un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
    select: false
  },
  foto_perfil: {
    type: String,
    default: 'default-avatar.jpg'
  },
  biografia: {
    type: String,
    default: '',
    maxlength: 500
  },
  seguidores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  siguiendo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  publicaciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publicacion'
  }],
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  rol: {
    type: String,
    enum: ['usuario', 'moderador', 'admin'],
    default: 'usuario'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultima_conexion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema);