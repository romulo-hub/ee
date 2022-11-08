/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'

describe('Cadastrar novos emissores', () => {
    const emissor = require('../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        let emissorUtilitario: EmissorUtilitario
        let sharedPage: SharedPage

        before(() => {

            emissorUtilitario = new EmissorUtilitario()
            sharedPage = new SharedPage()

            cy.visit('')
            sharedPage.menuCadastro()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)
            sharedPage.menuCadastroEmissor()
            sharedPage.novoEmissor().click()

        })

        it("Cadastrar o emissor com tipo BDR NP", () => {

            emissorUtilitario.criarEmissorBDRNP(emissorData.Emissor)

        }) 

        it("Cadastrar o emissor com tipo Cia Aberta", () => {

            emissorUtilitario.criarEmissorCiaAberta(emissorData.Emissor)

        })

        it("Cadastrar o emissor com tipo Cia Estrangeira", () => {

            emissorUtilitario.criarEmissorCiaEstrangeira(emissorData.Emissor)

        })

        it("Cadastrar o emissor com tipo Cia Incentivada", () => {

            emissorUtilitario.criarEmissorCiaIncentivada(emissorData.Emissor)

        }) 

        it("Cadastrar o emissor com tipo Outros Emissores", () => {

            emissorUtilitario.criarEmissorOutrosEmissores(emissorData.Emissor)

        })

        it("Cadastrar o emissor com tipo Disp. Reg. CVM", () => {

            emissorUtilitario.criarEmissorDispRegCVM(emissorData.Emissor)

        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})