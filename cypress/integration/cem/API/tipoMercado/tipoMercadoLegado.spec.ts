/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"
import { DataUtilitario } from "../../utilitarios/data.utilitario"

describe('teste de api do MarketType no legado', () => {
    let _id: number

    it('POST', () => {
        let description = 'MarketTypeTest'

        cy.postCEM('marketType', { 'description': description }).then(resp => {
            expect(resp.status).to.equal(EnumApi.created)

            _id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET para validar POST no legado', () => {
        cy.getCEM('marketTypeLegacy/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.success)
            expect(resp.body.id).to.be.equal(_id)
            expect(resp.body.shortName).to.contain('MarketTypeTest')
            expect(resp.body.completeName).to.contain('MarketTypeTest')
            expect(resp.body.validityStart).to.be.equal(DataUtilitario.hoje())
            expect(resp.body.validityEnd).to.be.equal(DataUtilitario.fimDosTempos())

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

    it('GET para validar PUT no legado', () => {
        cy.getCEM('marketTypeLegacy/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.success)
            expect(resp.body.id).to.be.equal(_id)
            expect(resp.body.shortName).to.contain('MarketTypeTestUpdate')
            expect(resp.body.completeName).to.contain('MarketTypeTestUpdate')
            expect(resp.body.validityStart).to.be.equal(DataUtilitario.hoje())
            expect(resp.body.validityEnd).to.be.equal(DataUtilitario.fimDosTempos())

            cy.log(resp.body)
        })
    })

    it('DELETE', () => {
        cy.deleteCEM('marketType', _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.noContent)

            cy.log(resp.body)
        })
    })

    it('GET para validar DELETE no legado', () => {
        cy.getCEM('marketTypeLegacy/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })
})