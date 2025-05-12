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
  },
  facultad: {
    type: String,
    required: function () {
      return this.tipo === TIPO_PUBLICACION.NOTICIA;
    }
  },
  tipo: {
    type: String,
    enum: Object.values(TIPO_PUBLICACION),
    default: TIPO_PUBLICACION.NORMAL
  },
  megusta: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ],
  comentarios: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
      },
      texto: {
        type: String,
        required: true
      },
      fecha: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
PublicacionSchema.virtual('contadorMeGusta').get(function () {
  return this.megusta.length;
});

PublicacionSchema.virtual('contadorComentarios').get(function () {
  return this.comentarios.length;
});

// Índices
PublicacionSchema.index({ createdAt: -1 });
PublicacionSchema.index({ autor: 1 });

module.exports = mongoose.model('Publicacion', PublicacionSchema);