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

describe('Tipo emissor BDR NP com capital tipo nominal com um ativo cadastrado - Homologar completo o evento Subscrição, consultar a grid EVENTOS A HOMOLOGAR e validar as alterações do evento homologado no histórico e capital já cadastrado', () => {
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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorBDRNP(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoApenasAdmitidoANegociacao(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(capitalData.Emissor)

            //cadastro capital emissor com tipo nominal
            capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

            cy.visit('')
            capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

            capitalNovoEventoUtilitario.emissorSemCapitalSocialNovoEventoSemHomologar().criarEventoSubscricaoAHomologar(capitalData.EventoCapital)
            capitalPage.eventosAHomologar().click()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Homologar completo o evento Subscrição e consultar a grid EVENTOS A HOMOLOGAR", function () {

            capitalNovoEventoUtilitario.emissorSemCapitalSocialHomologarEventoPendentesCapital().homologarCompletoEventoSubscricaoNominalComUmAtivo(capitalData.EventoCapital)
            capitalEventoPage.gridEventosAHomologarModal().fecharGridEventosAHomologar()

        })

        it("Validar as alterações do evento Subscrição homologado completo no capital cadastrado", () => {

            capitalPage.capitalSocial().should('have.value', '').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.200,00').should('be.visible')
            cy.get('#resp-table-body').within(() => {

                capitalUtilitario.validarTagAlongGridAtivos(' PA ', '96%')
                cy.contains('PA').should('be.visible').should('not.be.enabled')
                cy.contains('3.460',{timeout:10000}).should('not.be.enabled').should('be.visible')
                

            })

            capitalPage.quantidadeAtivosPreferencial()
                .should('not.be.focused')
                .should('have.value', '3.460')
                .should('be.visible')

        })

        it("Validar os detalhes no histórico do capital após confirmar homologação completa do evento Subscricao", function () {

            capitalPage.historicoCapital().click()
            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Subscrição', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Subscrição')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 0,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Nominal')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 3.200,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '3.460')

                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('3.460').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 96% ').should('not.be.enabled').should('be.visible')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PA ').should('be.visible').should('not.be.enabled')

                })
            })
            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Subscrição')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains(' R$ 0,00 ')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})