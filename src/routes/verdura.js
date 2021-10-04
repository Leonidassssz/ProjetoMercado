const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const verdura = require('../model/verdura')
const validaverdura = [
    check("nome","Nome da verdura é obrigatória!").not().isEmpty(),
    check("status","Informe um status válido para a verdura").isIn(['ativo','inativo']),
    check("tipo", "Informe o tipo da verdura!").not().isEmpty(),
    check("local", "Informe o local onde está a verdura!").not().isEmpty(),
    check("quantidade", "Informe quantos há dessa verdura no estoque!").not().isEmpty()
]

/****************************
 * Listar todas as verdura
 * GET /verdura
 * *************************/
router.get('/', async(req, res) => {
    try{
      const verdura = await verdura.find()
      res.json(verdura)
    } catch (err){
      res.status(500).send({
          errors: [{message: 'Não foi possível obter as verdura'}]
      })
    }
})

/*************************************
 * Listar uma única verdura pelo ID
 * GET /verduras/:id
 * ***********************************/
router.get('/:id', async(req, res) => {
    try {
        const verdura = await verdura.find({"_id" : req.params.id})
        res.json(verdura)
    }catch (err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter a verdura com o id ${req.params.id}`}]
        })
    }
})


/****************************
 * Inclui uma nova verdura
 * POST / verdura
 * *************************/
router.post('/', validaverdura, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try{
        let verdura = new verdura(req.body)
        await verdura.save()
        res.send(verdura)
    }catch (err){
       return res.status(400).json({
           errors: [{message: `Erro ao salvar a verdura: ${err.message}`}]
       })
    }
})

/****************************
 * Apaga uma verdura pelo id
 * DELETE /verdura
 * *************************/
router.delete('/:id', async(req, res) => {
    await verdura.findByIdAndRemove(req.params.id)
    .then(verdura => {
        res.send({message: `verdura ${verdura.nome} removida com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível excluir a verdura'}]
        })
    })
})

/************************************
 * Altera uma verdura já existente
 * PUT /verduras
 * **********************************/
router.put('/', validaverdura, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body
    await verdura.findByIdAndUpdate(req.body._id, {$set: dados})
    .then(verdura => {
        res.send({ message: `verdura ${verdura.nome} alterada com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível alterar a verdura informada'}]
        })
    })
})

module.exports = router