/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market BDR', () => {
    const markets = require('../../../fixtures/mercado/mercado_Bdr.json');

    //Required step to test with more than one data in json.
    markets.forEach((marketData: CemModel) => {

        before(() => {
            emissorUtilitario = new EmissorUtilitario()
            marketPage = new MercadoPage()
            sharedPage = new SharedPage()

            //Armazenar datas necessarios para validações em testes.
            cy.getDate(-1).as('yesterday_date')
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')
        })

        beforeEach(() => {

            cy.visit('')

            cy.viewport(1366, 768)
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorBDRNP(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })

        it("Validate element's change when Situação do emissor is APENAS ADMITIDO À NEGOCIAÇÃO", function () {

            cy.wait(3000);

            const matOptionDisabled = ($opt: JQuery<HTMLElement>) =>{
                expect($opt).to.have.attr('aria-disabled');
            }

            sharedPage.subMenuMercado().click()

            

            //Verificar se informações são dispostas na tela automaticamente            
            marketPage.getTipoMercado().within(() => {
                cy.contains('Bolsa')
                    .should('be.visible')
            })
            marketPage.getSituaçaoEmissor().within(() => {
                cy.contains('span', 'Apenas Admitido à Negociação')
                    .should('be.visible')
            })  

            marketPage.getSegmentoNegociaçao().within(() => {
                cy.contains('span', 'Básico Bolsa')
                    .should('be.visible')
            })
            marketPage.getCategoriaCVM().within(() => {
                cy.contains('span', 'OUTROS')
                    .should('be.visible')
            })

            marketPage.getCategoriaB3().selectOption(marketData.Mercado.CategoriaB3)

            marketPage.getNegociaçaoSeparado().selectOption(marketData.Mercado.NegociaçaoSeparado)

            marketPage.getCodigoCVM().type(marketData.Mercado.CodigoCVM)

            marketPage.getIsençaoFiscal().should(matOptionDisabled)
                
            marketPage.getInicioIsençaoFiscal().should('be.not.be.visible')

            marketPage.getFimIsençaoFiscal().should('be.not.be.visible')

            //Setar dia seguinte no campo de data e validar erro.
            marketPage.getDataInicioSituaçao().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')
            marketPage.getDataCagoriaB3().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')
            marketPage.getDataRegistroCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            marketPage.getDataSegmentoNegociaçao().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //Validar existencia de data dentro de campo
            marketPage.getDataNegociaçaoSeparado()
                .should('have.value', '')
            marketPage.getDataCategoriaCVM()
                .should('be.disabled')
            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('not.exist')
            marketPage.getFimIsençaoFiscal()
                .should('not.exist')

            
        })

        after("Delete Created issuer", () => {
            cy.url().then(url => {
                cy.deleteIssuer(url);
            })
        })

    })
})