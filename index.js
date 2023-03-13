const express = require('express');
const passport = require('passport');
require('./src/utils/authentication/index');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const usersRoutes =  require('./src/api/users/users.routes')
const db = require('./src/utils/database/database');
// const dotenv = require('dotenv');
db.connectDb();
const app = express();
const PORT = process.env.PORT || 6000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//la sesion tiene que ir antes de inicializar passpor y despues de express.json
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 2 *60*60* 1000
    },
    store: MongoStore.create({mongoUrl: db.DB_URL})
    //con esta linea ⤴️, dp de instalar connect-mongo, se crea y gestiona automatic'
    // una coleccion llamada sesion que guarda las sesiones de los users en la BBDD
}))

app.use(passport.initialize());
app.use(passport.session());
// app.use('/', usersRoutes);
app.use('/users', usersRoutes)

app.listen(PORT, () => {
    console.log(`running like BOLT in http://localhost:${PORT}`);
})
