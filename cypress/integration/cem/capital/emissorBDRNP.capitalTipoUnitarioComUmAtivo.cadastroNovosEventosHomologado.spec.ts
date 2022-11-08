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

describe('Tipo emissor BDR NP com capital tipo unitario com um ativo cadastrado - Cadastrar novos eventos capital já homologado e validações dos valores capital conforme o evento cadastrado', () => {
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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorBDRNP(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoApenasAdmitidoANegociacao(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(capitalData.Emissor)

            //cadastro capital emissor com capital tipo unitário
            capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoUnitarioComUmAtivoCadastrado(capitalData.Emissor)

            cy.visit('')
            capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Cadastrar o evento aumento de capital sem emissão de ações já homologado e validar as alterações no capital cadastrado", () => {

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoAumentoCapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('not.have.value', 'R$ 2.450,00').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '1.200')
                .should('be.visible')

        })

        it("Cadastrar o evento redução capital já homologado e validar as alterações no capital cadastrado", () => {

            cy.intercept('GET', '**/get-active/*').as('getActive')

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoReducaoCapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('not.have.value', 'R$ 22.450,00').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            cy.wait('@getActive')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.860 ').should('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')

                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })
            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '1.860')
                .should('be.visible')

        })

        it("Cadastrar o evento Conversão de ações já homologado e validar as alterações no capital cadastrado", () => {

            cy.intercept('GET', '**/get-active/*').as('getActive')

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoAcoesCapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            cy.wait('@getActive')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.860 ').should('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')

                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })

            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '1.860')
                .should('be.visible')

        })

        it("Cadastrar o evento conversão debêntures já homologado e validar as alterações no capital cadastrado", () => {

            cy.intercept('GET', '**/get-active/*').as('getActive')

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoConversaoDebenturesCapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('not.have.value', 'R$ 2.822,00').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            cy.wait('@getActive')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('be.visible').and('include.text','2.922').and('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')

                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })

            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '2.922')
                .should('be.visible')

        })

        it("Cadastrar o evento somar quantidade dos ativos informados no capital já homologado e validar as alterações no capital cadastrado", () => {

            cy.intercept('GET', '**/get-active/*').as('getActive')

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoBonificacaoCapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            cy.wait('@getActive')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('be.visible').and('include.text','4.468').and('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')

                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })

            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '4.468')
                .should('be.visible')

        })

        it("Cadastrar o evento cisão II já homologado e validar as alterações no capital cadastrado", () => {

            cy.intercept('GET', '**/get-active/*').as('getActive')

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoJaHomologado().criarEventoCisaoIICapitalJaHomologado(capitalData.EventoCapital)
            capitalPage.capitalSocial().should('have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })

            cy.wait('@getActive')
            cy.get('#resp-table-body').within(() => {

                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '98%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.200 ').should('not.be.enabled')
                cy.contains(' 0B ').should('be.visible').should('not.be.enabled')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.345 ').should('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' 0B ', '93%')

                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })

            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })
            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '4.545')
                .should('be.visible')               

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})