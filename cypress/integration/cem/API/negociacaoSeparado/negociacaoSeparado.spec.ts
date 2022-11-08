/// <reference types="Cypress" />

describe('teste api condition type', () => {

    let id: number

    before(() => {

    })

    beforeEach(() => {

        cy.viewport(1366, 768)

    })

    ///
    it.skip("Post negociação separado", () => {

        cy.getTokenApiAuth()
            .then(resp => {
                let token = resp.body.token
                cy.request({
                    headers: { Authorization: `bearer ${token}` },
                    method: 'POST',
                    url: Cypress.env('cemApi') + '/api/v1/conditionType',
                    failOnStatusCode: false,
                    body: {
                        "description": "Teste III"
                    }

                }).then(resp => {

                    expect(resp.isOkStatusCode).true,
                        cy.log(resp.body)

                })
                cy.log(resp.body)
            })
    })

    it('POST', () => {

        let describe = 'AAAAA'
        cy.postCEM('conditionType', { "description": describe }).then(resp => {
            expect(resp.body.description).to.have.equal(describe)
            id = resp.body.id
        })
    })

    it('PUT', () => {

        let describe = 'DDDD'
        cy.putCEM('conditionType', { "id": id, "description": describe }).then(resp => {
            expect(resp.body.description).to.have.equal(describe)
        })
    })

    it('GET', () => {

        let describe = 'DDDD'
        cy.getCEM('conditionType/' + id).then(resp => {
            expect(resp.body.description).to.have.equal(describe)
        })
    })

    it('DELETE', () => {

        cy.deleteCEM('conditionType', id).then(resp => {
            expect(resp.status).to.be.eq(204)
        })
    })
})