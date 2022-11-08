/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"

describe('teste de api do MarketType', () => {
    let _id: number

    it('POST', () => {
        let description = 'MarketTypeTest'

        cy.postCEM('marketType', { 'description': description }).then(resp => {
            expect(resp.status).to.equal(EnumApi.created)

            _id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET para validar o POST', () => {
        cy.getCEM('marketType/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.success)
            expect(resp.body.id).to.be.equal(_id)
            expect(resp.body.description).to.be.equal('MarketTypeTest')

            cy.log(resp.body)
        })
    })

    it('PUT', () => {
        let description = 'MarketTypeTestUpdate'

        cy.putCEM('marketType', { 'id': _id, 'description': description }).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.accepted);

            cy.log(resp.body)
        })
    })

    it('GET para validar o PUT', () => {
        cy.getCEM('marketType/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.success)
            expect(resp.body.id).to.be.equal(_id)
            expect(resp.body.description).to.be.equal('MarketTypeTestUpdate')

            cy.log(resp.body)
        })
    })

    it('DELETE', () => {
        cy.deleteCEM('marketType', _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.noContent)

            cy.log(resp.body)
        })
    })

    it('GET para validar que o DELETE funcionou', () => {
        cy.getCEM('marketType/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })
})