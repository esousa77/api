/* eslint-disable prefer-promise-reject-errors */
import db from './utils/database'
import { nomeProprio } from './utils/formatar'

const sqlCompleto = (idCandidato, pagina, itens) => `
  SELECT
    candidatura.id,
    eleicao.ano as ano_eleicao,
    eleicao.descricao as descricao_eleicao,
    cidade.nome as cidade,
    estado.nome as estado,
    candidatura.numero_candidato,
    candidatura.nome_urna,
    partido.sigla as sigla_partido,
    partido.nome as nome_partido,
    candidatura.legenda_nome,
    candidatura.legenda_composicao,
    cargo.nome as cargo,
    candidatura.despesa_maxima,
    situacao_candidatura.descricao as situacao_candidatura,
    resultado_candidatura.descricao as resultado_candidatura
  FROM
    candidatura
      INNER JOIN candidato ON candidatura.candidato_id = candidato.id
      LEFT JOIN eleicao ON candidatura.eleicao_id = eleicao.id
      LEFT JOIN cidade ON candidatura.cidade_id = cidade.id
      LEFT JOIN estado ON candidatura.estado_id = estado.id
      LEFT JOIN partido ON candidatura.partido_id = partido.id
      LEFT JOIN cargo ON candidatura.cargo_id = cargo.id
      LEFT JOIN situacao_candidatura ON candidatura.situacao_candidatura_id = situacao_candidatura.id
      LEFT JOIN resultado_candidatura ON candidatura.resultado_candidatura_id = resultado_candidatura.id
  WHERE
    candidato.id = '${idCandidato}'
  ORDER BY
    eleicao.ano ASC
  LIMIT ${(pagina - 1) * itens}, ${itens}`

const formatarCandidaturas = candidaturas => (
  candidaturas.map(candidatura => (
    {
      id: candidatura.id,
      anoEleicao: candidatura.ano_eleicao,
      descricaoEleicao: nomeProprio(candidatura.descricao_eleicao),
      cidade: nomeProprio(candidatura.cidade),
      estado: nomeProprio(candidatura.estado),
      numeroCandidato: candidatura.numero_candidato ? candidatura.numero_candidato : null,
      nomeUrna: nomeProprio(candidatura.nome_urna),
      siglaPartido: candidatura.sigla_partido ? candidatura.sigla_partido.toUpperCase() : null,
      nomePartido: nomeProprio(candidatura.nome_partido),
      nomeLegenda: nomeProprio(candidatura.legenda_nome),
      composicaoLegenda: candidatura.legenda_composicao
        ? candidatura.legenda_composicao.toUpperCase()
        : null,
      cargo: nomeProprio(candidatura.cargo),
      despesaMaxima: candidatura.despesa_maxima ? candidatura.despesa_maxima : null,
      situacaoCandidatura: nomeProprio(candidatura.situacao_candidatura),
      resultadoCandidatura: nomeProprio(candidatura.resultado_candidatura),
    }
  ))
)

const candidaturas = ({ idCandidato, pagina = 1, itens = 100 }) => (
  new Promise((resolve, reject) => {
    const sql = sqlCompleto(idCandidato, pagina, itens)

    db.query(sql)
      .then((resultados) => {
        resolve(formatarCandidaturas(resultados))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidaturas