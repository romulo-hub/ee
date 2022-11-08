/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioApi, EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'

let emissorUtilitarioSite: EmissorUtilitarioSite
let sharedPage: SharedPage
let cnpjPesquisa
let nomePregaoPesquisa

describe('Consultar as informações do emissor cadastrado listado na busca emissores, Consultar o emissor já cadastrado por nome pregão, CNPJ e código do emissor', () => {
    const consultarEmissorCadastrado = require('../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    consultarEmissorCadastrado.forEach((consultarEmissorData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()

            //cnpjPesquisa vai receber o CNPJ do emissor do JSON Emissor
            cnpjPesquisa = consultarEmissorData.Emissor.CNPJ

            //colocar mascara CNPJ
            cnpjPesquisa = cnpjPesquisa.replace(/\D/g, '')
                .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

            //nomePregaoPesquisa vai receber o nome pregão do JSON Emissor
            nomePregaoPesquisa = consultarEmissorData.Emissor.NomePregao

            //alterar o nome pregão para letra maiúsculo
            nomePregaoPesquisa = nomePregaoPesquisa.toUpperCase()

            //cadastro emissor cia aberta
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(consultarEmissorData.Emissor)

        })

        beforeEach(() => {

            cy.visit('')
            cy.viewport(1366, 768)

        })

        it("Consultar as informações do emissor cadastrado listado na busca emissores", () => {

            sharedPage.menuCadastro()
            sharedPage.menuCadastroEmissor()
            sharedPage.buscaEmissores().type(consultarEmissorData.Emissor.CodigoEmissor)
            sharedPage.lupaPesquisaEmissores().click()
            sharedPage.codigoEmissorBuscaEmissores().contains(consultarEmissorData.Emissor.CodigoEmissor).should('be.visible')
            sharedPage.nomePregaoEmissorBuscaEmissores().contains(nomePregaoPesquisa).should('be.visible')
            sharedPage.emissorCNPJBuscaEmissores().contains(cnpjPesquisa).should('be.visible')
            sharedPage.razaoSocialEmissorBuscaEmissores().contains(consultarEmissorData.Emissor.RazaoSocial).should('be.visible')
            sharedPage.tipoEmissorBuscaEmissores().contains("Cia. Aberta").should('be.visible')

        })

        it("Validar a exibição do botão remover registro digitado na busca emissores", () => {

            sharedPage.menuCadastro()
            sharedPage.menuCadastroEmissor()
            sharedPage.deleteBtnBuscaEmissores().should('not.exist')
            sharedPage.buscaEmissores().type(consultarEmissorData.Emissor.CodigoEmissor)
            sharedPage.deleteBtnBuscaEmissores().should('be.visible').click()
            sharedPage.buscaEmissores().type(consultarEmissorData.Emissor.CodigoEmissor + '{Enter}')
            sharedPage.codigoEmissorBuscaEmissores().contains(consultarEmissorData.Emissor.CodigoEmissor).should('be.visible')

        })

        it("Consultar o cadastro do emissor cadastrado com tecla ENTER na busca", () => {

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, consultarEmissorData)

        })

        it("Consultar o cadastro por código do emissor sem tecla ENTER", () => {

            sharedPage.menuCadastro()
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, consultarEmissorData)

        })

        it("Consultar o cadastro por nome de pregão do emissor sem tecla ENTER", () => {

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarNomePregaoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, consultarEmissorData)

        })

        it("Consultar o cadastro por CNPJ do emissor sem tecla ENTER", () => {

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCNPJEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, consultarEmissorData)

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})