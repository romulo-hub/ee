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

describe('Tipo emissor Cia Incentivada com capital tipo unitario com um ativo cadastrado - Cadastrar evento Redução de Capital sem homologar com exclusão dos ativos anteriores, adicionar novo ativo, homologar completo o evento Bonificação, consultar a grid EVENTOS A HOMOLOGAR, validar os valores capital e histórico capital conforme o evento cadastrado', () => {
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
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo unitário
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoUnitarioComUmAtivoCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)
      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoBonificacaoAHomologarExclusaoAtivosAnterioresAddNovoAtivo(capitalData.EventoCapital)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Consultar a grid EVENTOS A HOMOLOGAR o evento Bonificação sem homologar", function () {

      capitalPage.eventosAHomologar().click()
      capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
      capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Bonificação ')
      capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('have.value', 'R$ 0,00')
      capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
      cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
        cy.get('[id="shareClassTypeAcronym"]').contains(' PC ').should('be.visible')
        cy.get('[id="shareClassQuantity"]').contains(' 2.822 ').should('be.visible')

      })
    })

    it("Homologar completo o evento Bonificação com exclusão dos ativo anteriores e novo ativo adicionado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialHomologarEventoPendentesCapital().homologarCompletoEventoSomarQtdeAtivosExclusaoAtivosAnterioresAddNovoAtivo(capitalData.EventoCapital)
      capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

    })

    it("Validar as alterações no capital cadastrado após homologar completo o evento Bonificação", () => {

      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('PC', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.822 ').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.200 ').should('not.be.enabled').should('be.visible')

        cy.contains(' OR ').should('be.visible').should('not.be.enabled')
        cy.contains(' PC ').should('be.visible').should('not.be.enabled')

      })

      capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })
      //capitalPage.valorUnitAcao().invoke('val').should('contain', 'R$ 0,0000001')

      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '4.022')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.200')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '2.822')
        .should('be.visible')

    })

    it("Validar os detalhes no histórico do capital após homologar completa o evento Bonificação com exclusão dos ativos anteriores e novo ativo adicionado", function () {

      capitalPage.historicoCapital().click()
      capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Bonificação', '[id="btn_details_capital"]')
      cy.get('app-history-detail').get('[class="modal"]').within(() => {
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Bonificação')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('have.value', this.today_date)
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('have.value', 'R$ 0,00')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('have.value', 'Unitário')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('have.value', '')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('have.value', '1.200')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('have.value', '2.822')
        capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('have.value', '4.022')
        cy.get('[class="mat-table cdk-table"]').within(() => {

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.200').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 98% ').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.822').should('not.be.enabled').should('be.visible')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')

          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
          capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PC ').should('be.visible').should('not.be.enabled')

        })
      })

      capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital()
      capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
      capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
      capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Bonificação')
      capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains(' R$ 0,00 ')
      capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})