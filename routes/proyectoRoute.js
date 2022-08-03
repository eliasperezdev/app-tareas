import express from "express";
import checkAuth from "../middleware/checkAuth.js"
import {     
    obtenerProyectos,
    obtenerProyecto,
    nuevoProyectos,
    editarProyecto,
    eliminarColaborar,
    AgregarColaborador,
    eliminarProyecto,
    buscarColaborador
} from "../controllers/proyectoController.js"


const router = express.Router()

router.get("/", checkAuth, obtenerProyectos)
router.post("/", checkAuth, nuevoProyectos)

router.route("/:id")
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth,eliminarProyecto)

router.post("/colaboradores", checkAuth, buscarColaborador)
router.post("/colaboradores/:id", checkAuth, AgregarColaborador)
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborar)


export default router

