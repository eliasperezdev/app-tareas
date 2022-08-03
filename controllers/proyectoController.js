import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req,res) => {
    const proyectos = await Proyecto.find({'$or': [
        {'colobadores': {$in: req.usuario}},
        {'creador': {$in: req.usuario}}
    ]}).select("-tareas")

    res.json(proyectos)
}

const obtenerProyecto = async (req,res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)
        .populate({path: "tareas", populate: {path: "completado", select:"nombre"}})
        .populate("colobadores", 'nombre email')

    if(!proyecto) {
        const error = new Error("No encontrado")
        return res.status(404).json({ msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colobadores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Acción no valida")
        return res.status(401).json({ msg: error.message})
    }

    res.json(
        proyecto
    )
}


const nuevoProyectos = async (req,res) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const editarProyecto = async (req,res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    if(!proyecto) {
        const error = new Error("No encontrado")
        return res.status(404).json({ msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no valida")
        return res.status(401).json({ msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)  
    } catch (error) {
        console.log(error);
    } 
}

const eliminarProyecto = async (req,res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    if(!proyecto) {
        const error = new Error("No encontrado")
        return res.status(404).json({ msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no valida")
        return res.status(401).json({ msg: error.message})
    }

    try {
        await proyecto.deleteOne()
        res.json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.log(error);
    }
}

const buscarColaborador = async (req,res) => {
    const {email } = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v' )

    if(!usuario) {
        const error = Error("Usuario no encontrado")
        return res.status(404).json({msg: error.message})
    }

    res.json(usuario)
}

const AgregarColaborador = async (req,res) => {
    const proyecto = await Proyecto.findById(req.params.id);
    console.log(proyecto);

    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no valida")
        return res.status(404).json({msg: error.message})
    }

    const {email } = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v' )

    if(!usuario) {
        const error = Error("Usuario no encontrado")
        return res.status(404).json({msg: error.message})
    }

    //El colaborador no es el admin cel proyoecto

    if(proyecto.creador.toString() === usuario._id.toString()) {
        const error = Error("El creador del proyecto no puede ser colaborador")
        return res.status(404).json({msg: error.message})
    }

    //Revisar qye no este ya agregado al proyecto

    if(proyecto.colobadores.includes(usuario._id)){
        const error = Error("El usuario ya pertenece al proyecto")
        return res.status(404).json({msg: error.message})
    }

    //si todo esta bien, se puede agregar
    proyecto.colobadores.push(usuario._id) 
    await proyecto.save()
    res.json({msg: "Colaborador agregado correctamente"})
}

const eliminarColaborar = async (req,res) => {

    console.log(req.body);

    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no valida")
        return res.status(404).json({msg: error.message})
    }


    //si todo esta bien, se puede eliminar
    proyecto.colobadores.pull(req.body.id) 
    await proyecto.save()
    res.json({msg: "Colaborador se ha eliminado correctamente"})
}

export {
    obtenerProyectos,
    nuevoProyectos,
    editarProyecto,
    eliminarColaborar,
    AgregarColaborador,
    eliminarProyecto,
    obtenerProyecto,
    buscarColaborador
}