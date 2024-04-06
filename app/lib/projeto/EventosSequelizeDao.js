const Evento = require("./Evento")
const bcrypt = require('bcrypt')
const { Sequelize, DataTypes, Model } = require('sequelize');


class EventosSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Evento = Evento.init({
            nome: DataTypes.TEXT,
            lado: DataTypes.FLOAT,
            area: DataTypes.FLOAT,
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            createdAt: {
                default: 'now()',
                type: DataTypes.DATE
            },
            updatedAt: {
                default: 'now()',
                type: DataTypes.DATE
            }
        }, { sequelize });

        (async () => {
            await this.Evento.sync();
            console.log('Tabela criada com sucesso!');
        })();
    }
    listar() {
        return this.Evento.findAll();
    }

    inserir(usuario) {
        this.validar(usuario);
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
        
        return usuario.save();
    }

    async alterar(id, usuario) {
        this.validar(usuario);
        let obj = {...usuario.dataValues};
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });
        console.log("alterar", obj);
        Evento.update(obj, { where: { id: id } });
        return obj
    }

    apagar(id) {
        return Evento.destroy({ where: { id: id } });
        
    }

    validar(usuario) {
        if (!usuario.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!usuario.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
    }

    async autenticar(nome, senha) {
        let usuario = await this.Evento.findOne({where: {nome}});
        if (bcrypt.compareSync(senha, usuario.senha)) {
            return usuario;
        } else {
            return null; 
        }   
        // return usuario;
    }
}

module.exports = EventosSequelizeDao;