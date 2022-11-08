/// <reference types="Cypress" />

import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import MercadoPage from '../pages/mercado.page'
import CemModel from '../model/cem.model'
import SharedPage from '../pages/shared.page'

let emissorUtilitario: EmissorUtilitario
let marketPage: MercadoPage
let sharedPage: SharedPage

describe('Cadastrar novo mercado emissor', () => {
    const mercado = require('../../../fixtures/mercado/mercado_Cadastro.json')

    //Required step to test with more than one data in json.
    mercado.forEach((marketData: CemModel) => {

        beforeEach(() => {

            sharedPage = new SharedPage()
            emissorUtilitario = new EmissorUtilitario()
            marketPage = new MercadoPage()
            
            cy.visit('')

            cy.viewport(1366, 768)
            
            emissorUtilitario.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(marketData.Emissor)

            sharedPage.menuCadastro()

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, marketData)

            sharedPage.subMenuMercado().click()

        })       

        it("Cadastrar o mercado do emissor", () => {

            sharedPage.subMenuMercado().click()

            marketPage.getTipoMercado().selectOption(marketData.Mercado.TipoMercado)
            marketPage.getSituaçaoEmissor().selectOption(marketData.Mercado.SituaçaoEmissor)
            marketPage.getNegociaçaoSeparado().selectOption(marketData.Mercado.NegociaçaoSeparado)
            marketPage.getCategoriaB3().selectOption(marketData.Mercado.CategoriaB3)
            marketPage.getSegmentoNegociaçao().selectOption(marketData.Mercado.SegmentoNegociaçao)
            marketPage.getCodigoCVM().type(marketData.Mercado.CodigoCVM)
            marketPage.getCategoriaCVM().selectOption(marketData.Mercado.CategoriaCVM)
            //marketPage.getIsençaoFiscal().selectOption(marketData.Mercado.IsençaoFiscal)
            marketPage.getDataInicioSituaçao().type(marketData.Mercado.InicioSituaçao)
            marketPage.getDataFimSituaçao().type(marketData.Mercado.FimSituaçao)
            //marketPage.getDataNegociaçaoSeparado().type(marketData.Mercado.DataNegociaçaoSeparado)
            marketPage.getDataCagoriaB3().type(marketData.Mercado.DataCategoriaB3)
            marketPage.getSegmentoNegociaçao().selectOption(marketData.Mercado.SegmentoNegociaçao)
            marketPage.getDataRegistroCVM().type(marketData.Mercado.DataRegistroCVM)
            marketPage.getDataCategoriaCVM().type(marketData.Mercado.DataCategoriaCVM)
            marketPage.getInicioIsençaoFiscal().click().type(marketData.Mercado.InicioIsençaoFiscal)
            marketPage.getFimIsençaoFiscal().click().type('30/12/2023')
            marketPage.setMercadoNegociaçao(marketData.Mercado.MercadoNegociaçao)   
            cy.get('[class="cdk-overlay-pane"]',{timeout:10000}).should('not.be.visible')        
            marketPage.salvar()
            cy.contains('Dados de Mercado criado com sucesso', { timeout: 10000 }).should('be.visible')
        
        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})