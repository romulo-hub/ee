import CapitalEventoPage from '../pages/eventoCapital.page'
import { NovoAtivoEventosCapital, EventoCapitalModel } from '../model/eventoCapital.model'
import CapitalPage from '../pages/capital.page'
import EmissorModel from "../model/emissor.model"
import { EnumTipoEventoCapital } from './enum.utilitario'
import { DataUtilitario } from './data.utilitario'
import { should } from 'chai'
const dayjs = require('dayjs');

let dateToday = dayjs().format('DD/MM/YYYY')
let dateTodayApi = dayjs().format()
let dateTodayShort = dayjs().format('D/M/YYYY')
let dataHoje = DataUtilitario.formatarDataHojeApi()
let capitalPage: CapitalPage
capitalPage = new CapitalPage()
let capitalEventoPage: CapitalEventoPage
capitalEventoPage = new CapitalEventoPage()
let idEmissor: number
let idTipoAtivoOrdinario: number
let idTipoAtivoPreferencial: number
let idNovoAtivo: number
let resgatavelAtivoOrdinario: boolean
let resgatavelAtivoPreferencial: boolean
let resgatavelNovoTipoAtivo: boolean
let tagAlongAtivoOrdinario: number
let tagAlongAtivoPreferencial: number
let tagAlongNovoAtivo: number
let qtdeAtivoOrdinarioEvento: number
let qtdeAtivoPreferencialEvento: number
let qtdeNovoAtivoEvento: number
let idTipoEventoCapital: number
let valorEventoCapital: number
let statusEventoCapital: boolean
let justificativaEventoCapital: string
let idNovoAtivoPreferencialEvento: number
let resgatavelAtivoPreferencialEvento: boolean
let tagAlongNovoAtivoPreferencialEvento: number
let qtdeNovoAtivoPreferencialEvento: number

export class CapitalEventoUtilitario {

    capitalEventoApi() {

        return new CapitalEventoUtilitarioApi()

    }

    capitalNovoEventoSemHomologar() {

        return new CapitalNovoEventoSemHomologar()

    }

    capitalEditarEventoSemHomologar() {

        return new EditarEventoCapitalSemHomologar()

    }

    emissorSemCapitalSocialEditarEventoSemHomologar() {

        return new EmissorSemCapitalSocialEditarEventoSemHomologar()

    }

    emissorSemCapitalSocialNovoEventoJaHomologado() {

        return new CapitalNovoEventoEmissorSemCapitalSocialJaHomologado()

    }

    capitalNovoEventoJaHomologado() {

        return new CapitalNovoEventoJaHomologado()

    }

    emissorSemCapitalSocialNovoEventoSemHomologar() {

        return new CapitalNovoEventoEmissorSemCapitalSocialSemHomologar()

    }

    consultarDetalhesHistoricoEventosHomologadosCapital() {

        return new DetalhesHistoricoEventosHomologadosCapital()

    }

    homologarEventoPendentesCapital() {

        return new HomologarEventosPendentesCapital()

    }

    emissorSemCapitalSocialHomologarEventoPendentesCapital() {

        return new HomologarEventosPendentesCapitalEmissorSemCapitalSocial()

    }

    alterarQtdeHomologadaAtivosEventoCapital(text, text2, text3) {

        cy.get('app-capital-homolog').get('[class="mat-row cdk-row ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]')
                .contains(text)
                .should("be.visible")

                .parent().within(() => {

                    cy.get('[id="shareClassQuantityHomologated"]').click().clear().type(text2).should('be.visible').should('have.value', text3)

                })
        })
    }

    alterarQtdeAtivosEventoCapital(text) {
        
        cy.get('app-capital-event-detail').within(() => {
                cy.get('[class="mat-cell cdk-cell table-column cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]')
                    .last().click().clear().type(text).should('be.visible')
        })
    }

    validarQtdeHomologadaAtivosEventoCapitalDesabilitado(text, text2) {

        cy.get('app-capital-homolog').get('[class="mat-row cdk-row ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]')
                .contains(text)
                .should("be.visible")

                .parent().within(() => {

                    cy.get('[id="shareClassQuantityHomologated"]').should('not.be.enabled').should('be.visible').should('have.value', text2)

                })
        })
    }

    validarTagAlongEventoCapital(text, text2) {

        cy.get('app-capital-event-detail').get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[class="mat-cell cdk-cell cdk-column-shareClassTypeAcronym mat-column-shareClassTypeAcronym ng-star-inserted"]')
                .within(() => {
                    cy.contains(text)
                        .should("be.visible")
                })

                .parents().within(() => {

                    //clicar na grid de ativos               
                    cy.get('[class="mat-cell cdk-cell table-column cdk-column-tagAlong mat-column-tagAlong ng-star-inserted"]').within(() => {
                        cy.get('input')
                            .should('be.visible').should('have.value', text2)
                    })
                })
        })
    }

    alterarFlagResgatavel() {

        cy.get('[id="modal-capitalEventDataSource"]').within(() => {

            cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]')
            capitalEventoPage.novoAtivoEventoCapitalModal().flagResgatavel()
                .get('[class="mat-slide-toggle-bar mat-slide-toggle-bar-no-side-margin"]').last().click()

        })
    }

    validarQuantidadeRestanteVariosAtivosHomologarEvento(text2) {

        cy.get('[id="shareClassQuantityRemainder"]').contains(text2).should('not.be.enabled').should('be.visible')

    }

    validarQuantidadeAprovadaVariosAtivosHomologarEvento(text2) {

        cy.get('[id="shareClassQuantityApproved"]').contains(text2).should('be.visible').should('not.be.enabled')

    }

    validarQuantidadeHomologadaVariosAtivosHomologarEvento() {

        return cy.get('[id="shareClassQuantityHomologated"]').should('be.enabled').should('be.visible')

    }

    removerUltimoNovoAtivoCadastradoNovoEventoCapital(text, button) {

        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[class="mat-cell cdk-cell cdk-column-shareClassTypeAcronym mat-column-shareClassTypeAcronym ng-star-inserted"]').contains(text)
                .should("be.visible")

            //remover o último ativo cadastrado na tela novo evento
            cy.get(button).last().click()
        })
    }

    removerUltimoRegistroCadastradoNovoEventoCapital(button) {

        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[class="mat-cell cdk-cell cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]').last()
                .should("be.visible")

            //remover o último registro cadastrado na tela novo evento
            cy.get(button).last().click()
        })
    }

    validarValorCapitalNaoHabilitado(text) {

        cy.get('[id="capitalPriceValue"]').should('have.value', text).should('not.be.enabled').should('be.visible')

    }

    validarValorCapitalHabilitado(text) {

        cy.get('[id="capitalPriceValue"]').should('have.value', text).should('be.enabled').should('be.visible')

    }

    selecionarEventoCapitalGridEventoSemHomologar(text, button, text2) {

        cy.get('[class="table-container ng-star-inserted"]').within(() => {
            cy.get('[id="capitalEventTypeDescription"]').contains(text)
                .should("be.visible")

                .parent().within(() => {
                    cy.get(button).contains(text2).click()
                })
        })
    }

    detalhesGridEventoSemHomologar(text) {

        cy.get('[class="table-container ng-star-inserted"]').parents().within(() => {
            cy.get('[class="mat-accordion mat-table-ac"]')

                .parents().within(() => {
                    cy.get('mat-expansion-panel').parents().within(() => {
                        cy.get('[id="capitalEventTypeDescription"]').contains(text)
                            .should("be.visible")
                    })
                })
        })
    }
}

