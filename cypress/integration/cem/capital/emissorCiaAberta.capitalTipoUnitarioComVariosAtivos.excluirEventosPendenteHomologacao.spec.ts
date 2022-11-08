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

describe('Tipo emissor Cia Aberta com capital tipo unitário com vários ativos cadastrado - Validar a exclusão dos eventos pendentes de homologação', () => {
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

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo unitário
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoDebenturesCapitalAHomologar(capitalData.EventoCapital)
      capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologar(capitalData.EventoCapital)
      capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoBonificacaoAHomologar(capitalData.EventoCapital)
      capitalPage.eventosAHomologar().click()

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Excluir o evento pendente de homologação Conversão Debêntures", function () {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão Debêntures ')
      capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
      capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão Debêntures ')
      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão Debêntures ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Conversão Debêntures ', '[id="btn_delete"]', ' delete ')
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().excluirEventoSemHomologar()
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().msgEventoPendenteHomologarExcluido()

    })

    it("Excluir o evento pendente de homologação Bonificação", function () {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
      capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
      capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Bonificação ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Bonificação ', '[id="btn_delete"]', ' delete ')
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().excluirEventoSemHomologar()
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().msgEventoPendenteHomologarExcluido()

    })

    it("Excluir o evento pendente de homologação Conversão de ações", function () {

      capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
      capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
      capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
      capitalNovoEventoUtilitario.selecionarEventoCapitalGridEventoSemHomologar(' Conversão de ações ', '[id="btn_delete"]', ' delete ')
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().excluirEventoSemHomologar()
      capitalEventoPage.gridEventosAHomologarModal().excluirEventosSemHomologarModal().msgEventoPendenteHomologarExcluido()

      capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    it("Validar que os eventos pendente de homologação foi excluídos", function () {

      capitalPage.eventosAHomologar().click()
      capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    it("Validar o capital cadastrado sem nenhuma alteração dos eventos que foi excluído", () => {

      capitalPage.capitalSocial().should('have.value', 'R$ 30.000,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 6,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.000')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '5.000')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.000')
        .should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})