/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import SharedPage from '../pages/shared.page'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import CapitalPage from '../pages/capital.page'
import CapitalNovoEventoPage from '../pages/eventoCapital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { CapitalEventoUtilitario } from '../utilitarios/eventoCapital.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalEventoPage: CapitalNovoEventoPage
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Aberta com capital tipo nominal com um ativo cadastrado - Validar a paginação dos registros no histórico capital após homologar os eventos', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

    //Required step to test with more than one data in json.
    capitalEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            capitalPage = new CapitalPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
            capitalEventoPage = new CapitalNovoEventoPage()
            capitalUtilitario = new CapitalUtilitario()
            ativoUtilitario = new AtivoUtilitarioSite()
            capitalNovoEventoUtilitario = new CapitalEventoUtilitario()
            mercadoUtilitario = new MercadoUtilitarioApi()

            //Armazenar datas necessarios para validações em testes.
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')

            //cadastro emissor       
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

            //cadastro capital emissor com capital tipo nominal
            capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComUmAtivoCadastrado(capitalData.Emissor)

            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoSemHomologar().criarNovoEventoCisaoISemHomologarComUmAtivo(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoReducaoCapitalComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoAumentoCapitalComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoBonificacaoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoCisaoIIComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoAcoesComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoDebenturesComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoDesdobramentoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoGrupamentoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoIncorporacaoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoPlanoOpcaoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoSubscricaoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoReducaoCapitalComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoAumentoCapitalComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoBonificacaoComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoCisaoIComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoCisaoIIComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoAcoesComUmAtivoJaHomologado(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().capitalNovoEventoJaHomologado().criarNovoEventoConversaoDebenturesComUmAtivoJaHomologado(capitalData.Emissor)

            cy.visit('')
            capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)
            capitalPage.historicoCapital().click()

        })

        it("Validar a paginação dos registros no histórico capital após homologar os eventos", function () {

            cy.get('mat-paginator').get('[class="mat-paginator-range-actions"]').within(() => {

                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 20 ')
                capitalPage.historicoCapitalModal().btnProximaPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 6 – 10 of 20 ')
                capitalPage.historicoCapitalModal().btnPrimeiraPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 20 ')
                capitalPage.historicoCapitalModal().btnUltimaPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 16 – 20 of 20 ')
                capitalPage.historicoCapitalModal().btnPaginaAnterior().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 11 – 15 of 20 ')
                capitalPage.historicoCapitalModal().btnPrimeiraPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 20 ')

            })

            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})