export class DetalhesHistoricoEventosHomologadosCapital {

    // consultarDetalhesHistoricoEventosHomologadosCapital(text, button) {

    //     cy.get("app-history").within(()=>{
    //         cy.get('[class="mat-row cdk-row ng-star-inserted"]').within(() => {                
    //             cy.get('[id="row-eventType"]',{timeout:20000}).contains(text)
                    
    //                 //clicar no botão detahes do evento homologado
    //                 .parent().within(() => {
    //                     cy.get(button).click()
    //                 })
    //         })
    //     })
    // }

    consultarDetalhesHistoricoEventosHomologadosCapital(text, button) {

        cy.get("app-history",{timeout:20000})
        .get('[class="mat-row cdk-row ng-star-inserted"]')
        .get('[id="row-eventType"]',{timeout:20000}).contains(text)
        .parent().within(() => {
            cy.get(button).click()
        })         
    }

    consultarDetalhesHistoricoEventosHomologadosCapital_Evento(text, button) {

        cy.get('[class="mat-row cdk-row ng-star-inserted"]').within(() => {
            cy.get('[id="row-eventType"]').contains(text)

                //clicar no botão detahes do evento homologado
                .parent().within(() => {
                    cy.get(button).contains('info_outlined').click()
                })
        })
    }
}

export class EditarEventoCapitalSemHomologar {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    cancelarAlteracoesNaEdicaoEventoConversaoAcoesVariosAtivosCapital(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PB', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.200')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    }

    cancelarAlteracoesNaEdicaoEventoConversaoAcoesUmAtivoCapital(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.760 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.345 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarAtualizarEvento()   
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('have.value', 'R$ 28.500,00')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('OR', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    }

    editarEventoReducaoCapitalSemHomologar(capital: EventoCapitalModel) {

        capitalPage.eventosAHomologar().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('have.value', 'R$ 22.450,00')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().click().clear().type('26462').blur()
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.200')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.200')
        //capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().atualizarEventoSemHomologar()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().msgAtualizarEventoCapitalSemHomologarEmissor()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Redução de Capital ')
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital Final"]').should('have.value', 'R$ 26.462,00')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.200 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.200 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.100 ').should('be.visible')
        })
    }

    editarEventoAumentoCapitalSemHomologar(capital: EventoCapitalModel) {

        capitalPage.eventosAHomologar().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('have.value', '2.450,00')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().click().clear().type('3254')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().should('not.be.enabled').should('be.visible')
        this.capitalNovoEventoUtilitario().validarTagAlongEventoCapital('PR', '96')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().atualizarEventoSemHomologar()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().msgAtualizarEventoCapitalSemHomologarEmissor()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Aumento de Capital ')
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('have.value', 'R$ 3.254,00')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.300 ').should('be.visible')
        })
    }

    editarEventoConversaoAcoesSemHomologar(capital: EventoCapitalModel) {

        capitalPage.eventosAHomologar().click()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital"]').should('have.value', 'R$ 30.000,00')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PA ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.000 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.000 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.000 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.000 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PA')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('have.value', 'R$ 30.000,00')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PB', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.800')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.800')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.400')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        //capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().atualizarEventoSemHomologar()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().msgAtualizarEventoCapitalSemHomologarEmissor()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        //capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante"]').should('have.value', 'R$ 30.000,00')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.400 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.800 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 1.800 ').should('be.visible')
        })
    }
}

