import express from "express"
import dotenv from 'dotenv'
import conectarDB from "./config/db.js"
import usuarioRoute from "./routes/usuarioRoute.js"
import proyectoRouter from "./routes/proyectoRoute.js"
import tareaRouter from "./routes/tareaRoute.js"
import cors from 'cors'
import { Server } from 'socket.io'
const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

//Configurar cors
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)) {
            //Puede consultar la api
            callback(null, true)
        } else {
            //No esta permitido
            callback(new Error("Error de cors"))
        }
    }
}

app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios', usuarioRoute)
app.use('/api/proyectos', proyectoRouter)
app.use('/api/tareas', tareaRouter)


const PORT = process.env.PORT || 4000
const servidor = app.listen(PORT,  ()=> {
    console.log(`Servidor corriendo en ${PORT}`);
})

//socket.io
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,

    }
})

io.on('connection', socket => {
    console.log("Conectado a socket.io");

    //Definir eventos de socket io
    socket.on("Abrir proyecto", (proyectoId)=> {
        socket.join(proyectoId)
    })

    socket.on("nueva tarea", (tarea)=> {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })    
    socket.on("eliminar tarea", (tarea)=> {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on("editar tarea", (tarea)=> {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea editada', tarea)
    })

    socket.on("completar tarea", (tarea)=> {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea completada', tarea)
    })

    socket.emit()
})