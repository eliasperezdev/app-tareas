import { emailOlvidePassword, emailRegistro } from "../helpers/email.js"
import generarId from "../helpers/generarID.js"
import generarJWT from "../helpers/generarJWT.js"
import Usuario from "../models/Usuario.js"

const registrar =  async (req, res) => {
    //Evitar registros duplicados
    const { email } = req.body

    const existeUsuario = await Usuario.findOne({
        email
    })

    if(existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message})
    }
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()

        const usuarioAlmacenado = await usuario.save()
        
        //Enviar email
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })   
         res.json({ msg: "Usuario creado correctamente, Revisa tu email para confirmar"})

    } catch (error) {
        console.log(error);
    }


}

const autenticar = async (req, res) => {
    const { email, password} = req.body
    //comprobar si el usaurio existe
    const usuario = await Usuario.findOne({email})

    if(!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    //comprobar si el usaurio existe esta confirmado
    if(!usuario.confirmado) {
        const error = new Error("La cuenta no fue confirmada")
        return res.status(403).json({msg: error.message})
    }
    //Comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
         
    }
}   

const confirmar = async (req,res) => {
    

    const { token } = req.params
    console.log(req.params);
    const usuarioConfirmar = await Usuario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error("El token no valido")
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado=true
        usuarioConfirmar.token=""
        await usuarioConfirmar.save()
        res.json({msg:"Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body

    //comprobar si el usaurio existe
    const usuario = await Usuario.findOne({email})

    if(!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })   

        res.json({msg: "hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const tokenValido = await Usuario.findOne({token})

    if(tokenValido) {
        res.json({msg: 'Token valido'})
    } else {
        const error = new Error("El token no es valido")
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => { 
    const {token} = req.params
    const {password}= req.body

    const usuario = await Usuario.findOne({token})

    if(usuario) {
        usuario.password = password
        usuario.token =''
        await usuario.save()
        res.json({msg: 'Password modificado '})
    } else {
        const error = new Error("El token no es valido")
        return res.status(404).json({msg: error.message})
    }   
}

const perfil = async (req, res) => { 
    const {usuario } = req
    res.json(usuario)
}

export { 
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}