export class EmissorSemCapitalSocialEditarEventoSemHomologar {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    cancelarAlteracoesNaEdicaoEventoConversaoAcoesVariosAtivosCapital(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PB ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PB', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('1.200')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    }

    cancelarAlteracoesNaEdicaoEventoConversaoAcoesUmAtivoCapital(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão de ações ')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' 0H ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.345 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('0H')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('0H', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().cancelarEditarEventoSemHomologar()

    }

    editarEventoDesdobramentoSemHomologar(capital: EventoCapitalModel) {

        capitalPage.eventosAHomologar().click()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Desdobramento ')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital"]').should('not.be.enabled').should('have.value', 'R$ 0,00')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.260 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().capitalEventoValor().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEventoEditar().click().blur()
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.700')
        //capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().atualizarEventoSemHomologar()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().msgAtualizarEventoCapitalSemHomologarEmissor()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Desdobramento ')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Capital"]').should('not.be.enabled').should('have.value', 'R$ 0,00')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.700 ').should('be.visible')
        })
    }

    editarEventoConversaoDebenturesSemHomologar(capital: EventoCapitalModel) {

        capitalPage.eventosAHomologar().click()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão Debêntures ')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('not.be.enabled').should('have.value', 'R$ 0,00')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PC ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.160 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.345 ').should('be.visible')
        })
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarParcialCompleta()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PC')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().valorCapitalEvento().should('not.be.enabled').should('have.value', '')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.400')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.100')
        this.capitalNovoEventoUtilitario().alterarQtdeAtivosEventoCapital('2.200')
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().novoAtivoEventoCapitalModal().flagResgatavel().last().click()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().atualizarEventoSemHomologar()
        capitalEventoPage.gridEventosAHomologarModal().editarEventosSemHomologarModal().msgAtualizarEventoCapitalSemHomologarEmissor()
        capitalEventoPage.gridEventosAHomologarModal().dataAprovacaoEvento(dateToday)
        capitalEventoPage.gridEventosAHomologarModal().tipoEventoGridEventosAHomologar(' Conversão Debêntures ')
        capitalEventoPage.gridEventosAHomologarModal().detalhesEventosAhomologar()
        capitalEventoPage.gridEventosAHomologarModal().valorCapitalEvento('[placeholder="Montante Emitido"]').should('not.be.enabled').should('have.value', 'R$ 0,00')
        cy.get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {
            cy.get('[id="shareClassTypeAcronym"]').contains(' PR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' OR ').should('be.visible')
            cy.get('[id="shareClassTypeAcronym"]').contains(' PC ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.200 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.100 ').should('be.visible')
            cy.get('[id="shareClassQuantity"]').contains(' 2.400 ').should('be.visible')
        })
    }
}

export class CapitalNovoEventoJaHomologado {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    criarEventoAumentoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Aumento de Capital")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('2450')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoReducaoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Redução de Capital")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('22450')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSubscricaoJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Subscrição")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PR', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('OR', '[id="btn_delete"]')
        capitalEventoPage.valorCapital().type('300')
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PA')
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("30")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("100")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoCisaoIICapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Cisão II")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('28450')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2200")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Preferencial')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PA')
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("2345")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("93")
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoDebenturesCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão Debêntures")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('2822')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1062")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSobrescreverValorCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Cisão I")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('40510')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoBonificacaoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Bonificação")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().type('1333').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1546")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }
}

export class CapitalNovoEventoSemHomologar {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    criarEventoReducaoCapitalAHomologarExclusaoAtivosAnterioresAddNovoAtivo(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Redução de Capital")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        //capitalEventoPage.flagHomologado()
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PR', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('OR', '[id="btn_delete"]')
        capitalEventoPage.valorCapital().type('22.562')
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Ordinária')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PA')
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("82")
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("1.252")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoGrupamentoAHomologarComAddNovoAtivoTipoUnitarioUmAtivo(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Grupamento")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1.860")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PA')
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).last().click().type("2345").should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Preferencial')
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PA')
        this.capitalNovoEventoUtilitario().validarValorCapitalNaoHabilitado('R$ 30.000,00')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoAumentoCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Aumento de Capital")
        capitalEventoPage.valorCapital().should('be.enabled').type("2450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoCisaoIIAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Cisão II")
        capitalEventoPage.valorCapital().should('be.enabled').type("28450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoReducaoCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Redução de Capital")
        capitalEventoPage.valorCapital().should('be.enabled').type("22450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalAHomologarComAddNovoAtivoTipoUnitario(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1.000")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Ordinária')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PA')
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).last().click().type("2000").should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PA')
        capitalEventoPage.valorCapital().should('have.value', 'R$ 30.000,00').should('be.visible')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalAHomologarComAddNovoAtivoTipoNominalUmAtivo(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1.760")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('OR')
        this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).last().click().type("2345").should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoDebenturesCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão Debêntures")
        capitalEventoPage.valorCapital().should('be.enabled').type("2822")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1062")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSobrescreverValorCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Cisão I")
        capitalEventoPage.valorCapital().should('be.enabled').type("40510")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSomarQuantidadeAtivosCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Somar Qtde Ativos")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1546")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoAjusteAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Ajuste")
        capitalEventoPage.valorCapital().should('be.enabled').type("12450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1760")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoBonificacaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Bonificação")
        capitalEventoPage.valorCapital().should('be.enabled').type("12.214")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1560")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoExercicioDosBonusDeSubscricaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Exercício Subscrição")
        capitalEventoPage.valorCapital().should('be.enabled').type("26450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1960")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoGrupamentoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Grupamento")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoIncorporacaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Incorporação")
        capitalEventoPage.valorCapital().should('be.enabled').type("27450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1830")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoPlanoDeOpcaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Plano de Opção")
        capitalEventoPage.valorCapital().should('be.enabled').type("4450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoQuantidadeBDRNPAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Quantidade BDR NP")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('be.visible')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSubscricaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Subscrição")
        capitalEventoPage.valorCapital().should('be.enabled').type("22450")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }
}

