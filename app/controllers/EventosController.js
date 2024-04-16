const Evento = require('./../lib/projeto/Evento');
const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');
const passport = require('passport');

class EventosController {
    constructor(eventosDao) {
        this.eventosDao = eventosDao;      
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', async (req, res) => {
            this.listar(req, res);
            let eventos = await this.listar(req,res);
            if (req.headers.accept === 'application/json') {
                res.json(eventos);
            } else {
                res.render('eventos', {eventos: eventos});
            } 

        });

        rotas.get('/admin', passport.authenticate('jwt', { session: false }), async (req, res) => {
            this.listar(req, res);
            console.log(req.headers);
            let eventos = await this.listar(req,res);
            
            // res.render('adminEventos', {eventos: eventos});       
            res.render('adminVue') 
        });

        rotas.get('/:id', async (req, res) => {
            let evento = await Evento.findOne({
                raw: true,
                where: {
                id: req.params.id,
                },   
            });
            if (req.headers.accept === 'application/json') {
                res.json(evento);
            } else {
                res.render('evento', {evento: evento});
            } 
        });

        rotas.delete('/:id', (req, res) => {
            this.apagar(req, res);
        })

        rotas.get('/cadastro', (req, res) => {
            res.render('cadastroEventos',{evento:{}})
        })

        rotas.post('/cadastro', async (req, res) => {
            this.inserir(req, res);
         
        })

        rotas.get('/edicao', async (req, res) => {
            this.listar(req, res);
            let eventos = await this.listar(req,res);
            res.render('edicaoEventos',{eventos:eventos})
        })

        rotas.get('/cadastro/:id', async (req, res) => {
            let id = req.params.id;
            let evento= await this.getUser(id);
            res.render('cadastroEventos',{evento:evento})
        })

        rotas.put('/cadastro/:id', (req, res) => {
            this.alterar(req, res);
        })

        rotas.get('/exclusao', async (req, res) => {
            this.listar(req, res);
            let eventos = await this.listar(req,res);
            res.render('exclusaoEventos',{eventos:eventos})
        })

        return rotas;
    }

    async getUser(id){
        let evento = await Evento.findOne({
            raw: true,
            where: {
            id: (id),
            },   
        });
        return evento;
    }

    async listar(req, res) {
        let eventos = await this.eventosDao.listar();
        let dados = eventos.map(evento => {
            return {
                ...evento.dataValues
            };
        })
        return dados;
        // res.render('eventos', {eventos: dados});
    }
    
    async inserir(req, res) {
        try {
            let evento = await this.getEventoDaRequisicao(req);
            evento.id = await this.eventosDao.inserir(evento);
            this.listar(req, res);
            let eventos = await this.listar(req,res);
            res.render('eventos', {eventos: eventos});
        } catch (e) {
            console.log("erro inserir", e)
            res.status(400).json({
                mensagem: e.message
            });
        }

    }

    async alterar(req, res) {
        let evento = await this.getEventoDaRequisicao(req);
        let id = req.params.id;
        try {
            await this.eventosDao.alterar(id, evento);
            res.send('Ok')
        } catch (e) {
            res.status(400).json({
                mensagem: e.message
            });
        }
    }
    
    apagar(req, res) {
        let id = req.params.id;
        this.eventosDao.apagar(id);
        res.json({
            mensagem: 'mensagem_evento_apagado',
            id: id
        });
    }

    async getEventoDaRequisicao(req) {
        let corpo = req.body;
        let evento = Evento.build({
            nome: corpo.nome,
            lado: corpo.lado,
            area: corpo.area
        });
        return evento;
    }

}

module.exports = EventosController;