/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market Dispensada REG CVM', () => {
    const markets = require('../../../fixtures/mercado/mercado_RegCvm.json');

    //Required step to test with more than one data in json.
    markets.forEach((marketData: CemModel) => {

        before(() => {
            emissorUtilitario = new EmissorUtilitario()
            marketPage = new MercadoPage()
            sharedPage = new SharedPage()

            //Armazenar datas necessarios para validações em testes.
            cy.getYesterdayDate().as('yesterday_date')
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')
        })

        beforeEach(() => {

            cy.visit('')

            cy.viewport(1366, 768)
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorDispRegCVM(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })

        it("Validate element's change when Situação do emissor is APENAS ADMITIDO À NEGOCIAÇÃO", function () {

            //Verificar se informações são dispostas na tela automaticamente
            marketPage.getTipoMercado().within(() => {
                cy.contains('span', 'Balcão ex-Cetip')
                    .should('be.visible')
            })
            marketPage.getSituaçaoEmissor().within(() => {
                cy.contains('span', 'Apenas Admitido à Negociação')
                    .should('be.visible')
            })

            marketPage.getCategoriaB3().within(() => {
                cy.contains('span', 'OUTROS')
                    .should('be.visible')
            })
            marketPage.getSegmentoNegociaçao().within(() => {
                cy.contains('span', 'Básico Balcão')
                    .should('be.visible')
            })
            
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click() 

            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)            

            //Setar dia seguinte no campo de data e validar erro.
            marketPage.getDataInicioSituaçao().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //Validar existencia de data dentro de campo
            marketPage.getDataNegociaçaoSeparado()
                .should('be.disabled')
            marketPage.getDataFimSituaçao()
                .should('be.disabled')
            marketPage.getDataRegistroCVM()
                .should('be.disabled')
            marketPage.getDataCagoriaB3()
                .should('be.disabled')
            marketPage.getDataSegmentoNegociaçao().
                should('be.disabled')
            marketPage.getDataCategoriaCVM()
                .should('be.disabled')

            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getNegociaçaoSeparado()
                .should('have.class', 'mat-select-disabled')
            marketPage.getCategoriaCVM()
                .should('have.class', 'mat-select-disabled')

            marketPage.getInicioIsençaoFiscal()
                .should('not.exist')
            marketPage.getFimIsençaoFiscal()
                .should('not.exist')

        })

       
        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer);
        })

    })
})