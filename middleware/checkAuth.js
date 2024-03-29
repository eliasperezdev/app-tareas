import jsonwebtoken from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
                token = req.headers.authorization.split(' ')[1]

                const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        
                req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt")


            } catch (error) {
            return res.status(404).json({msg: "hubo un error"})
        }
    
        return next()
    }  
    if(!token ) {
        const error = new Error("Token no valido")
        return res.status(404).json({msg: error.message})
   
    }
}

export default checkAuth