const mongoose = require('mongoose');
const { TIPO_PUBLICACION } = require('../config/constants');

const PublicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    trim: true,
    required: [true, 'El título es obligatorio']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es obligatorio']
  },
  multimedia: [
    {
      tipo: {
        type: String,
        enum: ['imagen', 'video'],
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }})
  
    module.exports = mongoose.model('Publicacion', PublicacionSchema);