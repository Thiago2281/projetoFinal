const Usuario = require('./../lib/projeto/Usuario');
const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');

class UsuariosController {
    constructor(usuariosDao) {
        this.usuariosDao = usuariosDao;      
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', async (req, res) => {
            this.listar(req, res);
            let usuarios = await this.listar(req,res);
            // res.render('usuarios', {usuarios: usuarios});       
            res.json(usuarios) 
        });

        rotas.delete('/:id', (req, res) => {
            this.apagar(req, res);
        })

        rotas.get('/cadastro', (req, res) => {
            res.render('cadastroUsuarios',{usuario:{}})
        })

        rotas.post('/cadastro', async (req, res) => {
            this.inserir(req, res);
         
        })

        rotas.put('/cadastro/:id', (req, res) => {
            this.alterar(req, res);
        })

        return rotas;
    }

    async getUser(id){
        let usuario = await Usuario.findOne({
            raw: true,
            where: {
            id: (id),
            },   
        });
        return usuario;
    }

    async listar(req, res) {
        let usuarios = await this.usuariosDao.listar();
        let dados = usuarios.map(usuario => {
            return {
                ...usuario.dataValues
            };
        })
        return dados;
        // res.render('usuarios', {usuarios: dados});
    }
    
    async inserir(req, res) {
        try {
            let usuario = await this.getUsuarioDaRequisicao(req);
            usuario.id = await this.usuariosDao.inserir(usuario);
            this.listar(req, res);
            if (req.headers.accept === 'application/json') {
                res.json(usuario.id);
            } else {
                res.render('usuarios', {usuarios: usuarios});
            } 
        } catch (e) {
            console.log("erro inserir", e)
            res.status(400).json({
                mensagem: e.message
            });
        }

    }

    async alterar(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        let id = req.params.id;
        try {
            await this.usuariosDao.alterar(id, usuario);
            res.send('Ok')
        } catch (e) {
            res.status(400).json({
                mensagem: e.message
            });
        }
    }
    
    apagar(req, res) {
        let id = req.params.id;
        this.usuariosDao.apagar(id);
        res.json({
            mensagem: 'mensagem_usuario_apagado',
            id: id
        });
    }

    async getUsuarioDaRequisicao(req) {
        let corpo = req.body;
        let usuario = Usuario.build({
            nome: corpo.nome,
            senha: corpo.senha,
            papel_id: corpo.papel_id
        });
        return usuario;
    }

}

module.exports = UsuariosController;