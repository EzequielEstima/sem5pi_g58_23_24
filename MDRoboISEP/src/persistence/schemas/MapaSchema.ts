import { IMapaPersistence } from '../../dataschema/IMapaPersistence';
import mongoose from 'mongoose';

const MapaSchema = new mongoose.Schema(
  {
    idMapa: { 
      type: Number,
      unique: true,
    },

    mapa: {
      type: [[String]],
      index: true,
    },

    idPassagem: {
      type: [Number],
      index: true,
    },

    abcissaSupPassagem: {
      type: [Number],
      index: true,
    },

    ordenadaSupPassagem: {
        type: [Number],
        index: true,
    },

    abcissaInfPassagem: {
        type: [Number],
        index: true,
    },

    ordenadaInfPassagem: {
        type: [Number],
        index: true,
    },
    
    orientacaoPassagem: {
        type: [String],
        index: true,
    },

    xCoordElevador: {
        type: Number,
        index: true,
    },

    yCoordElevador: {
        type: Number,
        index: true,
    },
    orientacaoElevador: {
        type: String,
        index: true,
    },
    nomeSala: {
        type: [String],
        index: true,
    },
    abcissaASala: {
        type: [Number],
        index: true,
    },
    ordenadaASala: {
        type: [Number],
        index: true,
    },
    abcissaBSala: {
        type: [Number],
        index: true,
    },
    ordenadaBSala: {
        type: [Number],
        index: true,
    },
    abcissaPorta: {
        type: [Number],
        index: true,
    },
    ordenadaPorta: {
        type: [Number],
        index: true,
    },
    orientacaoPorta: {
        type: [String],
        index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<IMapaPersistence & mongoose.Document>('Mapa', MapaSchema);