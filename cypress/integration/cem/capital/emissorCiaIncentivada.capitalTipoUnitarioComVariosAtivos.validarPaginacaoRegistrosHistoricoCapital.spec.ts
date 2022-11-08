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

describe('Tipo emissor Cia Incentivada com capital tipo unitario com vários ativos cadastrado - Validar a paginação dos registros no histórico capital após homologar os eventos', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoUnitario.json')

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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

            //cadastro capital emissor com capital tipo unitário
            capitalUtilitario.capitalUtilitarioApi().emissorSemCapitalSocialCadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoSemHomologar().criarNovoEventoSomarQuantidadeAtivosSemHomologarComVariosAtivosCapital(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoReducaoCapitalJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoAumentoCapitalJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoBonificacaoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoCisaoIIJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoConversaoAcoesJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoConversaoDebenturesJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoDesdobramentoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoGrupamentoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoIncorporacaoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoPlanoOpcaoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoSubscricaoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoReducaoCapitalJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoAumentoCapitalJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoBonificacaoJaHomologadoComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoConversaoAcoesJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)
            capitalNovoEventoUtilitario.capitalEventoApi().emissorSemCapitalSocialNovoEventoJaHomologado().criarNovoEventoConversaoDebenturesJaHomologadoUnitarioComVariosAtivos(capitalData.Emissor)

            cy.visit('')
            capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)
            capitalPage.historicoCapital().click()

        })

        it("Validar a paginação dos registros no histórico capital após homologar os eventos", function () {

            cy.get('mat-paginator').get('[class="mat-paginator-range-actions"]').within(() => {

                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 17 ')
                capitalPage.historicoCapitalModal().btnProximaPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 6 – 10 of 17 ')
                capitalPage.historicoCapitalModal().btnPrimeiraPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 17 ')
                capitalPage.historicoCapitalModal().btnUltimaPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 16 – 17 of 17 ')
                capitalPage.historicoCapitalModal().btnPaginaAnterior().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 11 – 15 of 17 ')
                capitalPage.historicoCapitalModal().btnPrimeiraPagina().click()
                capitalPage.historicoCapitalModal().contadorRegistroPagina(' 1 – 5 of 17 ')

            })

            capitalPage.historicoCapitalModal().btnFecharHistoricoCapital().click()

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})