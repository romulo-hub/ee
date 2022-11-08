/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let emissorUtilitarioSite: EmissorUtilitarioSite;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market with Cia aberta', () => {
    const markets = require('../../../fixtures/mercado/mercado_CiaAberta.json');

    //Required step to test with more than one data in json.
    markets.forEach((marketData: CemModel) => {

        before(() => {
            emissorUtilitario = new EmissorUtilitario()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
            marketPage = new MercadoPage()
            sharedPage = new SharedPage()
            cy.getYesterdayDate().as('yesterday_date')
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')            
        })

        beforeEach(() => {

            cy.visit('')

            cy.viewport(1366, 768)
            
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })

        it("Validate element's change when Situação do emissor is Listado", function () {
            
            cy.wait(3000);
            
            

            marketPage.getSituaçaoEmissor()
                .selectOption('Listado')

            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)
            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)
            marketPage.getCategoriaCVM()
                .selectOption(marketData.Mercado.CategoriaCVM)
            marketPage.getIsençaoFiscal()
                .selectOption(marketData.Mercado.IsençaoFiscal)
            marketPage.getInicioIsençaoFiscal().click()
                .type(marketData.Mercado.InicioSituaçao)  

            marketPage.getFimIsençaoFiscal().should('have.value','31/12/2023')

            marketPage.getSegmentoNegociaçao()
                .selectOption(marketData.Mercado.SegmentoNegociaçao)

                        
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
            marketPage.getDataCategoriaCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
            marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')
            
            marketPage.getDataSegmentoNegociaçao().clear().click().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')
            marketPage.getDataNegociaçaoSeparado().clear().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //Validar se sistema desativa mercado de negociação ao selecionar Balcão ex-BVMF
            marketPage.getTipoMercado().selectOption('Balcão ex-Cetip')
            
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click()            

            marketPage.getTipoMercado().selectOption(marketData.Mercado.TipoMercado)

        })

        it("Validate element's change when Situação do emissor is Apenas Admitido à Negociação", function () {

            cy.wait(3000);            

            marketPage.getSituaçaoEmissor()
                .selectOption('Apenas Admitido à Negociação')

            marketPage.getTipoMercado()
                .selectOption('Bolsa')

            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)

            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)

            marketPage.getCategoriaCVM()
                .selectOption(marketData.Mercado.CategoriaCVM)

            marketPage.getIsençaoFiscal()
                .selectOption(marketData.Mercado.IsençaoFiscal)

            marketPage.getInicioIsençaoFiscal()
                .type(marketData.Mercado.InicioSituaçao)

            marketPage.getFimIsençaoFiscal().should('have.value','31/12/2023')

            marketPage.getSegmentoNegociaçao()
                .selectOption(marketData.Mercado.SegmentoNegociaçao)

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
            marketPage.getDataCategoriaCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
            marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            marketPage.getDataSegmentoNegociaçao().clear().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            marketPage.getDataNegociaçaoSeparado().clear().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

        })


        it("Validate element's change when Situação do emissor is Depósito Exclusivo", function () {
            cy.wait(3000);

            //Situação do emissor: Listado.
            marketPage.getTipoMercado()
                .selectOption('Depósito Exclusivo')
            marketPage.getSituaçaoEmissor()
                .selectOption('Depósito Exclusivo')


            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)
                
            marketPage.getCategoriaCVM()
                .selectOption(marketData.Mercado.CategoriaCVM)

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
            marketPage.getDataCategoriaCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
             marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
                 .should('have.attr', 'aria-invalid', 'true')
                 .clear().type(this.today_date).blur()
                 .should('have.attr', 'aria-invalid', 'false')

          
            marketPage.getDataSegmentoNegociaçao()
                .should('be.disabled')
            marketPage.getDataNegociaçaoSeparado()
                .should('be.disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('be.disabled')
            marketPage.getFimIsençaoFiscal()
                .should('be.disabled')
            marketPage.getNegociaçaoSeparado()
                .should('have.class', 'mat-select-disabled')
            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getSegmentoNegociaçao()
                .should('have.class', 'mat-select-disabled')



        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer);
        })
    })


})
