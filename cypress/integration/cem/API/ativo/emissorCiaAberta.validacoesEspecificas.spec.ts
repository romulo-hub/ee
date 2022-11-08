///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumFormaEmissaoAtivo, EnumTipoAtivo, EnumTipoTransferencia } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let idEmissor: number
let idTipoAtivo: number
let idFormaEmissao: number
let idEscriturador: number
let idTipoTransferencia: number
let bloqueioProcuracao: boolean
let emissorUtilitarioApi: EmissorUtilitarioApi
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Validar a obrigatoriedade dos campos e a mensagem de duplicidade tipo ativo', () => {
    const ativoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    ativoEmissor.forEach((ativoData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            mercadoUtilitario = new MercadoUtilitarioApi()

            cy.getNextWorkingDayApi().as('next_wdate')

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(ativoData.Emissor)
            cy.getCEM('issuer?searchQuery=' + ativoData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })

            mercadoUtilitario.cadastroMercadoSituacaoListado(ativoData.Emissor)

        })
    })

    beforeEach(() => {

        cy.viewport(1366, 768)

    })

    it('PUT - Validar a obrigatoriedade tipo ativo', function () {

        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idEscriturador = 204
        idTipoTransferencia = EnumTipoTransferencia.eletronico
        bloqueioProcuracao = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": 0,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": idTipoTransferencia,
                        "shareAdministratorCode": idEscriturador,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.badRequest)

                assert.isTrue(resp.body.values.flatMap(i => i.item2).some(i => i.includes("Tipo de Negociação")), "Tipo de Negociação obrigatório")

                cy.log(resp.body)

            })
    })

    it('PUT - Validar a obrigatoriedade forma emissão', function () {

        idTipoAtivo = EnumTipoAtivo.ordinario
        idEscriturador = 204
        idTipoTransferencia = EnumTipoTransferencia.eletronico
        bloqueioProcuracao = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": 0,
                        "transferTypeCode": idTipoTransferencia,
                        "shareAdministratorCode": idEscriturador,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.badRequest)
                assert.isTrue(resp.body.values.flatMap(i => i.item2).some(i => i.includes("Forma de Emissão")), "Forma de Emissão obrigatório")

                cy.log(resp.body)

            })
    })

    it('PUT - Validar a obrigatoriedade tipo transferência', function () {

        idTipoAtivo = EnumTipoAtivo.ordinario
        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idEscriturador = 204
        bloqueioProcuracao = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": null,
                        "shareAdministratorCode": idEscriturador,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.badRequest)
                
                cy.log(resp.body)

            })
    })

    it('PUT - Validar a obrigatoriedade escriturador', function () {

        idTipoAtivo = EnumTipoAtivo.ordinario
        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idTipoTransferencia = EnumTipoTransferencia.eletronico
        bloqueioProcuracao = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": idTipoTransferencia,
                        "shareAdministratorCode": 0,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.conflict)
                assert.isTrue(resp.body.description.includes("Escriturador"), "Escriturador obrigatório")

                cy.log(resp.body)

            })
    })

    it('PUT - Validar a mensagem de duplicidade tipo ativo', function () {

        idTipoAtivo = EnumTipoAtivo.ordinario
        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idEscriturador = 204
        idTipoTransferencia = EnumTipoTransferencia.eletronico
        bloqueioProcuracao = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": idTipoTransferencia,
                        "shareAdministratorCode": idEscriturador,
                        "procurationBlockIndicator": bloqueioProcuracao
                    },
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": idTipoTransferencia,
                        "shareAdministratorCode": idEscriturador,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.conflict)
                assert.isTrue(resp.body.description.includes("Tipo do Ativo tem que ser único: " + idEmissor), "Duplicidade tipo ativo")

                cy.log(resp.body)

            })
    })

    after("Delete Created issuer", () => {
        cy.deleteCEM('issuer', idEmissor)
    })
})