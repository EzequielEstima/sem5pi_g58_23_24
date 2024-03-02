import { IPontoPersistence } from '../../dataschema/IPontoPersistence';
import mongoose from 'mongoose';

const PontoSchema = new mongoose.Schema(
  {
    domainID: { 
      type: Number,
      unique: true
    },

    abscissa: {
      type: Number,
      required: [true, 'Introduz a abscissa'],
      index: true,
    },

    ordenada: {
        type: Number,
        required: [true, 'Introduz a ordenada'],
        index: true,
      },

      tipoPonto: {
      type: String,
      required: [true, 'Introduz o tipo de ponto'],
      index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<IPontoPersistence & mongoose.Document>('Ponto', PontoSchema);