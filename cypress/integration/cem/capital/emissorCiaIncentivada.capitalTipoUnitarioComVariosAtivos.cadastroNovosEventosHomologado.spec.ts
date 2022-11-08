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

describe('Tipo emissor Cia Incentivada com capital tipo unitario com varios ativos cadastrado - Cadastrar novos eventos capital já homologado, validações especificas no cadastro do evento do capital e validações dos valores capital conforme o evento cadastrado', () => {
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
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Cadastrar o evento aumento de capital sem emissão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoAumentoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 2.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
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

    it("Cadastrar o evento redução capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoReducaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('OR', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.860 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PR', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.000 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PB', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.000 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.000')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '5.580')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.860')
        .should('be.visible')

    })

    it("Cadastrar o evento Conversão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoAcoesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('OR', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.160 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PR', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.160 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PB', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.160 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.320')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '6.480')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '2.160')
        .should('be.visible')

    })

    it("Cadastrar o evento conversão debêntures já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoDebenturesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 2.822,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('OR', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 3.222 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PR', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 3.222 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PB', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 3.222 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '6.444')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '9.666')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')

    })

    it("Cadastrar o evento somar quantidade dos ativos informados no capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoBonificacaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('OR', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 4.768 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PR', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 4.768 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PB', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 4.768 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '9.536')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '14.304')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '4.768')
        .should('be.visible')

    })

    it("Cadastrar o evento cisão II já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoCisaoIICapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', '').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos('OR', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.200 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PR', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.200 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PB', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.200 ').should('not.be.enabled')
        cy.contains(' PD ').should('be.visible').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos('PD', '93%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.345 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '2.200')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '8.945')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '6.745')
        .should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})