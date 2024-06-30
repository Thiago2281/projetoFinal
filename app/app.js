import express from 'express';
const app = express()
const port = 3000
import bodyParser from 'body-parser';
import mysql from 'mysql';
import UsuariosSequelizeDao from './lib/projeto/UsuariosSequelizeDao.cjs';
import UsuariosController from './controllers/UsuariosController.mjs';
import AuthController from './controllers/AuthController.mjs';
import cookieParser from 'cookie-parser';
import { OpenAI } from "langchain/llms/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import loader from './loader.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path, {dirname} from 'path';
import * as dotenv from 'dotenv'
dotenv.config()
import multer from 'multer';
import { Parser } from 'json2csv';

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      // Extração da extensão do arquivo original:
      const extensaoArquivo = file.originalname.split('.')[1];
      const uniqueSuffix = file.originalname
      cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

app.use(cookieParser());
/* criar conexão com o bando de dados  */
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'bd', 
  user            : 'root',
  password        : process.env.MARIADB_PASSWORD,
  database        : process.env.MARIADB_DATABASE,
});
export default pool;

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['jwt'];
  return token;
};

import passport from 'passport';
import passportJWT from "passport-jwt";
const JwtStrategy = passportJWT.Strategy;

let opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    return done(null, jwt_payload);
}));

import Sequelize from 'sequelize';

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

/* identificar dados passados na URL */
app.use(bodyParser.urlencoded({ extended: false }))
/* padronizar a pasta public como base para acessar imagens e outros dados */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* usar arquivos ejs como renderização */
app.set('view engine', 'ejs');

app.use('/usuarios', passport.authenticate('jwt', { session: false }), usuariosController.getRouter());

app.get('/sobre', (req, res) => {
  res.render('sobre')
})

app.get('/login', (req, res) => {
  const error = req.query.error;
  req.query.error = error; // Passar o erro como parte da solicitação
  authController.index(req, res); // Chamar o controlador de autenticação
});

app.post('/login', async (req, res) => {
  let token = await authController.logar(req, res);
  res.json(token)
});

app.get('/index', (req, res) => {
  perguntas = [];
  respostas = [];
  res.render('index')
});

app.get('/indexAdmin', (req, res) => {
  res.render('index')
});

app.post('/export-csv', (req, res) => {
  const data = perguntas.map((pergunta, index) => ({
    pergunta: pergunta,
    resposta: respostas[index]
  }));
  const json2csvParser = new Parser({ fields: ['pergunta', 'resposta'] });
  const csv = json2csvParser.parse(data);
  res.attachment('dados.csv');
  res.send(csv);
});


let perguntas = [];
let respostas =[];
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  // Verifica se a pergunta foi enviada corretamente
  if (!question) {
      return res.status(400).json({ error: 'Pergunta não fornecida' });
  }
  // Adiciona a pergunta à lista
  perguntas.push(question);
  console.log(perguntas)

  try {

    const llmA = new OpenAI({ modelName: "gpt-3.5-turbo"});
    const chainA = loadQAStuffChain(llmA);
    const directory = process.env.DIR //diretorio do arquivo .env
    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings()
      );
      
      // const question = "do que se trata o documento?"; //perguntas
      const result = await loadedVectorStore.similaritySearch(question, 1);
      const resA = await chainA.call({
        input_documents: result,
        question,
      });
      respostas.push(resA.text);
      // res.redirect('/indexCompleto');
      res.send(resA)
  } 
  
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
});

app.get('/indexCompleto', (req, res) => {
  if (perguntas.length > 3) {
    passport.authenticate('jwt', { session: false })(req, res, (err) => {
      if (err || !req.user) {
        return res.redirect('/login?error=tooManyQuestions');
      }
      res.render('indexCompleto logado', {perguntas: perguntas, respostas: respostas});
    });
  } else {
  res.render('indexCompleto', {perguntas: perguntas, respostas: respostas})
  }
});

app.get('/indexCompletoLogado', (req, res) => {
  res.render('indexCompleto logado', {perguntas: perguntas, respostas: respostas})
});

app.post('/send', upload.single('fileUpload'), (req, res) => {
  const file = req.file;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (fileExtension !== '.pdf') {
      return res.status(400).send('Envie um arquivo PDF!');
  }

  res.send(`Upload do arquivo: ${file.originalname}`);
});


app.get('/carregar', (req, res) => {
    // Recuperar o parâmetro 'filename' da query string
    const uploadedFileName = req.query.filename;

    // Utilize o nome do arquivo como necessário
    console.log('Uploaded file name:', uploadedFileName);
    loader(uploadedFileName);
    res.send(`Ok`)
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

