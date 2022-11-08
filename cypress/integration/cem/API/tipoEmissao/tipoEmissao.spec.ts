/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"


describe('teste api issuer type', () => {

    let id: number
    
   
    before(() => {

        cy.viewport(1366, 768)

    })

    it('POST - Validar criação de um novo tipo de emissão', () => {

        let describe = 'testepost'
        cy.postCEM('issuingType', { "description": describe }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.created)

            id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET - validar a criação do tipo de emissão', () => {

        cy.getCEM('issuingType/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            
            cy.log(resp.body)
        })
    })

       it('PUT - Validar a alteração do nome do tipo de emissão', () => {

        let describe = 'testeput'
        cy.putCEM('issuingType/', { "id": id, "description": describe }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.accepted)

            cy.log(resp.body)
        })
    })

     it('DELETE - Validar exclusão do tipo de emissão', () => {

        cy.deleteCEM('issuingType', id).then(resp => {
            expect(resp.status).to.be.eq(EnumApi.noContent)

            cy.log(resp.body)
        })
    })

    it('GET - validação do excluir', () => {

        cy.getCEM('issuingType/' + id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })

})