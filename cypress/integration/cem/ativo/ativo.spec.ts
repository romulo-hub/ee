/// <reference types="Cypress" />

/*import MercadoPage from '../pages/mercado.page';
import { AtivoPage } from '../pages/ativo.page';
import CemModel from '../model/cem.model';
import EmissorUtilitario from '../utilitarios/emissor.utilitario';

let emissorUtilitario: EmissorUtilitario;
let marketPage: MercadoPage;
let activePage: AtivoPage;

describe('Create new ativo', () => {
    const markets = require('../../../fixtures/ativo/ativo.json');

    //Required step to test with more than one data in json.
    markets.forEach((activeData: CemModel) => {

        beforeEach(() => {

            emissorUtilitario = new EmissorUtilitario()
            marketPage = new MercadoPage()
            activePage = new AtivoPage()

            cy.viewport(1366, 768)

        })

        it("Go to create issuer page", () => {
            cy.visit('')

            cy.contains('Emissores').click()

            cy.contains('Novo Emissor').click()
        })

        it("Put data to create issuer", () => {

            emissorUtilitario.criarEmissorCiaAberta(activeData.Emissor)

        })

        it("Post data to create market", () => {

            marketPage.criarMercado(activeData.Mercado)

            cy.contains('Dados de Mercado criado com sucesso', { timeout: 10000 }).should('be.visible')
        })


        it("Post data to create active", () => {

            activePage.addAtivo()
            activePage.setAtivos(activeData.Ativos)
            cy.contains('Ativo criado com sucesso', { timeout: 10000 }).should('be.visible')
        })

        


        it("Delete Created issuer", () => {



            cy.request({ method: 'GET', url: Cypress.env('cemApi') + "/api/v1/issuer?PageSize=9999" }).then((response) => {

                var issuer = response.body.find((i: any) =>
                    i.issuerDocument ===
                    parseInt(activeData.Emissor.CNPJ
                        .replace(/\D/g, "")
                    )
                    || i.issuerAcronym ===
                    activeData.Emissor.CodigoEmissor
                )

                if (issuer)
                    cy.request({ method: 'GET', url: Cypress.env('cemApi') + "/api/v1/market/" + issuer.id, failOnStatusCode: false }).then((response) => {
                        if (response.status == 200) {
                            cy.request({ method: 'DELETE', url: Cypress.env('cemApi') + '/api/v1/market/' + response.body.id, failOnStatusCode: false })
                            cy.request('DELETE', Cypress.env('cemApi') + '/api/v1/issuer/' + issuer.id)
                        } else {
                            cy.request('DELETE', Cypress.env('cemApi') + '/api/v1/issuer/' + issuer.id)
                            return
                        }
                    })




            })
        })


    })
})*/