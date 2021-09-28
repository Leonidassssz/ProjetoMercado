const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Restaurante = require('../model/Restaurante')
const validaRestaurante = [
    check("nome","Nome do restaurante é obrigatório!").not().isEmpty(),
    check("descricao","A descrição do restaurante é obrigatório").not().isEmpty(),
    check("valorMedio","Informe um valor numérico").isNumeric()
]

/****************************
 * Listar todos os restaurantes
 * GET /restaurantes
 * *************************/
router.get('/', async(req, res) => {
    try{
      const restaurantes = await Restaurante.find()
                                 .sort({nome: 1})
                                 .populate("categoria", "nome")
      res.json(restaurantes)
    } catch (err){
      res.status(500).send({
          errors: [{message: 'Não foi possível obter os restaurantes'}]
      })
    }
})

/*************************************
 * Listar um único restaurante pelo ID
 * GET /restaurantes/:id
 * ***********************************/
router.get('/:id', async(req, res) => {
    try {
        const restaurante = await Restaurante.find({"_id" : req.params.id})
                                             .sort({nome: 1})
                                             .populate("categoria", "nome")
        res.json(restaurante)
    }catch (err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter o restaurante com o id ${req.params.id}`}]
        })
    }
})


/****************************
 * Inclui uma nova restaurante
 * POST /restaurantes
 * *************************/
router.post("/", validaRestaurante, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    //Verificando se o restaurante já existe
    const { nome }  = req.body
    let restaurante = await Restaurante.findOne({nome})
    if (restaurante)
    return res.status(400).json({
        errors: [{message: "Já existe um restaurante com o nome informado!"}]
    })
    

    try{
        let restaurante = new Restaurante(req.body)
        await restaurante.save()
        res.send(restaurante)
    }catch (err){
       return res.status(400).json({
           errors: [{message: `Erro ao salvar o restaurante: ${err.message}`}]
       })
    }
})

/****************************
 * Apaga uma restaurante pelo id
 * DELETE /restaurantes
 * *************************/
router.delete('/:id', async(req, res) => {
    await Restaurante.findByIdAndRemove(req.params.id)
    .then(restaurante => {
        res.send({message: `Restaurante ${restaurante.nome} removido com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível excluir o restaurante'}]
        })
    })
})

/************************************
 * Altera um restaurante já existente
 * PUT /restaurantes
 * **********************************/
router.put('/', validaRestaurante, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body
    await Restaurante.findByIdAndUpdate(req.body._id, {$set: dados})
    .then(restaurante => {
        res.send({ message: `Restaurante ${restaurante.nome} alterado com sucesso`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: 'Não foi possível alterar o restaurante informada'}]
        })
    })
})

module.exports = router