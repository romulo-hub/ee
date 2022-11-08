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

describe('Tipo emissor Cia Aberta com capital tipo nominal com um ativo cadastrado - Validar a mensagem de não permitir homologar completo com o manter restante ativado sem quantidades restantes pendente de homologação, consultar a grid EVENTOS A HOMOLOGAR e validar o capital cadastrado sem nenhuma alteração dos eventos que não foi homologado', () => {
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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

            //cadastro capital emissor com tipo nominal
            capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

            cy.visit('')

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoDebenturesCapitalAHomologar(capitalData.EventoCapital)
            capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoConversaoAcoesCapitalAHomologar(capitalData.EventoCapital)
            capitalNovoEventoUtilitario.capitalNovoEventoSemHomologar().criarEventoBonificacaoAHomologar(capitalData.EventoCapital)
            capitalPage.eventosAHomologar().click()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Homologar completo o evento Conversão Debêntures com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.homologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoDebenturesComUmAtivo(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão Debêntures ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão Debêntures ')

        })

        it("Homologar completo o evento Bonificação com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {
            
            capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()
            capitalPage.eventosAHomologar().click()
            capitalNovoEventoUtilitario.homologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoBonificaçãoComUmAtivo(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Bonificação ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Bonificação ')

        })

        it("Homologar completo o evento Conversão de ações com o manter restante ativado sem quantidades restantes pendentes e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.homologarEventoPendentesCapital().homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoAcoesComUmAtivo(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()
            capitalNovoEventoUtilitario.detalhesGridEventoSemHomologar(' Conversão de ações ')
            capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(this.today_date)
            capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')

            capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

        })

        it("Validar o capital cadastrado sem nenhuma alteração dos eventos que não foi homologado", () => {

            capitalPage.capitalSocial().should('have.value', 'R$ 28.500,00').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
            cy.get('#resp-table-body').within(() => {

                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '96%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.300 ').should('not.be.enabled').should('be.visible')

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