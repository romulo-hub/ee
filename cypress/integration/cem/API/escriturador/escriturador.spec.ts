/// <reference types="Cypress" />

import { EnumApi } from "../../utilitarios/enum.utilitario"

describe('teste de api do ShareAdministrator', () => {

    let _id: number
    let nomeEscriturador: string
    let codigoCER: number
    let escrituradorCNPJ: string
    let nomeEscrituradorAlterado: string
    let buscaEscrituradorA

    beforeEach(() => {

        cy.viewport(1366, 768)

    })

    it('POST - Cadastrar o escriturador', () => {

        nomeEscriturador = 'erre dos santos S.A'
        codigoCER = 5789
        escrituradorCNPJ = "92593442000107"

        cy.postCEM('shareAdministrator', { 'name': nomeEscriturador, 'participantCode': codigoCER, 'documentNumber': escrituradorCNPJ }).then(resp => {
            expect(resp.status).to.equal(EnumApi.created)

            _id = resp.body.id

            cy.log(resp.body)
        })
    })

    it('GET - Consultar escriturador cadastrado', () => {

        cy.getCEM('shareAdministrator/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.success)
            expect(resp.body).to.have.property('name', nomeEscriturador)
            expect(resp.body).to.have.property('participantCode', codigoCER.toString())
            expect(resp.body).to.have.property('documentNumber', escrituradorCNPJ)

            cy.log(resp.body)
        })
    })

    it('GET ALL SEARCH QUERY - Busca escriturador cadastrado', () => {

        cy.getCEM('shareAdministrator?searchQuery=' + nomeEscriturador).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            assert.isTrue(resp.body.flatMap(i => i.name).some(i => i.includes(nomeEscriturador)), "Busca por nome escriturador já cadastrado no banco")
            expect(resp.body).to.be.length(1)

            cy.log(resp.body)
        })
    })

    it('GET ALL - Validar o escriturador cadastrado pelo page size e pelo page number, total de registros de escriturador cadastrado no banco', () => {

        cy.getCEM('shareAdministrator?pageNumber=1&pageSize=9999').then(resp => {

            buscaEscrituradorA = resp.body.filter(i => i.id == _id)

            expect(resp.status).to.have.equal(EnumApi.success)
            assert.isTrue(buscaEscrituradorA.some(i => i.name.trim().includes(nomeEscriturador)), "Busca por nome do escriturador cadastrado")
            expect(buscaEscrituradorA).to.be.length(1)

            cy.log(resp.body)
        })
    })


    it('PUT - Alterar o nome do escriturador', () => {

        nomeEscrituradorAlterado = 'carro voador da NASA S.A'

        cy.putCEM('shareAdministrator', { 'id': _id, 'name': nomeEscrituradorAlterado, 'participantCode': codigoCER, 'documentNumber': escrituradorCNPJ }).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.accepted)

            cy.log(resp.body)
        })
    })

    it('GET - Consultar alteração do escriturador', () => {

        cy.getCEM('shareAdministrator/' + _id).then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('name', nomeEscrituradorAlterado)
            expect(resp.body).to.have.property('documentNumber', escrituradorCNPJ)

            cy.log(resp.body)
        })
    })


    it('GET ALL SEARCH QUERY - Busca escriturador que foi alterado', () => {

        cy.getCEM('shareAdministrator?searchQuery=' + nomeEscrituradorAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            assert.isTrue(resp.body.flatMap(i => i.name).some(i => i.includes(nomeEscrituradorAlterado)), "Busca por nome escriturador já cadastrado no banco")
            expect(resp.body).to.be.length(1)

            cy.log(resp.body)
        })
    })

    it('GET ALL - Validar o escriturador alterado pelo page size e pelo page number, total de registros de escriturador cadastrado no banco', () => {

        cy.getCEM('shareAdministrator?pageNumber=1&pageSize=9999').then(resp => {

            buscaEscrituradorA = resp.body.filter(i => i.id == _id)

            expect(resp.status).to.have.equal(EnumApi.success)
            assert.isTrue(buscaEscrituradorA.some(i => i.name.trim().includes(nomeEscrituradorAlterado)), "Busca por nome do escriturador alterado")
            expect(buscaEscrituradorA).to.be.length(1)

            cy.log(resp.body)
        })
    })

    it('GET - Validar get by symbol starts with', () => {

        cy.getCEM('shareAdministrator/GetBySymbolStartsWith?request=carro').then(resp => {
            expect(resp.status).to.have.equal(EnumApi.success)
            assert.isTrue(resp.body.some(i => i.name.trim() == nomeEscrituradorAlterado),"Busca por nome do escriturador alterado")

            cy.log(resp.body)
        })
    })

    it('DELETE - Deletar escriturador que foi alterado', () => {

        cy.deleteCEM('shareAdministrator', _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.noContent)

            cy.log(resp.body)
        })
    })

    it('GET - Consultar que o escriturador cadastrado foi excluido', () => {
        cy.getCEM('shareAdministrator/' + _id).then(resp => {
            expect(resp.status).to.be.equal(EnumApi.notFound)

            cy.log(resp.body)
        })
    })

    it('GET ALL SEARCH QUERY - Validar que o escriturador foi excluido', () => {

        cy.getCEM('shareAdministrator?searchQuery=' + nomeEscrituradorAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.notFound)
            assert.isTrue(resp.body.detail.includes("ShareAdministrator_GetByFilter"), "escriturador cadastrado e alterado foi excluido, por isso nao foi localizado")

            cy.log(resp.body)
        })
    })
})