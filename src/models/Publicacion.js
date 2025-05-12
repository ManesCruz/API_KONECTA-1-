const mongoose = require('mongoose');

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
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  facultad: {
    type: String,

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
PublicacionSchema.virtual('contadorMeGusta').get(function() {
  return this.megusta.length;
});

PublicacionSchema.virtual('contadorComentarios').get(function() {
  return this.comentarios.length;
});

// Índices
PublicacionSchema.index({ createdAt: -1 });
PublicacionSchema.index({ autor: 1 });
PublicacionSchema.index({ tipo: 1 });
PublicacionSchema.index({ facultad: 1 });

module.exports = mongoose.model('Publicacion', PublicacionSchema);