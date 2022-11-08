/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market with Cia estrangeira', () => {
    const markets = require('../../../fixtures/mercado/mercado_CiaEstrangeira.json');

    //Required step to test with more than one data in json.
    markets.forEach((marketData: CemModel) => {

        before(() => {
            emissorUtilitario = new EmissorUtilitario()
            marketPage = new MercadoPage()
            sharedPage = new SharedPage()
            cy.getYesterdayDate().as('yesterday_date')
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')
        })

        beforeEach(() => {

            cy.visit('')

            cy.viewport(1366, 768)
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorCiaEstrangeiraApi(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()


        })

        it("Validate element's change when Situação do emissor is Listado", function () {

            marketPage.getSituaçaoEmissor()
                .selectOption('Listado')

            marketPage.getCategoriaCVM().within(() => {
                cy.contains('span', 'A').should('be.visible')
            })

            //Cadastrar dados            
            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)
            marketPage.getCategoriaB3()
                .selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)
            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)
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

            //Validar existencia de data em campo
            marketPage.getDataNegociaçaoSeparado()
              .should('have.value', '')


            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('not.exist')
            marketPage.getFimIsençaoFiscal()
                .should('not.exist')

            marketPage.getTipoMercado().selectOption('Balcão ex-Cetip')
        
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click()            

            marketPage.getTipoMercado().selectOption(marketData.Mercado.TipoMercado)


        })

        it("Validate element's change when Situação do emissor is Apenas Admitido à Negociação", function () {

            cy.wait(3000);
            //Situação do emissor: Apenas Admitido à Negociação.
            marketPage.getSituaçaoEmissor().selectOption('Apenas Admitido à Negociação')

            marketPage.getCategoriaCVM().within(() => {
                cy.contains('span', 'A').should('be.visible')
            })

            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)
            marketPage.getCategoriaB3()
                .selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)
            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)
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

            //Validar campos desabilitados
            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('not.be.visible')
            marketPage.getFimIsençaoFiscal()
                .should('not.be.visible')

            //Validar existencia de data no campo
            marketPage.getDataNegociaçaoSeparado()
                .should('have.value', '')

            //Validar se sistema desativa mercado de negociação ao selecionar Balcão ex-BVMF
            marketPage.getTipoMercado().selectOption('Balcão ex-Cetip')        
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click()  

            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)


        })

        it("Validate element's change when Situação do emissor is Depósito Exclusivo", function () {
           
            marketPage.getSituaçaoEmissor()
                .selectOption('Depósito Exclusivo')

            marketPage.getTipoMercado()
                .should('have.attr', 'aria-disabled', 'true')
                .and('contain.text','Depósito Exclusivo')

            marketPage.getCategoriaCVM().within(() => {
                cy.contains('span', 'A').should('be.visible')
            })

            marketPage.getCategoriaB3()
                .selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)


            //Setar dia seguinte no campo de data e validar erro.
            marketPage.getDataInicioSituaçao().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')
            marketPage.getDataCagoriaB3().type(this.next_wdate).blur()
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

            marketPage.getDataNegociaçaoSeparado()
                .should('be.disabled')

            marketPage.getNegociaçaoSeparado()
                .should('have.class', 'mat-select-disabled')
            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('not.exist')
            marketPage.getFimIsençaoFiscal()
            .should('not.exist')
            marketPage.getSegmentoNegociaçao()
                .should('have.class', 'mat-select-disabled')


        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer);
        })
    })
})