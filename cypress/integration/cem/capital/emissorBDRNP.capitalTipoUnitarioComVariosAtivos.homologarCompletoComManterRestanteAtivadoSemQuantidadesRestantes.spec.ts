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

describe('Tipo emissor BDR NP com capital tipo unitário com vários ativos cadastrado - Validar a mensagem de não permitir homologar completo com o manter restante ativado sem quantidades restantes pendente de homologação, consultar a grid EVENTOS A HOMOLOGAR e validar o capital cadastrado sem nenhuma alteração dos eventos que não foi homologado', () => {
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

            //cadastro capital emissor com tipo unitário
            capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

            cy.visit('')

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoConversaoDebenturesAHomologar(capitalData.EventoCapital)
            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologar(capitalData.EventoCapital)
            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoBonificacaoAHomologar(capitalData.EventoCapital)
            capitalPage.eventosAHomologar().click()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Homologar completo o evento Conversão Debêntures com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.emissorSemCapitalSocialHomologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoDebenturesComVariosAtivos(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão Debêntures ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão Debêntures ')

        })

        it("Homologar completo o evento Bonificação com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.emissorSemCapitalSocialHomologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoBonificaçãoComVariosAtivos(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Bonificação ')

        })

        it("Homologar completo o evento Conversão de ações com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.emissorSemCapitalSocialHomologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoAcoesComVariosAtivos(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')

            capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

        })

        it("Validar o capital cadastrado sem nenhuma alteração dos eventos que não foi homologado", () => {

            capitalPage.capitalSocial().should('have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should('not.have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should(($el) => { expect($el.val()).to.eq($el.val()) })
            cy.get('#resp-table-body').within(() => {

                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '82%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.000 ').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '92%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.480 ').should('not.be.enabled').should('be.visible')
                cy.contains('PB').should('be.visible').should('not.be.enabled')
                capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.000 ').should('not.be.enabled').should('be.visible')

                cy.contains('PR').should('be.visible').should('not.be.enabled')
                cy.contains('OR').should('be.visible').should('not.be.enabled')

            })

            capitalPage.quantidadeAtivosBDR()
                .should('not.be.focused')
                .should('have.value', '6.480')
                .should('be.visible')

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})