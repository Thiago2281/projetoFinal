const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const mysql = require('mysql');
const UsuariosSequelizeDao = require('./lib/projeto/UsuariosSequelizeDao');
const UsuariosController = require('./controllers/UsuariosController');
const EventosController = require('./controllers/EventosController');
const AuthController = require('./controllers/AuthController');
const EventosSequelizeDao = require('./lib/projeto/EventosSequelizeDao');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
/* criar conexão com o bando de dados  */
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bd', 
  user            : 'root',
  password        : process.env.MARIADB_PASSWORD,
  database        : process.env.MARIADB_DATABASE,
});
module.exports = pool;

var cookieExtractor = function(req) {
  console.log(req.cookies);
  var token = null;
  if (req && req.cookies) token = req.cookies['jwt'];
  return token;
};

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt', jwt_payload);
    return done(null, jwt_payload);
}));

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.MARIADB_DATABASE,
    'root',
    process.env.MARIADB_PASSWORD,
    {
        host: 'bd',
        dialect: 'mysql'
    }
);

let usuariosDao = new UsuariosSequelizeDao(sequelize);
let usuariosController = new UsuariosController(usuariosDao);
let authController = new AuthController(usuariosDao);
let eventosDao = new EventosSequelizeDao(sequelize);
let eventosController = new EventosController(eventosDao);


/* identificar dados passados na URL */
app.use(bodyParser.urlencoded({ extended: false }))
/* padronizar a pasta public como base para acessar imagens e outros dados */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/* usar arquivos ejs como renderização */
app.set('view engine', 'ejs');

app.use('/usuarios', usuariosController.getRouter());

app.use('/eventos', eventosController.getRouter());

app.get('/sobre', (req, res) => {
  res.render('sobre')
})


app.get('/perfil', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({'usuario': req.user});
});



app.get('/login', (req, res) => {
  authController.index(req, res);
});

app.post('/login', async (req, res) => {
  let token = await authController.logar(req, res);
  res.json(token)
});

/* middleware para lidar com rotas não definidas */
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});


/* middleware para lidar com erros  */
app.use((req, res) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado');
});
app.get('*', (req, res, next) => {
  res.status(404).send('Nao encontrado')
});

app.use(function (err, req, res, next) {
  console.error('registrando erro: ', err.stack)
  res.status(500).send('Erro no servidor: ' + err.message);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

