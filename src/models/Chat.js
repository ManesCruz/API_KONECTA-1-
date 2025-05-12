const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participantes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    }
  ],
  ultimoMensaje: {
    type: String,
    required: true
  },
  mensajes: [mensajeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
