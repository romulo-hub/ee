/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import SharedPage from '../pages/shared.page'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import CapitalPage from '../pages/capital.page'
import CapitalEventoUtilitario from '../utilitarios/eventoCapital.utilitario'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Incentivada com capital tipo nominal com varios ativos cadastrado - Alterar o cadastro do capital do emissor', () => {
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
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComVariosAtivosCadastrado(capitalData.Emissor)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)
      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    it("Alterar o cadastro do capital do emissor já cadastrado para o tipo Unitário e consultar esse registro na busca de emissores", () => {

      capitalPage.salvarDesabilitadoCadastroCapital()
      capitalPage.capitalSocial().should('not.be.enabled').should('be.visible')
      capitalPage.nominalUnitario().selectOption("Unitário")
      capitalPage.valorUnitAcao().should('not.be.enabled').should('not.have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
      })
      capitalUtilitario.alterarTagAlongGridAtivos('PR', '98')
      cy.rowTableActive('OR', '[class="mat-slide-toggle-bar mat-slide-toggle-bar-no-side-margin"]')
      cy.rowTableActive('PR', '[class="mat-slide-toggle-bar mat-slide-toggle-bar-no-side-margin"]')
      capitalPage.salvarAlterarCadastroCapital()
      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.capitalSocial().should('not.be.enabled').should('be.visible')
      capitalPage.valorUnitAcao().should('not.be.enabled').should('not.have.value', 'R$ 3.200,00').should('be.visible')

    })

    it("Alterar o cadastro do capital do emissor já cadastrado para o tipo Nominal e consultar esse registro na busca de emissores", () => {

      capitalPage.salvarDesabilitadoCadastroCapital()
      capitalPage.capitalSocial().should('not.be.enabled').should('be.visible')
      capitalPage.nominalUnitario().selectOption("Nominal")
      capitalPage.valorUnitAcao().should('be.enabled').type("3.242,96")
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
        capitalPage.novoAtivoModal().tipoAtivoAlterarCapital().contains('PR').should('not.be.focused')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
      })

      capitalUtilitario.alterarTagAlongGridAtivos('OR', '91')
      cy.rowTableActive('OR', '[class="mat-slide-toggle-bar mat-slide-toggle-bar-no-side-margin"]')
      capitalPage.valorUnitAcao().should('be.enabled').should('have.value', 'R$ 3.242,96').should('be.visible')
      capitalPage.salvarAlterarCadastroCapital()
      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.capitalSocial().should('not.be.enabled').should('be.visible')
      capitalPage.valorUnitAcao().should('be.enabled').should('have.value', 'R$ 3.242,96').should('be.visible')

    })

    // Rodou ----------------------------
    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})