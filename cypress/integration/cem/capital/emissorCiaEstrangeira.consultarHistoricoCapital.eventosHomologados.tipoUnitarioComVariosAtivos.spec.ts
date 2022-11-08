/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import SharedPage from '../pages/shared.page'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import CapitalPage from '../pages/capital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { CapitalEventoUtilitario } from '../utilitarios/eventoCapital.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Estrangeira com capital tipo unitário com vários ativos cadastrado - Validar as informações no histórico capital após cadastro do capital com o evento Capital Inicial e cadastros de outros eventos já homologados', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoUnitario.json')

    //Required step to test with more than one data in json.
    capitalEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            capitalPage = new CapitalPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
            capitalUtilitario = new CapitalUtilitario()
            ativoUtilitario = new AtivoUtilitarioSite()
            capitalNovoEventoUtilitario = new CapitalEventoUtilitario()
            mercadoUtilitario = new MercadoUtilitarioApi()

            //Armazenar datas necessarios para validações em testes.
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')

            //cadastro emissor       
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaEstrangeiraApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

            //cadastro capital emissor com capital tipo unitário
            capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoCisaoIUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoAumentoCapitalUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoReducaoCapitalUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoAcoesUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoDebenturesUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoCisaoIIUnitarioComVariosAtivosJaHomologado(capitalData.Emissor)

            cy.visit('')
            capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)
            capitalPage.historicoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Aumento de Capital já homologado", function () {
            
            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Aumento de Capital', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Aumento de Capital')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 42.960,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 8,59')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '1.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '4.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '5.000')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Aumento de Capital')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 42.960,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Redução de Capital já homologado", function () {

            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Redução de Capital', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Redução de Capital')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 22.450,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 4,02')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '1.860')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '3.720')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '5.580')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.860').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.860').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.860').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')
                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Redução de Capital')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 22.450,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Conversão de ações já homologado", function () {

            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Conversão de ações', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Conversão de ações')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 22.450,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 3,46')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '2.160')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '4.320')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '6.480')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.160').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.160').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.160').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Conversão de ações')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 22.450,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Conversão Debêntures já homologado", function () {

            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Conversão Debêntures', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Conversão Debêntures')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 25.272,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 2,61')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '3.222')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '6.444')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '9.666')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('3.222').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('3.222').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('3.222').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Conversão Debêntures')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 25.272,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Cisão I já homologado", function () {

            capitalPage.historicoCapitalModal().btnProximaPagina().click()
            cy.wait(800)
            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Cisão I', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Cisão I')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 40.510,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 8,10')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '1.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '4.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '5.000')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Cisão I')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 40.510,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })


        
        it("Validar os detalhes no histórico do capital após cadastro do capital com o evento Capital Inicial já homologado", function () {

            capitalPage.historicoCapitalModal().btnProximaPagina().click()
            cy.wait(800)
            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Capital Inicial', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Capital Inicial')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 30.000,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 6,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '1.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '4.000')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '5.000')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Capital Inicial')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 30.000,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        it("Validar os detalhes no histórico do capital após cadastro do evento Cisão II já homologado", function () {

            capitalNovoEventoUtilitario.consultarDetalhesHistoricoEventosHomologadosCapital().consultarDetalhesHistoricoEventosHomologadosCapital('Cisão II', '[id="btn_details_capital"]')
            cy.get('app-history-detail').get('[class="modal"]').within(() => {
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tituloTipoEventoHomologado('Cisão II')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataAprovacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().dataHomologacaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', this.today_date)
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().capitalSocialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 28.450,00')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().nominalUnitarioHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'Unitário')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().valorUnitAcaoHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', 'R$ 3,18')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosOrdinariaHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '2.200')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosPreferencialHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '6.745')
                capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeAtivosTotalHistoricoCapital().should('be.visible').should('not.be.focused').should('have.value', '8.945')
                cy.get('[class="mat-table cdk-table"]').within(() => {

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.200').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 92% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.200').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 82% ').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.345').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 90% ').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().quantidadeHistoricoCapital().contains('2.200').should('not.be.enabled').should('be.visible')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tagAlongHistoricoCapital(' 93% ').should('not.be.enabled')

                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' OR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' PR ').should('be.visible').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0H ').should('not.be.enabled')
                    capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().tipoAtivoHistoricoCapital(' 0B ').should('not.be.enabled')

                })
            })

            capitalPage.historicoCapitalModal().detalhesHistoricoCapitalModal().btnVoltarHistoricoCapital().click()
            capitalPage.historicoCapitalModal().dataAprovacaoHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.today_date)
            capitalPage.historicoCapitalModal().inicioVigenciaHistoricoCapital().should('not.be.enabled').should('be.visible').contains(this.next_wdate)
            capitalPage.historicoCapitalModal().tipoEventoHistoricoCapital().should('not.be.enabled').should('be.visible').contains('Cisão II')
            capitalPage.historicoCapitalModal().capitalSocialHistoricoCapital().should('not.be.enabled').should('be.visible').contains('R$ 28.450,00')
            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})