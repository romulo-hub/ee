/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page';
import SharedPage from '../pages/shared.page';
import CemModel from '../model/cem.model';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let sharedPage: SharedPage;

describe('Create new market Cia Incentivada', () => {
    const markets = require('../../../fixtures/mercado/mercado_CiaIncentivada.json');

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
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })

        it("Validate element's change when Situação do emissor is Listado", function () {

            //Verificar se traz Balcão ex-BVMF automaticamente
            marketPage.getTipoMercado().within(() => {
                cy.contains('span', 'Balcão ex-BVMF')
                    .should('be.visible')
            })

            //Verificar se traz Listado automaticamente
            marketPage.getSituaçaoEmissor().within(() => {
                cy.contains('span', 'Listado')
                    .should('be.visible')
            })

            //TODO: não é para ficar comentado, retiralo apos validar os outros campos
            marketPage.getCategoriaCVM().within(() => {
                cy.get('span',{timeout:15000}).should('contain.text','Outros')
                    .and('be.visible')
            })

            marketPage.getNegociaçaoSeparado()
            .should('have.attr', 'aria-disabled', 'true')
            marketPage.getCodigoCVM()
                .type(marketData.Mercado.CodigoCVM)
            

            //Validações  

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
            marketPage.getIsençaoFiscal()
                .should('have.class', 'mat-select-disabled')
            marketPage.getInicioIsençaoFiscal()
                .should('not.exist')
            marketPage.getFimIsençaoFiscal()
                .should('not.exist')
            marketPage.getSegmentoNegociaçao()
                .should('have.class', 'mat-select-disabled')
            marketPage.getDataSegmentoNegociaçao()
                .should('be.disabled')

            marketPage.addMercadoNegociaçao().click()
            cy.contains('Não Aplicável',{timeout:10000}).should('be.visible')
            marketPage.cancelarMercadoNegociaçao().click() 



        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer);
        })


    })
})