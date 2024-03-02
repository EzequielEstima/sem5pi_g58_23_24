import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name'],
      index: true,
    },

    telefone: {
      type: String,
      required: [true, 'Please enter telefone'],
      index: true,
    },

    nif : {
      type: String,
      index: true,
    },

    estado: {
      type: String,
      required: [true, 'Please enter estado'],
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,  
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, 'Please enter password'],
    },

    role: {
      type: String,
      required: [true, 'Please enter role'],
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', User);
