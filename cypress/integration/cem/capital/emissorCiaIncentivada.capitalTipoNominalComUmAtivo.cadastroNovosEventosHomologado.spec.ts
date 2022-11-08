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

describe('Tipo emissor Cia Incentivada com capital tipo nominal com um ativo cadastrado - Cadastrar novos eventos capital já homologado e validações dos valores capital conforme o evento cadastrado', () => {
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
      ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

      //cadastro capital emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Cadastrar o evento aumento de capital sem emissão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoAumentoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 2.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '1.300')
        .should('be.visible')

    })

    it("Cadastrar o evento redução capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoReducaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.860 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '1.860')
        .should('be.visible')

    })

    it("Cadastrar o evento Conversão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoAcoesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.160 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '2.160')
        .should('be.visible')

    })

    it("Cadastrar o evento conversão debêntures já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoDebenturesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('not.have.value', 'R$ 2.822,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 3.222 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')

    })

    it("Cadastrar o evento somar quantidade dos ativos informados no capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoBonificacaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', '').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 4.768 ').should('not.be.enabled')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.768')
        .should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})