const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  remitente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  contenido: {
    type: String,
    required: [true, 'El contenido del mensaje es obligatorio']
  },
  archivos: [
    {
      tipo: {
        type: String,
        enum: ['imagen', 'documento', 'audio'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      nombre: {
        type: String,
        required: true
      }
    }
  ],
  leido: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
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
});

// Índices para mejorar el rendimiento
MensajeSchema.index({ chat: 1, createdAt: -1 });
MensajeSchema.index({ remitente: 1 });
// Middleware para actualizar el último mensaje en el chat
MensajeSchema.post('save', async function() {
  try {
    await this.model('Chat').findByIdAndUpdate(
      this.chat,
      { 
        ultimoMensaje: this._id,
        updatedAt: Date.now()
      }
    );
  } catch (err) {
    console.error('Error al actualizar el último mensaje del chat:', err);
  }
});


module.exports = mongoose.model('Mensaje', MensajeSchema);