export class CapitalNovoEventoEmissorSemCapitalSocialJaHomologado {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    criarEventoConversaoAcoesJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.dataAprovacao().click().type(dateToday).should('be.enabled')
        capitalEventoPage.dataAprovacao().should('have.value',dateToday)
        capitalEventoPage.flagHomologado()
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('PR', '[id="btn_delete"]')
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('OR', '[id="btn_delete"]')
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PF')
        this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("80")
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("2.672")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoAumentoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Aumento de Capital")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoReducaoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Redução de Capital")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.dataAprovacao().click().should("be.focused").type(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1860")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoDebenturesCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão Debêntures")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1062")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoBonificacaoCapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Bonificação")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("1546")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoCisaoIICapitalJaHomologado(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Cisão II")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2200")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Bdr')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('0B')
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("2345")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("93")
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }
}

export class CapitalNovoEventoEmissorSemCapitalSocialSemHomologar {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    criarEventoBonificacaoAHomologarExclusaoAtivosAnterioresAddNovoAtivo(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Bonificação")
        capitalEventoPage.dataAprovacao().setDataField(dateToday).should('be.enabled')
        //capitalEventoPage.flagHomologado()
        this.capitalNovoEventoUtilitario().removerUltimoNovoAtivoCadastradoNovoEventoCapital('OR', '[id="btn_delete"]')
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Preferencial')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PC')
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("92")
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).click().type("2.822")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoAumentoCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Aumento de Capital")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('0B')
        this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('0B')
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoDebenturesAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão Debêntures")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2.160")
        })
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().ativo().last().selectOption('Bdr')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PC')
        //this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).last().click().type("2345").should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PC')
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoDesdobramentoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Desdobramento")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        //capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2.260")
        })
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesComAddNovoAtivoCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.addNovoAtivo()
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('0H')
        this.capitalNovoEventoUtilitario().alterarFlagResgatavel()
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().last().each(($element, index, $list) => {
            cy.wrap($element).last().click().type("2345").should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97")
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('0H')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoAcoesCapitalAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoAjusteAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Ajuste")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoBonificacaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Bonificação")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoExercicioDosBonusSubscricaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Exercício Subscrição")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoGrupamentoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Grupamento")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoIncorporacaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Incorporação")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoPlanoDeOpcaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Plano de Opção")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoQuantidadeBDRNPAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Quantidade BDR NP")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSubscricaoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Subscrição")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        //capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoCisaoIAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Cisão I")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).should('not.be.enabled').should('be.visible')
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoCisaoIIAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Cisão II")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("2160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoSomarQuantidadeDeAtivosAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption(" Somar Qtde Ativos")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("4160")
        })
        capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().should('not.be.disabled')
        capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().should('not.be.disabled')
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }

    criarEventoConversaoDebenturesUmAtivoAHomologar(capital: EventoCapitalModel) {

        capitalPage.novoEvento().click()
        capitalEventoPage.tipoEvento().selectOption("Conversão Debêntures")
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
            cy.wrap($element).click().type("3.160")
        })
        capitalEventoPage.flagHomologado()
        capitalEventoPage.dataAprovacao().setDataField(dateToday)
        capitalEventoPage.valorCapital().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.salvarIncluirEventoCapital()
        capitalEventoPage.msgCadastroNovoEventoCapitalEmissor()

    }
}

export class HomologarEventosPendentesCapital {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoDebenturesComUmAtivo(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Conversão Debêntures ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Conversão Debêntures ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão Debêntures')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', 'R$ 2.822,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 2.822,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.062')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoAcoesComUmAtivo(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Conversão de ações ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Conversão de ações ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão de ações')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('0H').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', 'R$ 28.500,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 28.500,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoBonificaçãoComUmAtivo(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Bonificação ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Bonificação ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Bonificação')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', 'R$ 12.214,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 12.214,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.560')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarCompletoEventoReducaoCapitalExclusaoAtivosAnterioresAddNovoAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Redução de Capital')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().should('not.contain', 'OR')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().should('not.contain', 'PR')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PA').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 22.562,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('22.562').blur()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 22.562,00')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PA ', '1.252', '1.252')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.252')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarParcialManterRestanteDesativadoEventoConversaoDebenturesCapitalUnitarioComVariosAtivos(capital: EventoCapitalModel) {


        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão Debêntures')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 2.822,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('1.242,62').blur()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 1.579,38').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 1.242,62')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '400', '400')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '670', '670')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PB ', '850', '850')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('662')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('392')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('212')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.062')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.062')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.062')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoGrupamentoUnitarioUmAtivoComAddNovoAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Grupamento')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PA').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 30.000,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PA ', '2.345', '2.345')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.860', '1.860')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.345')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.860')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarParcialEventoPlanoDeOpcaoNominalComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Plano de Opção')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('2.152,23')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 4.450,00').should('not.be.enabled')
        //capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateTodayShort).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', '2.152,23')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '800', '800')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '1.420', '1.420')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('1.060')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('440')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.860')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.860')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 2.297,77').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()

    }

    homologarCompletoEventoBonificacaoUnitarioComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Bonificação')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 12.214,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('12.214').blur()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 12.214,00')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.560', '1.560')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '1.560', '1.560')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PB ', '1.560', '1.560')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.560')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.560')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.560')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoCisaoINominalComUmAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 40.510,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Cisão I')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 40.510,00').should('not.be.enabled')
        //capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('R$ 40.510,00')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.300')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoEditadoAumentoCapitalNominalComUmAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Aumento de Capital')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 3.254,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('3.254,00')
        //capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(tomorrowDay).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', '3.254,00')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.300')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoEditadoConversaoAcoesCapitalUnitarioComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão de ações')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 30.000,00').should('not.be.enabled')
        //capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 30.000,00')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.200', '1.200')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '1.500', '1.500')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PB ', '1.400', '1.400')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('200')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('300')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('400')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarParcialEventoEditadoReducaoCapitalCapitalUnitarioComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Redução de Capital')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('have.value', 'R$ 26.462,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().click().clear().type('16.222,12').blur()
        //capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 10.239,88').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('have.value', 'R$ 16.222,12')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '600', '600')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '1100', '1.100')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PB ', '1800', '1.800')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('600')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('1.100')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('300')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('1.200')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.200')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.100')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()

    }
}

