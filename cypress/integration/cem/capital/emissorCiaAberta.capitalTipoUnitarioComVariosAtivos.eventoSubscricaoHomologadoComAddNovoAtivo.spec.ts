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

describe('Tipo emissor Cia Aberta com capital tipo unitario com varios ativos cadastrado - Cadastrar evento Subscrição já homologado com exclusão dos ativos anteriores, adicionar novo ativo, validar os valores capital e histórico capital conforme o evento cadastrado', () => {
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
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComDoisAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)
      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoSubscricaoJaHomologado(capitalData.EventoCapital)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Validar as alterações no capital cadastrado após o evento Subscrição já homologado", () => {

      capitalPage.capitalSocial().should('have.value', 'R$ 30.300,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '30%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('230').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '30%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('199').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PA ', '30%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('100').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PA').should('be.visible').should('not.be.enabled')

      })

      capitalPage.valorUnitAcao().should('have.value', 'R$ 57,28').should('be.visible')

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '230')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '529')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '299')
        .should('be.visible')

    })

    it("Validar os detalhes no histórico do capital após cadastro do evento Subscrição já homologado com exclusão dos ativos anteriores e novo ativo adicionado", function () {

      capitalPage.historicoCapital().click()
      capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Subscrição', '[id="btn_details_capital"]')
      cy.get('app-history-detail').get('[class="modal"]').within(() => {
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Subscrição')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('have.value', 'R$ 30.300,00')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('have.value', 'Unitário')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('have.value', 'R$ 57,28')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('have.value', '230')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('have.value', '299')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('have.value', '529')
        cy.get('[class="mat-table cdk-table"]').within(() => {

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('230').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 30% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('199').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 30% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 30% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains(' 100 ').should('not.be.enabled')

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PA ').should('not.be.enabled')

        })
      })

      capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
      capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
      capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
      capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Subscrição')
      capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 30.300,00')
      capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})