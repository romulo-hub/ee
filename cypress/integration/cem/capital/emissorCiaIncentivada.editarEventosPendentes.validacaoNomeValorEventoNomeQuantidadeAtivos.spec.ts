/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalNovoEventoPage from '../pages/eventoCapital.page'
import CapitalNovoEventoUtilitario from '../utilitarios/eventoCapital.utilitario'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalEventoPage: CapitalNovoEventoPage
let capitalNovoEventoUtilitario: CapitalNovoEventoUtilitario
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Incentivada - Validação do nome valor do evento e nome quantidade dos ativos conforme evento selecionado - editar eventos à homologar - conforme a regra dos tipos de eventos', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalEventoPage = new CapitalNovoEventoPage()
      capitalNovoEventoUtilitario = new CapitalNovoEventoUtilitario()
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

      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

      capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoAumentoCapitalSemHomologarComUmAtivoCapital(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoAjusteSemHomologarComUmAtivoCapital(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoBonificacaoSemHomologarComUmAtivoCapital(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoCisaoISemHomologarComUmAtivoCapital(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoConversaoAcoesSemHomologarComUmAtivoCapital(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.eventosAHomologar().click()

    })

    beforeEach(() => {

      cy.viewport(1366, 768)
      cy.wait(100)

    })

    it("Validar a exibição do nome quantidade e nome montante emitido - Aumento de Capital - conforme a regra dos tipos de eventos - editar eventos sem homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Aumento de Capital ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Aumento de Capital ', '[id="btn_edit"]', 'edit_outline ')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    })

    it("Validar a exibição do nome quantidade final e nome capital final - Ajuste - conforme a regra dos tipos de eventos - editar eventos sem homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Ajuste ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Ajuste ', '[id="btn_edit"]', 'edit_outline ')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Final ')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    })

    it("Validar a exibição do nome quantidade emitida e nome montante emitido - Bonificação - conforme a regra dos tipos de eventos - editar eventos sem homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Bonificação ', '[id="btn_edit"]', 'edit_outline ')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Emitida ')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    })

    it("Validar a exibição do nome quantidade e nome capital final - Cisão I - conforme a regra dos tipos de eventos - editar eventos sem homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Cisão I ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Cisão I ', '[id="btn_edit"]', 'edit_outline ')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ')
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    })

    it("Validar a exibição do nome quantidade final e nome montante - Conversão de ações - conforme a regra dos tipos de eventos - editar eventos sem homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Conversão de ações ', '[id="btn_edit"]', 'edit_outline ')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValue"]', '[placeholder="Montante"]', 'not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Final ')
      capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()
      capitalEventoPage.valorCapital().should('have.value', '')
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})