import { IEdificioPersistence } from '../../dataschema/IEdificioPersistence';
import mongoose from 'mongoose';

const EdificioSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, index: true},
    nome: { type: String},
    descricao: { type: String},
    dimensaoX: { type: Number,
      required: [true, 'Introduz a dimensaoX do edificio'],},
    dimensaoY: { type: Number,
      required: [true, 'Introduz a dimensaoY do edificio'],
      },
    piso: { type: [Number]},
    elevador: { type: Number}
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEdificioPersistence & mongoose.Document>('Edificio', EdificioSchema);
