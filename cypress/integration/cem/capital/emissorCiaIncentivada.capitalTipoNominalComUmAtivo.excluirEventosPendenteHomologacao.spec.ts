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

describe('Tipo emissor Cia Incentivada com capital tipo nominal com um ativo cadastrado - Validar a exclusão dos eventos pendentes de homologação', () => {

  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

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
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

      //cadastro capital emissor com tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

      cy.visit('')

      emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
      sharedPage.subMenuCapital().click()
      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoConversaoDebenturesUmAtivoAHomologar(capitalData.EventoCapital)
      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologar(capitalData.EventoCapital)
      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoBonificacaoAHomologar(capitalData.EventoCapital)
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
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()
      cy.wait(5000)
      capitalPage.eventosAHomologar().click()
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

      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.300').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '1.300')
        .should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})