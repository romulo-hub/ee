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

describe('Tipo emissor Outros Emissores com capital Tipo Unitário com vários ativos cadastrado - Homologar completo o evento Conversão de ações que foi editado, consultar a grid EVENTOS A HOMOLOGAR e validar as alterações do evento homologado no histórico e capital já cadastrado', () => {
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
      cy.getDateShort().as('today_date_short')
      cy.getNextWorkingDay().as('next_wdate')

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorOutrosEmissores(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo unitário
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

      capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologarComAddNovoAtivoTipoUnitario(capitalData.EventoCapital)
      capitalNovoEventoUtilitario.capitalEditarEventoSemHomologar().editarEventoConversaoAcoesSemHomologar(capitalData.EventoCapital)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Homologar completo o evento Conversão de ações que foi editado e consultar a grid EVENTOS A HOMOLOGAR", function () {

      capitalNovoEventoUtilitario.homologarEventoPendentesCapital().homologarCompletoEventoEditadoConversaoAcoesCapitalUnitarioComVariosAtivos(capitalData.EventoCapital)
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    it("Validar as alterações do evento Conversão de ações homologado completo no capital cadastrado", () => {

      capitalPage.capitalSocial().should('have.value', 'R$ 30.000,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 7,3170731').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.200 ').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.500 ').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.400 ').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.200')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '4.100')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '2.900')
        .should('be.visible')

    })

    it("Validar os detalhes no histórico do capital após confirmar homologação completa do evento editado Conversão de ações", function () {

      capitalPage.historicoCapital().click()
      capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Conversão de ações', '[id="btn_details_capital"]')
      cy.get('app-history-detail').get('[class="modal"]').within(() => {
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Conversão de ações')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date_short)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date_short)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('have.value', 'R$ 30.000,00')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('have.value', 'Unitário')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('have.value', 'R$ 7,3170731')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('have.value', '1.200')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('have.value', '2.900')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('have.value', '4.100')
        cy.get('[class="mat-table cdk-table"]').within(() => {

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.200').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.500').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains(' 1.400 ').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PB ').should('not.be.enabled')

        })
      })
      capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital()
      capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
      capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
      capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Conversão de ações')
      capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains(' R$ 30.000,00 ')
      capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})