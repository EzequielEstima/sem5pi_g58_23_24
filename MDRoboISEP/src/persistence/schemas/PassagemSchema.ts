import { IPassagemPersistence } from '../../dataschema/IPassagemPersistence';
import mongoose from 'mongoose';

const PassagemSchema = new mongoose.Schema(
    {
        domainID: {
            type: Number,
            unique: true
        },
        pisoA: {
            type: Number,
            required: [true, 'Introduz o piso A'],
            index: true,
        },
        pisoB: {
            type: Number,
            required: [true, 'Introduz o piso A'],
            index: true,
        },
    },
    {
        timestamps: true,
        collection: 'passagem',
    },
);

export default mongoose.model<IPassagemPersistence & mongoose.Document>('Passagem', PassagemSchema);