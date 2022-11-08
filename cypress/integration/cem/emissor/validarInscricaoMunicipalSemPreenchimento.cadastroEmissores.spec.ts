/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import EmissorPage from '../pages/emissor.page'

describe('Validar não obrigatoriedade da inscrição municipal no cadastro dos emissores', () => {
    const emissor = require('../../../fixtures/emissor/inscricaoMunicipalSemPreenchimento.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        let emissorPage: EmissorPage
        let emissorUtilitario: EmissorUtilitario
        let sharedPage: SharedPage

        before(() => {

            emissorUtilitario = new EmissorUtilitario()
            sharedPage = new SharedPage()
            emissorPage = new EmissorPage()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)
            cy.visit('')

            sharedPage.menuCadastro()
            sharedPage.menuCadastroEmissor()
            sharedPage.novoEmissor().click()

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor Cia Aberta", () => {

            emissorUtilitario.criarEmissorCiaAberta(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor Cia Estrangeira", () => {

            emissorUtilitario.criarEmissorCiaEstrangeira(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor Outros Emissores", () => {

            emissorUtilitario.criarEmissorOutrosEmissores(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor Disp.Reg. CVM", () => {

            emissorUtilitario.criarEmissorDispRegCVM(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor Cia Incentivada", () => {

            emissorUtilitario.criarEmissorCiaIncentivada(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        it("Validar não obrigatoriedade da inscrição municipal no cadastro do emissor BDR NP", () => {

            emissorUtilitario.criarEmissorBDRNP(emissorData.Emissor)
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, emissorData)

        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})