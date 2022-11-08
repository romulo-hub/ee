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

describe('Tipo emissor Cia Aberta - Validação do nome valor do evento e nome quantidade dos ativos conforme evento selecionado - homologação de eventos pendentes - conforme a regra dos tipos de eventos', () => {
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
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComVariosAtivosCadastrado(capitalData.Emissor)

      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoAumentoCapitalSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoAjusteSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoBonificacaoSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoCisaoISemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoConversaoAcoesSemHomologarComVariosAtivos(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.eventosAHomologar().click()

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Validar a exibição do nome quantidade e nome montante emitido - Aumento de Capital - conforme a regra dos tipos de eventos - homologação de eventos pendentes", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Aumento de Capital ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Aumento de Capital ', '[id="btn_check"]', ' check_circle_outline')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValueAapproved"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantityApproved mat-column-shareClassQuantityApproved ng-star-inserted"]', ' Quantidade ')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 56.346,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('30000')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
      capitalNovoEventoUtilitario.validarQtdeHomologadaAtivosEventoCapitalDesabilitado(' OR ', '2.102')
      capitalNovoEventoUtilitario.validarQtdeHomologadaAtivosEventoCapitalDesabilitado(' PR ', '2.454')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.102')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.454')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()

    })

    it("Validar a exibição do nome quantidade final e nome capital final - Ajuste - conforme a regra dos tipos de eventos - homologação de eventos pendentes", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Ajuste ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Ajuste ', '[id="btn_check"]', ' check_circle_outline')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValueAapproved"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantityApproved mat-column-shareClassQuantityApproved ng-star-inserted"]', ' Quantidade Final ')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 23.456,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('3.000')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.567', '1.567')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' PR ', '2.878', '2.878')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('535')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('1.465')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.102')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.343')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()

    })

    it("Validar a exibição do nome quantidade emitida e nome montante emitido - Bonificação - conforme a regra dos tipos de eventos - homologação de eventos pendentes", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Bonificação ', '[id="btn_check"]', ' check_circle_outline')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValueAapproved"]', '[placeholder="Montante Emitido"]', 'not.be.enabled').should('not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantityApproved mat-column-shareClassQuantityApproved ng-star-inserted"]', ' Quantidade Emitida')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 34.567,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('30000')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' OR ', '2.102', '2.102')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' PR ', '3.567', '3.567')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.102')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.343')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()

    })

    it("Validar a exibição do nome quantidade e nome capital final - Cisão I - conforme a regra dos tipos de eventos - homologação de eventos pendentes", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Cisão I ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Cisão I ', '[id="btn_check"]', ' check_circle_outline')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValueAapproved"]', '[placeholder="Capital Final"]', 'not.be.enabled').should('not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantityApproved mat-column-shareClassQuantityApproved ng-star-inserted"]', ' Quantidade ')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 76.545,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('122350')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
      capitalNovoEventoUtilitario.validarQtdeHomologadaAtivosEventoCapitalDesabilitado(' OR ', '2.102')
      capitalNovoEventoUtilitario.validarQtdeHomologadaAtivosEventoCapitalDesabilitado(' PR ', '4.343')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.102')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.343')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()

    })

    it("Validar a exibição do nome quantidade final e nome montante - Conversão de ações - conforme a regra dos tipos de eventos - homologação de eventos pendentes", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Conversão de ações ', '[id="btn_check"]', ' check_circle_outline')
      capitalEventoPage.nomeValorEventoCapital('[id="capitalPriceValueAapproved"]', '[placeholder="Montante"]', 'not.be.enabled').should('not.be.enabled').should('be.visible')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantityApproved mat-column-shareClassQuantityApproved ng-star-inserted"]', ' Quantidade Final')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 76.453,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 76.453,00').should('not.be.enabled')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.160', '1.160')
      capitalNovoEventoUtilitario.alterarQtdeHomologadaAtivosEventoCapital(' PR ', '2.230', '2.230')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('942')
      capitalNovoEventoUtilitario.validarQuantidadeRestanteVariosAtivosHomologarEvento('2.113')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.102')
      capitalNovoEventoUtilitario.validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.343')
      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})