/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import EmissorPage from '../pages/emissor.page'

describe('Validar a formatação CNPJ no cadastro e alteração do registro desse emissor Cia Estrangeira', () => {
    const emissor = require('../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        let emissorPage: EmissorPage
        let emissorUtilitario: EmissorUtilitario
        let sharedPage: SharedPage
        let emissorCNPJAlterado = '40.677.618/0001-05'

        before(() => {
            cy.viewport(1366, 768)           

        })

        before(() => {

            emissorUtilitario = new EmissorUtilitario()
            sharedPage = new SharedPage()
            emissorPage = new EmissorPage()

            cy.visit('')

            sharedPage.menuCadastro()
            sharedPage.menuCadastroEmissor()
            sharedPage.novoEmissor().click()

            emissorUtilitario.criarEmissorCiaEstrangeira(emissorData.Emissor)

        })

        beforeEach(()=>{
            cy.visit('')
        })

        

        it("Validar a formatação CNPJ no cadastro do emissor com tipo Cia Estrangeira", () => {

            //cnpjPesquisa vai receber o CNPJ do emissor do JSON Emissor
            let cnpjPesquisa = emissorData.Emissor.CNPJ

            //colocar mascara CNPJ
            cnpjPesquisa = cnpjPesquisa.replace(/\D/g, '')
                .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, emissorData)
            emissorPage.emissorCNPJ().should('have.value', cnpjPesquisa)

        })

        it("Validar a formatação CNPJ na alteração do cadastro do emissor com tipo Cia Estrangeira", () => {

            //cnpjPesquisa vai receber o CNPJ do emissor do JSON Emissor
            let cnpjPesquisa = emissorData.Emissor.CNPJ

            //colocar mascara CNPJ
            cnpjPesquisa = cnpjPesquisa.replace(/\D/g, '')
                .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, emissorData)
            emissorPage.emissorCNPJ().should('have.value', cnpjPesquisa)
            emissorPage.emissorCNPJ().click().clear().type(emissorCNPJAlterado)
            emissorPage.alterarCadastroEmissor()
            emissorPage.emissorCNPJ().should('have.value', emissorCNPJAlterado)

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})