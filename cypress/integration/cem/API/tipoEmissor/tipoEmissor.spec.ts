/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"


describe('teste api issuer type', () => {

    let id: number
    let shortName: string
    let fullName: string
    let serviceTypeCode: number

    before(() => {

        cy.viewport(1366, 768)

    })

    it('POST', () => {

        shortName = 'NAKA'
        fullName = 'DANIELNAKA'
        serviceTypeCode = 44
        cy.postCEM('issuerType', { "shortName": shortName, "fullName": fullName, "serviceTypeCode": serviceTypeCode }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.created)

            id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET - validar criação do tipo de emissor', () => {

        cy.getCEM('issuerType/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.shortName).to.have.equal(shortName)
            expect(resp.body.fullName).to.have.equal(fullName)
            expect(resp.body.serviceTypeCode).to.have.equal(serviceTypeCode)

            cy.log(resp.body)
        })
    })

    it('GET - validar criação do tipo de emissor no legado', () => {

        cy.getCEM('issuerTypeLegacy/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.shortDescription.trim()).to.have.equal(shortName)
            expect(resp.body.description.trim()).to.have.equal(fullName)

            cy.log(resp.body)
        })
    })

    it('PUT', () => {

        shortName = 'NAKASAN'
        fullName = 'DANIELNAKASHIMA'
        serviceTypeCode = 44
        cy.putCEM('issuerType', { "id": id, "shortName": shortName, "fullName": fullName, "serviceTypeCode": serviceTypeCode }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.accepted)

            cy.log(resp.body)
        })
    })

    it('GET validação da atualização', () => {

        cy.getCEM('issuerType/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.shortName).to.have.equal(shortName)
            expect(resp.body.fullName).to.have.equal(fullName)
            expect(resp.body.serviceTypeCode).to.have.equal(serviceTypeCode)

            cy.log(resp.body)
        })
    })

    it('GET - validar atualização do tipo de emissor no legado', () => {

        cy.getCEM('issuerTypeLegacy/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.shortDescription.trim()).to.have.equal(shortName)
            expect(resp.body.description.trim()).to.have.equal(fullName)

            cy.log(resp.body)
        })
    })

    it('DELETE', () => {

        cy.deleteCEM('issuerType', id).then(resp => {
            expect(resp.status).to.be.eq(EnumApi.noContent)
            cy.log(resp.body)
        })
    })

    it('GET validação do excluir', () => {

        cy.getCEM('issuerType/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })

    it('GET validação do excluir no legado', () => {

        cy.getCEM('issuerTypeLegacy/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })
})