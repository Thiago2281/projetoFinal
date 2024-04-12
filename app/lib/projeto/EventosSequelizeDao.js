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

    inserir(evento) {
        this.validar(evento);
        // evento.senha = bcrypt.hashSync(evento.senha, 10);
        return evento.save();
    }

    async alterar(id, evento) {
        this.validar(evento);
        let obj = {...evento.dataValues};
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

    validar(evento) {
        if (!evento.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!evento.lado) {
            throw new Error('mensagem_lado_em_branco');
        }
    }

    // async autenticar(nome, senha) {
    //     let evento = await this.Evento.findOne({where: {nome}});
    //     if (bcrypt.compareSync(senha, evento.senha)) {
    //         return evento;
    //     } else {
    //         return null; 
    //     }   
    //     // return evento;
    // }
}

module.exports = EventosSequelizeDao;