const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participantes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    }
  ],
  esGrupal: {
    type: Boolean,
    default: false
  },
  nombreGrupo: {
    type: String,
    trim: true,
    required: function() {
      return this.esGrupal === true;
    }
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: function() {
      return this.esGrupal === true;
    }
  },
  ultimoMensaje: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mensaje'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para cargar los mensajes relacionados con este chat
ChatSchema.virtual('mensajes', {
  ref: 'Mensaje',
  localField: '_id',
  foreignField: 'chat'
});

// Middleware pre-find para ordenar chats por el último mensaje
ChatSchema.pre('find', function() {
  this.sort({ 'updatedAt': -1 });
});

module.exports = mongoose.model('Chat', ChatSchema);