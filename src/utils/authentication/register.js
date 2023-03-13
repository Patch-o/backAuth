const LocalStrategy =  require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../../api/users/users.model');
const { validEmail, validPassword } = require('../helpers/validators');
/**
 * estrategia de registro
 * 
 * 1-filtros o condiciones para evitar registros no deseados
 * 
 * a.comprobar que lel usuario existe
 * b.email valido
 * c.contrasenha valida
 * d. si cumple requisitos lo registramos
 */

 const saltRounds = 10;

const registerStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
     async (req,email,password,done)=> {
     try {
        const existingUser =  await User.findOne({email : email.toLowerCase()});

     if (existingUser) {
        const error = new Error('User already exists');
        return done(error, null);
     }

     if(!validEmail(email)) {
        const error =  new Error("E-mail not valid");
        return done( error, null);
     }

     if(!validPassword(password)) {
        const error = new Error("Password not valid... you lil' cunt");
        return done(error, null);
     }

     const encryptedPassword = await bcrypt.hash(password, saltRounds);
     //haseamos la contrase;a haciendo que se fume diez porros y
     //acabe conspiranoyando tanto que genera 10 putos codigos de encriptado

     const user = new User({
         ...req.body,
        email: email,
        password: encryptedPassword,
     });

     const userDB = await user.save();
     userDB.password = "China not number one hihihihi!!! fuk u russian hacker";//borramos la contrrasenha ya que no es seguro mandar passw menos aun encriptadas
     return done(null,userDB);
     } catch (error) {
        return done(error.message)
     }

    });

module.exports = registerStrategy;