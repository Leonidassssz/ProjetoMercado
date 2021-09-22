const mongoose = require('mongoose')

const CategoriaSchema = mongoose.Schema({
    nome: {type: String},
    status: {type: String, enum:['ativo','inativo'], default: 'ativo'}
},{timestamps:true})

module.exports = mongoose.model('categoria', CategoriaSchema)