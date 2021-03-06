import { Router as routerFactory } from 'express'

import { verificarToken } from './middlewares'

import candidatos from './candidatos'
import { candidaturas } from './candidaturas'
import { like, likesCandidato, dislike } from './like'
import mandatos from './mandatos'
import posicionamento from './posicionamento'
import processos from './processos'
import resumo from './resumo'
import { registrarDispositivo } from './usuario'

const router = routerFactory()

router.get('/', (req, res) => {
  res.status(200).send({
    success: { message: 'Bem-vindo ao Laddres' },
  })
})

router.post('/usuario', (req, res) => {
  const { uniqueId, secret } = req.body
  const userAgent = req.headers['user-agent']

  registrarDispositivo({ uniqueId, secret, userAgent })
    .then(accessToken => res.status(200).send({ auth: true, accessToken }))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})
router.get('/usuario', verificarToken, (req, res) => {
  const { idDispositivo } = req
  res.status(200).send({ idDispositivo })
})

router.post('/like', verificarToken, (req, res) => {
  const { idCandidato } = req.body
  const { idDispositivo } = req

  like({ idCandidato, idDispositivo })
    .then(() => res.status(200).send())
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})
router.post('/dislike', verificarToken, (req, res) => {
  const { idCandidato } = req.body
  const { idDispositivo } = req

  dislike({ idCandidato, idDispositivo })
    .then(() => res.status(200).send())
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos', (req, res) => {
  const parametros = {
    nomeCandidato: req.query.nome,
    siglaEstado: req.query.estado,
    genero: req.query.genero,
    corRaca: req.query.corRaca,
    primeiraCandidatura: req.query.primeiraCandidatura,
  }

  candidatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/favoritos', verificarToken, (req, res) => {
  const parametros = {
    nomeCandidato: req.query.nome,
    siglaEstado: req.query.estado,
    genero: req.query.genero,
    corRaca: req.query.corRaca,
    primeiraCandidatura: req.query.primeiraCandidatura,
    idDispositivo: req.idDispositivo,
  }

  candidatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  candidatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/candidaturas', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  candidaturas({ idCandidato: parametros.idCandidato })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/likes', verificarToken, (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
    idDispositivo: req.idDispositivo,
  }

  likesCandidato({ idCandidato: parametros.idCandidato, idDispositivo: parametros.idDispositivo })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/mandatos', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
    anoEleicao: req.query.anoEleicao,
    cargo: req.query.cargo,
  }

  mandatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/posicionamentos', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  posicionamento({ idCandidato: parametros.idCandidato })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/processos', verificarToken, (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  processos({ idCandidato: parametros.idCandidato })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/resumo', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  resumo({ idCandidato: parametros.idCandidato })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

export default router