export class HomologarEventosPendentesCapitalEmissorSemCapitalSocial {

    capitalNovoEventoUtilitario() {

        return new CapitalEventoUtilitario()

    }

    homologarCompletoEventoSomarQtdeAtivosExclusaoAtivosAnterioresAddNovoAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Bonificação')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().should('not.contain', 'OR')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PC').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PC ', '2.822', '2.822')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.822')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoEditadoConversaoDebenturesNominalComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão Debêntures')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PC').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '2.200', '2.200')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '2.100', '2.100')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PC ', '2.400', '2.400')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.400')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.200')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.100')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoEditadoDesdobramentoUnitarioComUmAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Desdobramento')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '2.700', '2.700')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.700')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoSomarQtdeAtivosUnitarioComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Somar Qtde Ativos')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('0H').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '4.160', '4.160')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '4.160', '4.160')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' 0H ', '4.160', '4.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('4.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarCompletoEventoSubscricaoNominalComUmAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Subscrição')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PA').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PA ', '2.160', '2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgEventoCapitalHomologado()
        capitalEventoPage.gridEventosAHomologarModal().msgNenhumEventosPendentesGridEventosAHomologar()

    }

    homologarParcialEventoGrupamentoUnitarioComVariosAtivos(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Grupamento')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.160', '1.160')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PR ', '760', '760')
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' PB ', '1.660', '1.660')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('1.400')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('500')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('1.000')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarParcialNaoPermitidaEmissorSemCapitalSocial()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoBonificaçãoComVariosAtivos(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Bonificação ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Bonificação ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Bonificação')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoAcoesComVariosAtivos(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Conversão de ações ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Conversão de ações ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão de ações')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarCompletoRestanteAtivadoSemQuantidadesRestantesEventoConversaoDebenturesComVariosAtivos(capital: EventoCapitalModel) {

        this.capitalNovoEventoUtilitario().detalhesGridEventoSemHomologar(' Conversão Debêntures ')
        this.capitalNovoEventoUtilitario().selecionarEventoCapitalGridEventoSemHomologar(' Conversão Debêntures ', '[id="btn_check"]', ' check_circle_outline')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Conversão Debêntures')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('PB').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().should('have.value', dateTodayShort).should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital().click()
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('0')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.160')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes()

    }

    homologarParcialEventoDesdobramentoUnitarioComUmAtivo(capital: EventoCapitalModel) {

        capitalEventoPage.gridEventosAHomologarModal().homologarParcialCompletaEventos()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tituloTipoEventoHomologar('Desdobramento')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataAprovacaoHomologar().should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().tipoAtivoHomologar().contains('OR').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().valorCapitalEventoHomologar().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteHomologado().should('not.be.enabled').should('have.value', '')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().dataHomologacao().type(dateToday).should('be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().montanteRestante().should('have.value', 'R$ 0,00').should('not.be.enabled')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().flagManterEventoAtivoCapital()
        this.capitalNovoEventoUtilitario().alterarQtdeHomologadaAtivosEventoCapital(' OR ', '1.100', '1.100')
        this.capitalNovoEventoUtilitario().validarQuantidadeRestanteVariosAtivosHomologarEvento('1.160')
        this.capitalNovoEventoUtilitario().validarQuantidadeAprovadaVariosAtivosHomologarEvento('2.260')
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().salvarHomologarEventoCapital()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().msgHomologarParcialNaoPermitidaEmissorSemCapitalSocial()
        capitalEventoPage.gridEventosAHomologarModal().homologarEventosPendentesModal().cancelarEventoSemHomologar().click()

    }
}

export class CapitalEventoUtilitarioApi {

    capitalNovoEventoJaHomologado() {

        return new CapitalNovoEventoJaHomologadoUtilitarioApi()

    }

    capitalNovoEventoSemHomologar() {

        return new CapitalNovoEventoSemHomologarUtilitarioApi()

    }

    emissorSemCapitalSocialNovoEventoSemHomologar() {

        return new CapitalNovoEventoSemHomologarEmissorSemCapitalSocialUtilitarioApi()

    }

    emissorSemCapitalSocialNovoEventoJaHomologado() {

        return new CapitalNovoEventoJaHomologadoEmissorSemCapitalSocialUtilitarioApi()

    }
}

export class CapitalNovoEventoJaHomologadoUtilitarioApi {

    criarNovoEventoReducaoCapitalComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 22450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoReducaoCapitalUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1860
                qtdeAtivoPreferencialEvento = 1860
                qtdeNovoAtivoEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 22450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoReducaoCapitalNominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1860
                qtdeAtivoPreferencialEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 22450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 2450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalNominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1760
                qtdeAtivoPreferencialEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 2450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1760
                qtdeAtivoPreferencialEvento = 1760
                qtdeNovoAtivoEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 2450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoBonificacaoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 4622
                idTipoEventoCapital = EnumTipoEventoCapital.bonificacao
                valorEventoCapital = 6231
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIIComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                idNovoAtivo = 8
                resgatavelAtivoPreferencial = true
                resgatavelNovoTipoAtivo = false
                tagAlongAtivoPreferencial = 98
                tagAlongNovoAtivo = 95
                qtdeAtivoPreferencialEvento = 2200
                qtdeNovoAtivoEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 28450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIINominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = 8
                resgatavelAtivoOrdinario = true
                resgatavelAtivoPreferencial = false
                resgatavelNovoTipoAtivo = true
                tagAlongAtivoOrdinario = 92
                tagAlongAtivoPreferencial = 82
                tagAlongNovoAtivo = 90
                qtdeAtivoOrdinarioEvento = 2200
                qtdeAtivoPreferencialEvento = 2200
                qtdeNovoAtivoEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 28450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIIUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                idNovoAtivoPreferencialEvento = 7
                resgatavelAtivoOrdinario = true
                resgatavelAtivoPreferencial = false
                resgatavelNovoTipoAtivo = true
                resgatavelAtivoPreferencialEvento = true
                tagAlongAtivoOrdinario = 92
                tagAlongAtivoPreferencial = 82
                tagAlongNovoAtivo = 90
                tagAlongNovoAtivoPreferencialEvento = 93
                qtdeAtivoOrdinarioEvento = 2200
                qtdeAtivoPreferencialEvento = 2200
                qtdeNovoAtivoEvento = 2200
                qtdeNovoAtivoPreferencialEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 28450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            },
                            {
                                "shareClassTypeCode": idNovoAtivoPreferencialEvento,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialEvento,
                                "shareClassQuantity": qtdeNovoAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongNovoAtivoPreferencialEvento
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoGrupamentoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 7544
                idTipoEventoCapital = EnumTipoEventoCapital.grupamento
                valorEventoCapital = 9211
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoPlanoOpcaoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 7433
                idTipoEventoCapital = EnumTipoEventoCapital.planoOpcao
                valorEventoCapital = 8766
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoDesdobramentoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 6862
                idTipoEventoCapital = EnumTipoEventoCapital.desdobramento
                valorEventoCapital = 3211
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    

    

    

    criarNovoEventoSubscricaoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 6700
                idTipoEventoCapital = EnumTipoEventoCapital.subscricao
                valorEventoCapital = 6432
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 2462
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2160
                qtdeAtivoPreferencialEvento = 2160
                qtdeNovoAtivoEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 2462
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesNominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2160
                qtdeAtivoPreferencialEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 2450
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 2822
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1062
                qtdeAtivoPreferencialEvento = 1062
                qtdeNovoAtivoEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 2822
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesNominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1062
                qtdeAtivoPreferencialEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 2822
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoIncorporacaoComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 4200
                idTipoEventoCapital = EnumTipoEventoCapital.incorporacao
                valorEventoCapital = 3452
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIComUmAtivoJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = resp.body.capitalShares[0].shareClassQuantity
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 40510
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIUnitarioComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 2102
                qtdeNovoAtivoEvento = 2102
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 40510
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoINominalComVariosAtivosJaHomologado(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 2102
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 40510
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }
}

export class CapitalNovoEventoSemHomologarUtilitarioApi {

    criarNovoEventoCisaoISemHomologarComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoPreferencial = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoPreferencial = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoPreferencial = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoPreferencialEvento = 2102
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 12354
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalSemHomologarComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 2454
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 56346
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAjusteSemHomologarComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 4343
                idTipoEventoCapital = EnumTipoEventoCapital.ajuste
                valorEventoCapital = 23456
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoBonificacaoSemHomologarComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 4343
                idTipoEventoCapital = EnumTipoEventoCapital.bonificacao
                valorEventoCapital = 34567
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoISemHomologarComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 4343
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 76545
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesSemHomologarComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2102
                qtdeAtivoPreferencialEvento = 4343
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 76453
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }
}

export class CapitalNovoEventoJaHomologadoEmissorSemCapitalSocialUtilitarioApi {

    criarNovoEventoReducaoCapitalJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1860
                qtdeAtivoPreferencialEvento = 1860
                qtdeNovoAtivoEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoReducaoCapitalJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1860
                qtdeAtivoPreferencialEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoReducaoCapitalJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1860
                idTipoEventoCapital = EnumTipoEventoCapital.reducaoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1760
                qtdeAtivoPreferencialEvento = 1760
                qtdeNovoAtivoEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1760
                qtdeAtivoPreferencialEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1760
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoBonificacaoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 4622
                qtdeAtivoPreferencialEvento = 4622
                qtdeNovoAtivoEvento = 4622
                idTipoEventoCapital = EnumTipoEventoCapital.bonificacao
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIIJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2200
                qtdeAtivoPreferencialEvento = 2200
                qtdeNovoAtivoEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIIJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = 8
                resgatavelAtivoOrdinario = true
                resgatavelAtivoPreferencial = false
                resgatavelNovoTipoAtivo = true
                tagAlongAtivoOrdinario = 92
                tagAlongAtivoPreferencial = 82
                tagAlongNovoAtivo = 93
                qtdeAtivoOrdinarioEvento = 2200
                qtdeAtivoPreferencialEvento = 2200
                qtdeNovoAtivoEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIIJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idNovoAtivo = 8
                resgatavelAtivoOrdinario = true
                resgatavelNovoTipoAtivo = true
                tagAlongAtivoOrdinario = 98
                tagAlongNovoAtivo = 92
                qtdeAtivoOrdinarioEvento = 2200
                qtdeNovoAtivoEvento = 2345
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoII
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoGrupamentoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 7544
                qtdeAtivoPreferencialEvento = 7544
                qtdeNovoAtivoEvento = 7544
                idTipoEventoCapital = EnumTipoEventoCapital.grupamento
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoPlanoOpcaoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 7433
                qtdeAtivoPreferencialEvento = 7433
                qtdeNovoAtivoEvento = 7433
                idTipoEventoCapital = EnumTipoEventoCapital.planoOpcao
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoDesdobramentoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 6862
                qtdeAtivoPreferencialEvento = 6862
                qtdeNovoAtivoEvento = 6862
                idTipoEventoCapital = EnumTipoEventoCapital.desdobramento
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    

    criarNovoEventoSubscricaoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 6700
                qtdeAtivoPreferencialEvento = 6700
                qtdeNovoAtivoEvento = 6700
                idTipoEventoCapital = EnumTipoEventoCapital.subscricao
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2160
                qtdeAtivoPreferencialEvento = 2160
                qtdeNovoAtivoEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2160
                qtdeAtivoPreferencialEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2160
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1062
                qtdeAtivoPreferencialEvento = 1062
                qtdeNovoAtivoEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1062
                qtdeAtivoPreferencialEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoDebenturesJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 1062
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoDebentures
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoIncorporacaoJaHomologadoComVariosAtivos(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 4200
                qtdeAtivoPreferencialEvento = 4200
                qtdeNovoAtivoEvento = 4200
                idTipoEventoCapital = EnumTipoEventoCapital.incorporacao
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoIJaHomologadoUnitarioComVariosAtivos(emissor: EmissorModel) {

        cy.getTokenApiAuth()
            .then(resp => {
                let token = resp.body.token
                cy.request({
                    headers: { Authorization: `bearer ${token}` },
                    method: 'GET',
                    url: Cypress.env('cemApi') + '/api/v1/issuer?searchQuery=' + emissor.CodigoEmissor,
                    failOnStatusCode: false
                }).then(resp => {
                    cy.request({
                        headers: { Authorization: `bearer ${token}` },
                        method: 'GET',
                        url: Cypress.env('cemApi') + '/api/v1/Capital/get-active/' + resp.body[0].id,
                        failOnStatusCode: false
                    }).then(resp => {
                        cy.request({
                            headers: { Authorization: `bearer ${token}` },
                            method: 'POST',
                            url: Cypress.env('cemApi') + '/api/v1/capitalEvent',
                            body:
                            {
                                "issuerCode": resp.body.issuerCode,
                                "capitalEventTypeCode": EnumTipoEventoCapital.cisaoI,
                                "capitalPriceValue": 0,
                                "homologateDate": dateTodayApi,
                                "approvalDate": dateTodayApi,
                                "capitalEventStatus": true,
                                "justificationDescripition": "string",
                                "capitalEventShares": [
                                    {
                                        "id": resp.body.capitalShareClassList[0].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[0].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[0].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[0].tagAlongPercentage
                                    },
                                    {
                                        "id": resp.body.capitalShareClassList[1].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[1].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[1].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[1].tagAlongPercentage
                                    },
                                    {
                                        "id": resp.body.capitalShareClassList[2].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[2].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[2].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[2].tagAlongPercentage
                                    }
                                ]
                            }
                        })
                    })
                })
                cy.log(resp.body)
            })
    }

    criarNovoEventoCisaoIJaHomologadoNominalComVariosAtivos(emissor: EmissorModel) {

        cy.getTokenApiAuth()
            .then(resp => {
                let token = resp.body.token
                cy.request({
                    headers: { Authorization: `bearer ${token}` },
                    method: 'GET',
                    url: Cypress.env('cemApi') + '/api/v1/issuer?searchQuery=' + emissor.CodigoEmissor,
                    failOnStatusCode: false
                }).then(resp => {
                    cy.request({
                        headers: { Authorization: `bearer ${token}` },
                        method: 'GET',
                        url: Cypress.env('cemApi') + '/api/v1/Capital/get-active/' + resp.body[0].id,
                        failOnStatusCode: false
                    }).then(resp => {
                        cy.request({
                            headers: { Authorization: `bearer ${token}` },
                            method: 'POST',
                            url: Cypress.env('cemApi') + '/api/v1/capitalEvent',
                            body:
                            {
                                "issuerCode": resp.body.issuerCode,
                                "capitalEventTypeCode": EnumTipoEventoCapital.cisaoI,
                                "capitalPriceValue": 0,
                                "homologateDate": dateTodayApi,
                                "approvalDate": dateTodayApi,
                                "capitalEventStatus": true,
                                "justificationDescripition": "string",
                                "capitalEventShares": [
                                    {
                                        "id": resp.body.capitalShareClassList[0].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[0].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[0].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[0].tagAlongPercentage
                                    },
                                    {
                                        "id": resp.body.capitalShareClassList[1].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[1].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[1].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[1].tagAlongPercentage
                                    }
                                ]
                            }
                        })
                    })
                })
                cy.log(resp.body)
            })
    }

    criarNovoEventoCisaoIJaHomologadoComUmAtivo(emissor: EmissorModel) {

        cy.getTokenApiAuth()
            .then(resp => {
                let token = resp.body.token
                cy.request({
                    headers: { Authorization: `bearer ${token}` },
                    method: 'GET',
                    url: Cypress.env('cemApi') + '/api/v1/issuer?searchQuery=' + emissor.CodigoEmissor,
                    failOnStatusCode: false
                }).then(resp => {
                    cy.request({
                        headers: { Authorization: `bearer ${token}` },
                        method: 'GET',
                        url: Cypress.env('cemApi') + '/api/v1/Capital/get-active/' + resp.body[0].id,
                        failOnStatusCode: false
                    }).then(resp => {
                        cy.request({
                            headers: { Authorization: `bearer ${token}` },
                            method: 'POST',
                            url: Cypress.env('cemApi') + '/api/v1/capitalEvent',
                            body:
                            {
                                "issuerCode": resp.body.issuerCode,
                                "capitalEventTypeCode": EnumTipoEventoCapital.cisaoI,
                                "capitalPriceValue": 0,
                                "homologateDate": dateTodayApi,
                                "approvalDate": dateTodayApi,
                                "capitalEventStatus": true,
                                "justificationDescripition": "string",
                                "capitalEventShares": [
                                    {
                                        "id": resp.body.capitalShareClassList[0].id,
                                        "shareClassTypeCode": resp.body.capitalShareClassList[0].shareClassTypeCode,
                                        "capitalShareRedemptionIndicator": resp.body.capitalShareClassList[0].capitalShareRedemptionIndicator,
                                        "shareClassQuantity": 2102,
                                        "tagAlongPercentage": resp.body.capitalShareClassList[0].tagAlongPercentage
                                    }
                                ]
                            }
                        })
                    })
                })
                cy.log(resp.body)
            })
    }
}

export class CapitalNovoEventoSemHomologarEmissorSemCapitalSocialUtilitarioApi {

