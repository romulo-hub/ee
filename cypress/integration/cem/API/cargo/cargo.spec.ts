/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"

describe('teste api representative position', () => {

    let id: number

    before(() => {

    })

    beforeEach(() => {

        cy.viewport(1366, 768)

    })

    ///

    it('POST - Criação do representative position com sucesso', () => {

        let description = 'Diretor Geral'
        cy.postCEM('RepresentativePosition', { "description": description }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.created)
            expect(resp.body.description).to.have.equal(description)
            id = resp.body.id
        })
    })

    it('GET ALL - Consulta do representative position com sucesso', () => {

        cy.getCEM('RepresentativePosition').then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.length).to.be.greaterThan(1)
        })
    })

    it('PUT - Alteração do representative position com sucesso', () => {

        let description = 'Banana'
        cy.putCEM('RepresentativePosition', { "id": id, "description": description }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.accepted)
            expect(resp.body.id).to.have.equal(id)
            expect(resp.body.description).to.have.equal(description)
        })
    })

    it('GET - Consulta do representative position com sucesso', () => {

        let description = 'Banana'
        cy.getCEM('RepresentativePosition/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.id).to.have.equal(id)
            expect(resp.body.description).to.have.equal(description)
        })
    })

    it('DELETE - Delete do representative position com sucesso', () => {

        cy.deleteCEM('RepresentativePosition', id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.noContent)
        })
    })

    it('GET - Consulta do representative position não encontrado', () => {

        cy.getCEM('RepresentativePosition/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.notFound)
        })
    })

})

