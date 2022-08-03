import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Inf del email
      const info = await transport .sendMail({
          from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
          to: email,
          subject:"Uptaks - comprueba tu cuenta",
          text: "Comprueba tu cuenta en UpTask",
          html: `<p> Hola : ${nombre} Comprueba tu cuenta</p>
          <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace </p>          
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar cuenta </a>

          <p>Si no creaste esta cuenta, puedes ignorar el mensaje </p>
          `

      })
}

export const emailOlvidePassword = async (datos) => {
    const {email, nombre, token} = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Inf del email
      const info = await transport .sendMail({
          from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
          to: email,
          subject:"Uptaks - Reestablece tu password",
          text: "Reestablece tu password",
          html: `<p> Hola : ${nombre} has solicitado reestablecer tu password</p>
          <p> Sigue el siguiente enlace: </p>          
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Reestablecer password </a>

          <p>Si no solicistaste el password, puedes ignorar el mensaje </p>
          `

      })
}