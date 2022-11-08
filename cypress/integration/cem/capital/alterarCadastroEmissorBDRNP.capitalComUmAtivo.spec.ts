/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite, ConsultarEmissorCadastradoSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor BDR NP com capital tipo nominal com um ativo cadastrado - Alterar o cadastro do capital do emissor', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalUtilitario = new CapitalUtilitario()
      ativoUtilitario = new AtivoUtilitarioSite()
      mercadoUtilitario = new MercadoUtilitarioApi()

      //Armazenar datas necessarios para validações em testes.
      cy.getDate().as('today_date')
      cy.getNextWorkingDay().as('next_wdate')

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorBDRNP(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(capitalData.Emissor)
      
      //cadastro emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)
      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    it("Alterar o cadastro do capital do emissor já cadastrado para o tipo Unitário e consultar esse registro na busca de emissores", () => {

      capitalPage.capitalSocial().should('not.be.enabled').should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('be.enabled').should('have.value', 'R$ 3.200,00')
      capitalPage.nominalUnitario().selectOption("Unitário")
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.300').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
      })
      capitalPage.valorUnitAcao().should('not.be.enabled').should('not.have.value', 'R$ 3.200,00')
      capitalUtilitario.alterarTagAlongGridAtivos('PR', '98')
      capitalPage.novoAtivoModal().flagResgatavelAlterarCapital().click()
      capitalPage.salvarAlterarCadastroCapital()
      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.valorUnitAcao().should('not.have.value', 'R$ 3.200,00').should('have.value', '').should('not.be.enabled').should('be.visible')
      capitalPage.capitalSocial().should('not.be.enabled').should('have.value', '').should('be.visible')

    })

    it("Alterar o cadastro do capital do emissor já cadastrado para o tipo Nominal e consultar esse registro na busca de emissores", () => {

      capitalPage.capitalSocial().should('not.be.enabled').should('have.value', '').should('be.visible')
      capitalPage.nominalUnitario().selectOption("Nominal")
      capitalPage.valorUnitAcao().should('be.enabled').clear().type("3.252,35")
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.300').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
      })
      capitalUtilitario.alterarTagAlongGridAtivos('PR', '94')
      capitalPage.novoAtivoModal().flagResgatavelAlterarCapital().click()
      capitalPage.valorUnitAcao().should('be.enabled').should('have.value', 'R$ 3.252,35').should('be.visible')
      capitalPage.salvarAlterarCadastroCapital()
      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.capitalSocial().should('not.be.enabled').should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('be.enabled').should('have.value', 'R$ 3.252,35').should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})