    criarNovoEventoSomarQuantidadeAtivosSemHomologarComVariosAtivosCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                idTipoAtivoPreferencial = resp.body.capitalShares[1].shareClassTypeCode
                idNovoAtivo = resp.body.capitalShares[2].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                resgatavelAtivoPreferencial = resp.body.capitalShares[1].capitalShareRedemptionIndicator
                resgatavelNovoTipoAtivo = resp.body.capitalShares[2].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                tagAlongAtivoPreferencial = resp.body.capitalShares[1].tagAlongPercentage
                tagAlongNovoAtivo = resp.body.capitalShares[2].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 4160
                qtdeAtivoPreferencialEvento = 4160
                qtdeNovoAtivoEvento = 4160
                idTipoEventoCapital = EnumTipoEventoCapital.somarQtdesAtivos
                valorEventoCapital = 0
                statusEventoCapital = true
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            },
                            {
                                "shareClassTypeCode": idTipoAtivoPreferencial,
                                "capitalShareRedemptionIndicator": resgatavelAtivoPreferencial,
                                "shareClassQuantity": qtdeAtivoPreferencialEvento,
                                "tagAlongPercentage": tagAlongAtivoPreferencial
                            },
                            {
                                "shareClassTypeCode": idNovoAtivo,
                                "capitalShareRedemptionIndicator": resgatavelNovoTipoAtivo,
                                "shareClassQuantity": qtdeNovoAtivoEvento,
                                "tagAlongPercentage": tagAlongNovoAtivo
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoConversaoAcoesSemHomologarComUmAtivoCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 2982
                idTipoEventoCapital = EnumTipoEventoCapital.conversaoAcoes
                valorEventoCapital = 0
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAjusteSemHomologarComUmAtivoCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 8778
                idTipoEventoCapital = EnumTipoEventoCapital.ajuste
                valorEventoCapital = 0
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoBonificacaoSemHomologarComUmAtivoCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 3435
                idTipoEventoCapital = EnumTipoEventoCapital.bonificacao
                valorEventoCapital = 0
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoCisaoISemHomologarComUmAtivoCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 3452
                idTipoEventoCapital = EnumTipoEventoCapital.cisaoI
                valorEventoCapital = 0
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }

    criarNovoEventoAumentoCapitalSemHomologarComUmAtivoCapital(emissor: EmissorModel) {

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idTipoAtivoOrdinario = resp.body.capitalShares[0].shareClassTypeCode
                resgatavelAtivoOrdinario = resp.body.capitalShares[0].capitalShareRedemptionIndicator
                tagAlongAtivoOrdinario = resp.body.capitalShares[0].tagAlongPercentage
                qtdeAtivoOrdinarioEvento = 3435
                idTipoEventoCapital = EnumTipoEventoCapital.aumentoCapital
                valorEventoCapital = 0
                statusEventoCapital = false
                justificativaEventoCapital = "Teste"

                cy.log(resp.body)

            }).then(resp => {

                cy.postCEM('capitalEvent',
                    {
                        "issuerCode": idEmissor,
                        "capitalEventTypeCode": idTipoEventoCapital,
                        "capitalPriceValue": valorEventoCapital,
                        "approvalDate": dataHoje,
                        "capitalEventStatus": statusEventoCapital,
                        "justificationDescripition": justificativaEventoCapital,
                        "capitalEventShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinario,
                                "capitalShareRedemptionIndicator": resgatavelAtivoOrdinario,
                                "shareClassQuantity": qtdeAtivoOrdinarioEvento,
                                "tagAlongPercentage": tagAlongAtivoOrdinario
                            }
                        ]
                    })
            }).then(resp => {

                cy.log(resp.body)

            })
        })
    }
}

export default CapitalEventoUtilitario