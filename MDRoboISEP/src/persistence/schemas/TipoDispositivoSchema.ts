import { ITipoDispositivoPersistence } from '../../dataschema/ITipoDispositivoPersistence';
import mongoose from 'mongoose';

const TipoDispositivoSchema = new mongoose.Schema(
  {
    idTipoDispositivo: { type: Number, unique: true, index: true},
    tipoTarefa: { type: [String], required: true},
    marca: { type: String, required: true},
    modelo: { type: String, required: true}
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITipoDispositivoPersistence & mongoose.Document>('Tipo de Dispositivo', TipoDispositivoSchema);
