/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalEventoPage from '../pages/eventoCapital.page'
import CapitalEventoUtilitario from '../utilitarios/eventoCapital.utilitario'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalEventoPage: CapitalEventoPage
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Outros Emissores com capital Tipo Unitário com vários ativos cadastrado - Na grid eventos a homologar e homologar eventos pendentes - Validar as quantidades ativos capital após cancelar a edição do evento sem homologar', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoUnitario.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalEventoPage = new CapitalEventoPage()
      capitalNovoEventoUtilitario = new CapitalEventoUtilitario()
      capitalUtilitario = new CapitalUtilitario()
      ativoUtilitario = new AtivoUtilitarioSite()
      mercadoUtilitario = new MercadoUtilitarioApi()

      //Armazenar datas necessarios para validações em testes.
      cy.getDate().as('today_date')
      cy.getNextWorkingDay().as('next_wdate')

    })

    beforeEach(() => {

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorOutrosEmissores(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo unitário
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)
      capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologar(capitalData.EventoCapital)
      capitalPage.eventosAHomologar().click()

    })

    it("Na grid EVENTOS A HOMOLOGAR validar as quantidades dos ativos após cancelar a edição do evento sem homologar", function () {

      capitalNovoEventoUtilitario.capitalEditarEventoSemHomologar().cancelarAlteracoesNaEdicaoEventoConversaoAcoesVariosAtivosCapital(capitalData.EventoCapital)
      cy.wait(200)
      capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
      capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
      capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
      cy.get('[class="mat-table cdk-table"]').get('tbody').within(() => {
        cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
        cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
        cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
        cy.get('[id="shareClassQuantity"]').should('not.contain', ' 2.100 ')
        cy.get('[id="shareClassQuantity"]').should('not.contain', ' 1.200 ')

      })

      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    it("Na homologação eventos pendentes validar as quantidades dos ativos após cancelar a edição do evento sem homologar", function () {

      capitalNovoEventoUtilitario.capitalEditarEventoSemHomologar().cancelarAlteracoesNaEdicaoEventoConversaoAcoesVariosAtivosCapital(capitalData.EventoCapital)
      cy.wait(200)
      capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
      cy.wait(200)
      cy.get('mat-table').get('[class="mat-table cdk-table"]').get('[class="mat-row cdk-row ng-star-inserted"]').within(() => {

        cy.get('[id="shareClassQuantityHomologated"]').last().should('not.have.value', '2.100')
        cy.get('[id="shareClassQuantityHomologated"]').should('not.have.value', '1.200')
        cy.get('[id="shareClassQuantityApproved"]').should('not.contain', '2.100')
        cy.get('[id="shareClassQuantityApproved"]').should('not.contain', '1.200')

      })

      capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    afterEach("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})