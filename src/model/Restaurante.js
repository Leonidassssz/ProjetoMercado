const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando o Schema Restaurante
const RestauranteSchema = mongoose.Schema({
    nome: {
            type: String, 
            unique: true //cria um índice único
        },
    valorMedio: {type: Number},
    descricao: {type: String},
    fundacao: {type: Date},
    categoria: {type: Schema.Types.ObjectId, ref:'categoria'},
    endereco: {
        logradouro: {type: String},
        bairro: {type: String},
        cep: {type: String}, 
        municipio: {type: String},
        estado: {type: String}
    }
}, {timestamps: true})

module.exports = mongoose.model('Restaurantes', RestauranteSchema)