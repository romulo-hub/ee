/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
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

describe('Tipo emissor Cia Incentivada com capital tipo nominal com varios ativos cadastrado - Cadastrar evento Conversão de ações já homologado com exclusão dos ativos anteriores, adicionar novo ativo, validar os valores capital e histórico capital conforme o evento cadastrado', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
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
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)
      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoAcoesJaHomologado(capitalData.EventoCapital)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Validar as alterações no capital cadastrado após o evento Conversão de ações já homologado", () => {

      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PF ', '80%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.672').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('not.be.visible')
        cy.contains('OR').should('not.be.visible')
        cy.contains('PF').should('be.visible').should('not.be.enabled')

      })

      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '2.672')
        .should('be.visible')

    })

    it("Validar os detalhes no histórico do capital após cadastro do evento Conversão de ações já homologado com exclusão dos ativos anteriores e novo ativo adicionado", function () {

      capitalPage.historicoCapital().click()
      capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Conversão de ações', '[id="btn_details_capital"]')
      cy.get('app-history-detail').get('[class="modal"]').within(() => {
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Conversão de ações')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 0,00')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Nominal')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 3.200,00')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '2.672')

        cy.get('[class="mat-table cdk-table"]').within(() => {

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.672').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 80% ').should('not.be.enabled').should('be.visible')

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('not.be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('not.be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PF ').should('be.visible').should('not.be.enabled')

        })
      })

      capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
      capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
      capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
      capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Conversão de ações')
      capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 0,00')
      capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})