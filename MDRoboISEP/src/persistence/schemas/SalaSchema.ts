import mongoose from 'mongoose';
import { ISalaPersistence } from '../../dataschema/ISalaPersistence';

const SalaSchema = new mongoose.Schema(
    {
        domainID: {
            type: String,
            unique: true
        },
        categoria: {
            type: String,
            required: [true, 'Introduz a categoria'],
            index: true,
        },
        descricao: {
            type: String,
            required: [true, 'Introduz a descricao'],
            index: true,
        },
        piso: {
            type: Number,
            required: [true, 'Introduz o piso'],
            index: true,
        },
        
    },
    {
        timestamps: true,
        collection: 'sala',
    },
);

export default mongoose.model<ISalaPersistence & mongoose.Document>('Sala', SalaSchema);