import { IDispositivoPersistence } from '../../dataschema/IDispositivoPersistence';
import mongoose from 'mongoose';

const DispositivoSchema = new mongoose.Schema(
  {
    codigo: { 
      type: String,
      unique: true,
    },

    descricaoDispositivo: {
      type: String,
      index: true,
    },

    estado: {
      type: Boolean,
      index: true,
      required: [true, 'Introduz o estado'],
    },

    nickname: {
      type: String,
      required: [true, 'Introduz o nickname'],
      index: true,
      unique: true,
    },

    numeroSerie: {
        type: String,
        required: [true, 'Introduz o numero de serie'],
        index: true,
    },
    
    tipoDeDispositivo: {
        type: Number,
        required: [true, 'Introduz o Tipo de Dispositivo'],
        index: true,
    },
  

  },
  { timestamps: true },
);

export default mongoose.model<IDispositivoPersistence & mongoose.Document>('Dispositivo', DispositivoSchema);