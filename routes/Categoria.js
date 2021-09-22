const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Categoria = require('../model/Categoria')
const validaCategoria = [
    check("nome","Nome da categoria é obrigatória!").not().isEmpty(),
    check("status","Informe um status válido para a categoria").isIn(['ativo','inativo'])
]

/****************************
 * Listar todas as categorias
 * GET /categorias
 * *************************/
router.get('/', async(req, res) => {
    try{
      const categorias = await Categoria.find()
      res.json(categorias)
    } catch (err){
      res.status(500).send({
          errors: [{message: 'Não foi possível obter as categorias'}]
      })
    }
})

/*************************************
 * Listar uma única categoria pelo ID
 * GET /categorias/:id
 * ***********************************/
router.get('/:id', async(req, res) => {
    try {
        const categoria = await Categoria.find({"_id" : req.params.id})
        res.json(categoria)
    }catch (err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter a categoria com o id ${req.params.id}`}]
        })
    }
})


/****************************
 * Inclui uma nova categoria
 * POST /categorias
 * *************************/
router.post("/", validaCategoria, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try{
        let categoria = new Categoria(req.body)
        await categoria.save()
        res.send(categoria)
    }catch (err){
       return res.status(400).json({
           errors: [{message: `Erro ao salvar a categoria: ${err.message}`}]
       })
    }
})

/****************************
 * Apaga uma categoria pelo id
 * DELETE /categorias
 * *************************/
router.delete('/:id', async(req, res) => {
    await Categoria.findByIdAndRemove(req.params.id)
    .then(categoria => {
        res.send({message: `Categoria ${categoria.nome} removida com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível excluir a categoria'}]
        })
    })
})

/************************************
 * Altera uma categoria já existente
 * PUT /categorias
 * **********************************/
router.put('/', validaCategoria, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body
    await Categoria.findByIdAndUpdate(req.body._id, {$set: dados})
    .then(categoria => {
        res.send({ message: `Categoria ${categoria.nome} alterada com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível alterar a categoria informada'}]
        })
    })
})

module.exports = router