///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumFormaEmissaoAtivo, EnumNivelEmissaoBDR, EnumTipoAtivo, EnumTipoTransferencia } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let idEmissor: number
let idTipoAtivo: number
let idFormaEmissao: number
let idEscriturador: number
let idEscrituradorAlterado: number
let idNivelEmissaoBDR: number
let idTipoTransferenciaAlterado: number
let qtdeBDR: string
let idTipoTransferencia: number
let bloqueioProcuracao: boolean
let idListaAtivoBDR: number
let idListaAtivoBDRAlterado: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor BDR - Cadastrar ativo BDR', () => {
    const ativoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    ativoEmissor.forEach((ativoData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            mercadoUtilitario = new MercadoUtilitarioApi()

            cy.getNextWorkingDayApi().as('next_wdate')

            emissorUtilitarioApi.criarEmissorBDRNP(ativoData.Emissor)
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

    it('PUT - Cadastrar ativo BDR', function () {

        idTipoAtivo = EnumTipoAtivo.bdr
        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idEscriturador = 26
        idTipoTransferencia = EnumTipoTransferencia.eletronico
        bloqueioProcuracao = true
        qtdeBDR = "1500"
        idNivelEmissaoBDR = EnumNivelEmissaoBDR.zero

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
                        "procurationBlockIndicator": bloqueioProcuracao,
                        "bdrParity": qtdeBDR,
                        "bdrLevelNumber": idNivelEmissaoBDR
                    }
                ]
            }).then(resp => {

                idListaAtivoBDR = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(1)

                cy.log(resp.body)

            })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo BDR cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoBDR).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoBDR)
            expect(resp.body).to.have.property('bdrParity', qtdeBDR)
            expect(resp.body).to.have.property('brdLevelDescription', "0")
            expect(resp.body).to.have.property('bdrLevelNumber', idNivelEmissaoBDR)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscriturador)
            expect(resp.body).to.have.property('shareAdministratorName', "ABRIL COMUNICACOES S.A.")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body).to.have.property('shareTypeDescription', "BDR")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferencia)
            expect(resp.body).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista BDR")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar o ativo BDR cadastrado', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('id', idListaAtivoBDR)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('bdrParity', qtdeBDR)
            expect(resp.body.issuerShares[0]).to.have.property('brdLevelDescription', "0")
            expect(resp.body.issuerShares[0]).to.have.property('bdrLevelNumber', idNivelEmissaoBDR)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body.issuerShares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorCode', idEscriturador)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorName', "ABRIL COMUNICACOES S.A.")
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeDescription', "BDR")
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeCode', idTipoTransferencia)
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.issuerShares[0].startDate.includes(this.next_wdate), "Escriturador desde da lista BDR")

            cy.log(resp.body)

        })
    })

    it('PUT - Alterar o ativo cadastrado', function () {

        idEscrituradorAlterado = 189
        idTipoTransferenciaAlterado = EnumTipoTransferencia.papel
        bloqueioProcuracao = false
        qtdeBDR = "1852"
        idNivelEmissaoBDR = EnumNivelEmissaoBDR.nivel1

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": idListaAtivoBDR,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissao,
                        "transferTypeCode": idTipoTransferenciaAlterado,
                        "shareAdministratorCode": idEscrituradorAlterado,
                        "procurationBlockIndicator": bloqueioProcuracao,
                        "bdrParity": qtdeBDR,
                        "bdrLevelNumber": idNivelEmissaoBDR
                    }
                ]
            }).then(resp => {

                idListaAtivoBDRAlterado = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(1)

                cy.log(resp.body)

            })
    })

    it('GET ID LISTA ATIVO - Consultar as alterações realizada no ativo cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoBDRAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoBDRAlterado)
            expect(resp.body).to.have.property('bdrParity', qtdeBDR)
            expect(resp.body).to.have.property('brdLevelDescription', "Nível 1 ")
            expect(resp.body).to.have.property('bdrLevelNumber', idNivelEmissaoBDR)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
            expect(resp.body).to.have.property('shareAdministratorName', "FRIGORIFICO FEIRA DE SANTANA SA-FRIFEIRA")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body).to.have.property('shareTypeDescription', "BDR")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAlterado)
            expect(resp.body).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista BDR")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar as alterações realizada no ativo cadastrado', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('id', idListaAtivoBDRAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('bdrParity', qtdeBDR)
            expect(resp.body.issuerShares[0]).to.have.property('brdLevelDescription', "Nível 1 ")
            expect(resp.body.issuerShares[0]).to.have.property('bdrLevelNumber', idNivelEmissaoBDR)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body.issuerShares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorName', "FRIGORIFICO FEIRA DE SANTANA SA-FRIFEIRA")
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeDescription', "BDR")
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeCode', idTipoTransferenciaAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.issuerShares[0].startDate.includes(this.next_wdate), "Escriturador desde da lista BDR")

            cy.log(resp.body)

        })
    })

    it('DELETE - Deletar o ativo que foi alterado', () => {

        cy.deleteCEM('issuerShare', idListaAtivoBDRAlterado).then(resp => {

            expect(resp.status).to.be.eq(EnumApi.noContent)

            cy.log(resp)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo alterado que foi excluído', function () {

        cy.getCEM('issuerShare/' + idListaAtivoBDRAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.notFound)
            assert.isTrue(resp.body.detail.includes("IssuerShare_GetById"), "Ativo BDR foi excluído, por isso lista vazio.")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar o ativo alterado que foi excluído', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property("issuerCode", idEmissor)
            expect(resp.body.issuerShares).to.be.length(0)

            cy.log(resp.body)

        })
    })

    after("Delete Created issuer", () => {
        cy.deleteCEM('issuer', idEmissor)
    })
})