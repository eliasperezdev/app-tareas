import mongoose from "mongoose";
import bcrypt from "bcrypt"

const ProyectoSchma = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    fechaEntrega: {
        type: Date,
        default: Date.now()
    },
    cliente: {
        type: String,
        required: true,
        trim: true
    },
    creador:  {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    tareas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tarea"
    }],
    colobadores: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Usuario"
        }, 
    ]
}, {
    timestamps: true
});


const Proyecto = mongoose.model("Proyecto", ProyectoSchma)

export default Proyecto