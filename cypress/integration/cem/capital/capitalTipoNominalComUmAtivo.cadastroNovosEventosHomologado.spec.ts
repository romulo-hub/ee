/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite, EmissorUtilitarioApi } from '../utilitarios/emissor.utilitario'
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

describe('Tipo emissor Outros Emissores com capital tipo nominal com um ativo cadastrado - Cadastrar novos eventos capital já homologado e validações dos valores capital conforme o evento cadastrado', () => {
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
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorOutrosEmissores(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

      //cadastro capital emissor com capital tipo nominal
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Cadastrar o evento aumento de capital sem emissão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoAumentoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 28.500,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '1.300')
        .should('be.visible')

    }) 

    it("Cadastrar o evento redução capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoReducaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.860').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '1.860')
        .should('be.visible')

    }) 

    it("Cadastrar o evento Conversão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoConversaoAcoesCapitalJaHomologado(capitalData.EventoCapital) 

      /* Intercepitando a requisição "http://pmatrd06101d:44311/api/v1/Capital/get-active/{issuerCode}"
      com o apelido "getActive" para ser usado no wait(alias) como tempo de espera */
      cy.intercept('GET', '**/get-active/*').as('getActive')

      capitalPage.capitalSocial().should('have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')

        /* Como o uso arbitrário de tempo wait(time) não é recomendado foi usado a forma wait(alias)
        em complemento com o método cy.intercept('GET', 'url').as('getActive') pois o DOM não estava 
        carregando a tempo para a validação "contains(' 2.160 ').should('not.be.enabled')"" */
        cy.wait('@getActive')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.160 ').should('not.be.enabled')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '2.160')
        .should('be.visible')

    })

    it("Cadastrar o evento conversão debêntures já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoConversaoDebenturesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 25.272,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('3.222').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')

    })

    it("Cadastrar o evento sobrescrever valor capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoSobrescreverValorCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 40.510,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')

    })

    it("Cadastrar o evento somar quantidade dos ativos informados no capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoBonificacaoCapitalJaHomologado(capitalData.EventoCapital)

      cy.intercept('GET', '**/get-active/*').as('getActive')

      capitalPage.capitalSocial().should('have.value', 'R$ 41.843,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        cy.wait('@getActive')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 4.768 ').should('not.be.enabled')

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.768')
        .should('be.visible')

    })

    it("Cadastrar o evento cisão II já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoCisaoIICapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 28.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
        cy.contains(' PA ').should('not.be.enabled').should('be.visible')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.200').should('not.be.enabled').should('be.visible')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.345 ').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PA ', '93%')

        cy.contains('PR').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.545')
        .should('be.visible')

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})