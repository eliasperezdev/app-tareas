import express from "express"
import { autenticar, confirmar,perfil, registrar,nuevoPassword, olvidePassword,comprobarToken } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router()

//Creacion, registro y confirmacion de usuarios
router.post("/", registrar)
router.post("/login", autenticar)
router.get("/confirmar/:token", confirmar)
router.post("/olvide-password", olvidePassword)
router.get("/olvide-password/:token", comprobarToken)
router.post("/olvide-password/:token", nuevoPassword)

router.get("/perfil", checkAuth, perfil)

export default router