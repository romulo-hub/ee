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

describe('Tipo emissor Cia Aberta - Validação do nome valor do evento e nome quantidade dos ativos conforme evento - grid eventos a homologar', () => {
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

      //cadastro capital emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComVariosAtivosCadastrado(capitalData.Emissor)

      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoAumentoCapitalSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoConversaoAcoesSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoAjusteSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoBonificacaoSemHomologarComVariosAtivos(capitalData.Emissor)
      capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoCisaoISemHomologarComVariosAtivos(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalPage.eventosAHomologar().click()

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Validar a exibição do nome quantidade e nome montante emitido - Aumento de Capital - grid eventos a homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Aumento de Capital ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('have.value', 'R$ 56.346,00')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ')

    })

    it("Validar a exibição do nome quantidade emitida e nome montante emitido - Conversão de ações - grid eventos a homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('have.value', 'R$ 56.346,00')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Emitida ')

    })

    it("Validar a exibição do nome quantidade final e nome capital final - Ajuste - grid eventos a homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Ajuste ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital Final"]').should('have.value', 'R$ 23.456,00')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Final ')

    })

    it("Validar a exibição do nome quantidade emitida e nome montante emitido - Bonificação - grid eventos a homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('have.value', 'R$ 56.346,00')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade Emitida ')

    })

    it("Validar a exibição do nome quantidade e nome capital final - Cisão I - grid eventos a homologar", () => {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Cisão I ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital Final"]').should('have.value', 'R$ 23.456,00')
      capitalEventoPage.nomeQuantidadeEventoCapital('[class="mat-header-cell cdk-header-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]', ' Quantidade ')
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})