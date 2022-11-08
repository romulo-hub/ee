/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"


describe('teste api setor atividade', () => {

    let id: number
    let level: number
    let cnae: string
    let description: string

    before(() => {

        cy.viewport(1366, 768)

    })

    it('POST', () => {

        level = 12
        cnae = 'cnae'
        description = 'post'
        cy.postCEM('sector', { "level": level, "cnae": cnae, "description": description }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.created)

            id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET - validar criação do setor', () => {

        cy.getCEM('sector/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.level).to.have.equal(level)
            expect(resp.body.cnae).to.have.equal(cnae)
            expect(resp.body.description).to.have.equal(description)

            cy.log(resp.body)
        })
    })

    it('PUT', () => {

        level = 12
        cnae = 'cnae put'
        description = 'put'
        cy.putCEM('sector', { "id": id, "level": level, "cnae": cnae, "description": description }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.accepted)

            cy.log(resp.body)
        })
    })

    it('GET ALL - validação do get all', () => {

        cy.getCEM('sector/getSectorByLevelList').then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.length).to.be.at.least(1)
    
            cy.log(resp.body)
        })
    })

    it('GET - validar atualização do setor', () => {

        cy.getCEM('sector/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.level).to.have.equal(level)
            expect(resp.body.cnae).to.have.equal(cnae)
            expect(resp.body.description).to.have.equal(description)

            cy.log(resp.body)
        })
    })

    it('DELETE', () => {

        cy.deleteCEM('sector', id).then(resp => {
            expect(resp.status).to.be.eq(EnumApi.noContent)

            cy.log(resp.body)
        })
    })

    it('GET validação do excluir', () => {

        cy.getCEM('sector/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })

})