/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market Outros emissores', () => {
    const markets = require('../../../fixtures/mercado/mercado_OutrosEmissores.json');

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
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorOutrosEmissores(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })

        it("Validate element's change when Situação do emissor is LISTADO", function () {

            marketPage.getSituaçaoEmissor().selectOption('Listado')
            
            //Verificar se informações são dispostas na tela automaticamente  
            marketPage.getCategoriaCVM().within(() => {
                cy.get('span',{timeout:15000}).should('contain.text','Outros')
                    .and('be.visible')
            })
            //Validar se sistema desativa mercado de negociação ao selecionar Balcão ex-BVMF
            marketPage.getTipoMercado().selectOption('Balcão ex-Cetip')
            
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click() 

            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)
            marketPage.getCategoriaB3()
                .selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getSegmentoNegociaçao()
                .selectOption(marketData.Mercado.SegmentoNegociaçao)
            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)
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
            marketPage.getDataRegistroCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
            marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
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

        it("Validate element's change when Situação do emissor is APENAS ADMITIDO À NEGOCIAÇÃO", function () {

            marketPage.getSituaçaoEmissor().selectOption('Apenas Admitido à Negociação')

            //Verificar se informações são dispostas na tela automaticamente  
            marketPage.getCategoriaCVM().within(() => {
                cy.get('span',{timeout:15000}).should('contain.text','Outros')
                    .and('be.visible')
            })

            //Validar se sistema desativa mercado de negociação ao selecionar Balcão ex-BVMF
            marketPage.getTipoMercado().selectOption('Balcão ex-Cetip')
           
            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click() 

            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)
            marketPage.getCategoriaB3()
                .selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getSegmentoNegociaçao()
                .selectOption(marketData.Mercado.SegmentoNegociaçao)
            marketPage.getNegociaçaoSeparado()
                .selectOption(marketData.Mercado.NegociaçaoSeparado)
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
            marketPage.getDataRegistroCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
            marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
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

        it("Validate element's change when Situação do emissor is DEPÓSITO EXCLUSIVO", function () {

            marketPage.getSituaçaoEmissor().selectOption('Depósito Exclusivo')

            //Verificar se informações são dispostas na tela automaticamente  
            marketPage.getCategoriaCVM().within(() => {
                cy.get('span',{timeout:15000}).should('contain.text','Outros')
                    .and('be.visible')
            })

            marketPage.getTipoMercado()
                .selectOption(marketData.Mercado.TipoMercado)
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
            marketPage.getDataRegistroCVM().type(this.next_wdate).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            //setar dia anterior a inicio e validar erro
            marketPage.getDataFimSituaçao().type(this.yesterday_date).blur()
                .should('have.attr', 'aria-invalid', 'true')
                .clear().type(this.today_date).blur()
                .should('have.attr', 'aria-invalid', 'false')

            marketPage.getDataCategoriaCVM()
                .should('be.disabled')
            marketPage.getSegmentoNegociaçao()
                .should('have.attr', 'aria-disabled', 'true')
            marketPage.getNegociaçaoSeparado()
                .should('have.attr', 'aria-disabled', 'true')
            marketPage.getDataSegmentoNegociaçao()
                .should('be.disabled')
            marketPage.getDataNegociaçaoSeparado()
                .should('be.disabled')
            marketPage.getIsençaoFiscal()
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