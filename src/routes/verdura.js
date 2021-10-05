const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Verdura = require('../model/Verdura')
const validaVerdura = [
    check("nome","Nome da Verdura é obrigatória!").not().isEmpty(),
    check("status","Informe um status válido para a Verdura").isIn(['ativo','inativo']),
    check("tipo", "Informe o tipo da Verdura!").not().isEmpty(),
    check("local", "Informe o local onde está a Verdura!").not().isEmpty(),
    check("quantidade", "Informe quantos há dessa Verdura no estoque!").not().isEmpty()
]

/****************************
 * Listar todas as Verdura
 * GET /Verdura
 * *************************/
router.get('/', async(req, res) => {
    try{
      const Verdura = await Verdura.find()
      res.json(Verdura)
    } catch (err){
      res.status(500).send({
          errors: [{message: 'Não foi possível obter as Verdura'}]
      })
    }
})

/*************************************
 * Listar uma única Verdura pelo ID
 * GET /Verduras/:id
 * ***********************************/
router.get('/:id', async(req, res) => {
    try {
        const Verdura = await Verdura.find({"_id" : req.params.id})
        res.json(Verdura)
    }catch (err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter a Verdura com o id ${req.params.id}`}]
        })
    }
})


/****************************
 * Inclui uma nova Verdura
 * POST / Verdura
 * *************************/
router.post('/', validaVerdura, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try{
        let Verdura = new Verdura(req.body)
        await Verdura.save()
        res.send(Verdura)
    }catch (err){
       return res.status(400).json({
           errors: [{message: `Erro ao salvar a Verdura: ${err.message}`}]
       })
    }
})

/****************************
 * Apaga uma Verdura pelo id
 * DELETE /Verdura
 * *************************/
router.delete('/:id', async(req, res) => {
    await Verdura.findByIdAndRemove(req.params.id)
    .then(Verdura => {
        res.send({message: `Verdura ${Verdura.nome} removida com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível excluir a Verdura'}]
        })
    })
})

/************************************
 * Altera uma Verdura já existente
 * PUT /Verduras
 * **********************************/
router.put('/', validaVerdura, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body
    await Verdura.findByIdAndUpdate(req.body._id, {$set: dados})
    .then(Verdura => {
        res.send({ message: `Verdura ${Verdura.nome} alterada com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível alterar a Verdura informada'}]
        })
    })
})

module.exports = router