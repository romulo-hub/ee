/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalNovoEventoPage from '../pages/eventoCapital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalEventoPage: CapitalNovoEventoPage
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Incentivada - Validação do nome valor do evento e nome quantidade dos ativos conforme evento selecionado - Cadastro Novo Evento - conforme a regra dos tipos de eventos', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalEventoPage = new CapitalNovoEventoPage()
      capitalUtilitario = new CapitalUtilitario()
      ativoUtilitario = new AtivoUtilitarioSite()
      mercadoUtilitario = new MercadoUtilitarioApi()

      //Armazenar datas necessarios para validações em testes.
      cy.getDate().as('today_date')
      cy.getNextWorkingDay().as('next_wdate')

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()

    })

    beforeEach(() => {

      cy.viewport(1366, 768)
      capitalPage.novoEvento().click()

    })

    it("Validar a exibição do nome quantidade e nome montante emitido - Aumento de Capital - Cadastro Novo Evento - conforme a regra dos tipos de eventos", function () {

      capitalEventoPage.dataAprovacao().type(this.today_date)
      capitalEventoPage.tipoEvento().selectOption("Aumento de Capital")
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ').should('be.visible')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).should('not.be.enabled')
      })
      capitalEventoPage.cancelarCadastroNovoEvento().click()
    })

    it("Validar a exibição do nome quantidade final e nome capital final - Ajuste - Cadastro Novo Evento - conforme a regra dos tipos de eventos", function () {

      capitalEventoPage.dataAprovacao().type(this.today_date)
      capitalEventoPage.tipoEvento().selectOption("Ajuste")
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Final ').should('be.visible')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).click().type("1789")
      })
      capitalEventoPage.cancelarCadastroNovoEvento().click()
    })

    it("Validar a exibição do nome quantidade emitida e nome montante emitido - Bonificação - Cadastro Novo Evento - conforme a regra dos tipos de eventos", function () {

      capitalEventoPage.dataAprovacao().type(this.today_date)
      capitalEventoPage.tipoEvento().selectOption("Bonificação")
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Emitida').should('be.visible')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).click().type("1999")
      })
      capitalEventoPage.cancelarCadastroNovoEvento().click()
    })

    it("Validar a exibição do nome quantidade e nome capital final - Cisão I - Cadastro Novo Evento - conforme a regra dos tipos de eventos", function () {

      capitalEventoPage.dataAprovacao().type(this.today_date)
      capitalEventoPage.tipoEvento().selectOption("Cisão I")
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ').should('be.visible')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).should('not.be.enabled')
      })
      capitalEventoPage.cancelarCadastroNovoEvento().click()
    })

    it("Validar a exibição do nome quantidade final e nome montante - Conversão de ações - Cadastro Novo Evento - conforme a regra dos tipos de eventos", function () {

      capitalEventoPage.dataAprovacao().type(this.today_date)
      capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Final ').should('be.visible')
      capitalEventoPage.valorCapital().should('have.value', '').should('not.be.enabled')
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).click().type("4646")
      })
      capitalEventoPage.cancelarCadastroNovoEvento().click()
    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})