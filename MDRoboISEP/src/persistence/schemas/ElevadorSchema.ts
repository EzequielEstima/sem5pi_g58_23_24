import { IElevadorPersistence } from '../../dataschema/IElevadorPersistence';
import mongoose from 'mongoose';

const ElevadorSchema = new mongoose.Schema(
    {
        domainId: {
            type: Number,
            unique: true
        },

        pisosServidos: {
            type: [Number],
            required: true
        },

        marca: {
            type: String,
        },
        
        modelo: {
            type: String,
        },
        
        numeroSerie: {
            type: String,
        },

        descricao: {
            type: String,
        }
    },
    {
        timestamps: true
    },
);

export default mongoose.model<IElevadorPersistence & mongoose.Document>('Elevador',ElevadorSchema)

