/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'
import { AtivoUtilitarioSite } from '../utilitarios/ativo.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalUtilitario: CapitalUtilitario
let mercadoUtilitario: MercadoUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite

describe('Consultar a aba Capital desabilitado na inclusão e na edição do emissor Disp. Reg. CVM', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    beforeEach(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalUtilitario = new CapitalUtilitario()
      mercadoUtilitario = new MercadoUtilitarioApi()
      ativoUtilitario = new AtivoUtilitarioSite()

      //Armazenar datas necessarios para validações em testes.
      cy.getDate().as('today_date')
      cy.getNextWorkingDay().as('next_wdate')

      cy.visit('')
      cy.viewport(1366, 768)

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorDispRegCVM(capitalData.Emissor)

      // cadastro mercado emissor
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)

      // cadastro ativo ordinário e preferencial
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      sharedPage.menuCadastro()
      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)

    })

    it("Consultar a aba Capital desabilitado na inclusão e na edição do emissor Disp. Reg. CVM", () => {

      sharedPage.subMenuCapital(false).should('not.be.enabled')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})