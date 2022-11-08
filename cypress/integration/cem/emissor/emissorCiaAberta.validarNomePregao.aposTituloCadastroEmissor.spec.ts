/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import EmissorPage from '../pages/emissor.page'

describe('Validar o nome pregão após o título cadastro de emissor na inclusão e alteração do registro emissor Cia Aberta', () => {
    const emissor = require('../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        let emissorPage: EmissorPage
        let emissorUtilitario: EmissorUtilitario
        let sharedPage: SharedPage
        let emissorNomePregaoAlterado = 'TesteQA'
        let nomePregao = emissorData.Emissor.NomePregao

        //alterar o nome pregão para letra maiúsculo
        nomePregao = nomePregao.toUpperCase()

        before(() => {

            emissorUtilitario = new EmissorUtilitario()
            sharedPage = new SharedPage()
            emissorPage = new EmissorPage()

            cy.visit('')

            sharedPage.menuCadastro()
            sharedPage.menuCadastroEmissor()
            sharedPage.novoEmissor().click()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Cadastrar o emissor com tipo Cia Aberta e validar a exibição nome pregão após o título cadastro de emissor", () => {

            sharedPage.tituloNomePregaoAntesCadastro()
            emissorUtilitario.criarEmissorCiaAberta(emissorData.Emissor)
            sharedPage.tituloNomePregaoAposCadastro(nomePregao)

        })

        it("Alterar o nome pregão do emissor com tipo Cia Aberta e validar a exibição nome pregão após o título cadastro de emissor", () => {

            cy.visit('')
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, emissorData)
            sharedPage.subMenuEmissor()
            emissorPage.nomePregao().click().clear().type(emissorNomePregaoAlterado)
            emissorPage.alterarCadastroEmissor()
            sharedPage.tituloNomePregaoAposCadastro(emissorNomePregaoAlterado)

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})