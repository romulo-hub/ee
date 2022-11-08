///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumFormaEmissaoAtivo, EnumTipoAtivo, EnumTipoEmissor, EnumTipoTransferencia } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let idEmissor: number
let idTipoAtivo: number
let idFormaEmissao: number
let idEscriturador: number
let idFormaEmissaoAlterado: number
let idEscrituradorAlterado: number
let idTipoTransferenciaAlterado: number
let idTipoTransferencia: number
let bloqueioProcuracao: boolean
let idListaAtivoOrdinario: number
let idListaAtivoAlterado: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Cadastrar ativo Ordinária', () => {
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

    it('PUT - Cadastrar ativo Ordinária', function () {

        idTipoAtivo = EnumTipoAtivo.ordinario
        idFormaEmissao = EnumFormaEmissaoAtivo.escritural
        idEscriturador = 164
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
                    }
                ]
            }).then(resp => {

                idListaAtivoOrdinario = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(1)

                cy.log(resp.body)

            })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo Ordinária cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoOrdinario).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoOrdinario)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscriturador)
            expect(resp.body).to.have.property('shareAdministratorName', "CIA CEARA TEXTIL")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferencia)
            expect(resp.body).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista Ordinária")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar o ativo Ordinária cadastrado', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('id', idListaAtivoOrdinario)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body.issuerShares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorCode', idEscriturador)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorName', "CIA CEARA TEXTIL")
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeCode', idTipoTransferencia)
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.issuerShares[0].startDate.includes(this.next_wdate), "Escriturador desde da lista Ordinária")

            cy.log(resp.body)

        })
    })

    it('PUT - Alterar o ativo cadastrado', function () {

        idFormaEmissaoAlterado = EnumFormaEmissaoAtivo.nominativa
        idEscrituradorAlterado = 176
        idTipoTransferenciaAlterado = EnumTipoTransferencia.papel
        bloqueioProcuracao = true

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": idListaAtivoOrdinario,
                        "shareTypeCode": idTipoAtivo,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissaoAlterado,
                        "transferTypeCode": idTipoTransferenciaAlterado,
                        "shareAdministratorCode": idEscrituradorAlterado,
                        "procurationBlockIndicator": bloqueioProcuracao
                    }
                ]
            }).then(resp => {

                idListaAtivoAlterado = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(1)

                cy.log(resp.body)

            })
    })

    it('GET ID LISTA ATIVO - Consultar as alterações realizada no ativo cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoAlterado)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAlterado)
            expect(resp.body).to.have.property('issuingTypeDescription', "Nominativa")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
            expect(resp.body).to.have.property('shareAdministratorName', "FAB DE PAPEL DA BAHIA S.A. - SAPELBA")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAlterado)
            expect(resp.body).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista Ordinária")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar as alterações realizada no ativo cadastrado', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('id', idListaAtivoAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeCode', idFormaEmissaoAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeDescription', "Nominativa")
            expect(resp.body.issuerShares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorName', "FAB DE PAPEL DA BAHIA S.A. - SAPELBA")
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeCode', idTipoAtivo)
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeCode', idTipoTransferenciaAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.issuerShares[0].startDate.includes(this.next_wdate), "Escriturador desde da lista Ordinária")

            cy.log(resp.body)

        })
    })

    it('DELETE - Deletar o ativo que foi alterado', () => {

        cy.deleteCEM('issuerShare', idListaAtivoAlterado).then(resp => {

            expect(resp.status).to.be.eq(EnumApi.noContent)

            cy.log(resp)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo alterado que foi excluído', function () {

        cy.getCEM('issuerShare/' + idListaAtivoAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.notFound)
            assert.isTrue(resp.body.detail.includes("IssuerShare_GetById"), "Ativo que foi alterado foi excluído, por isso lista vazio.")

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

    it('DELETE - Deletar ativo que não existe', () => {

        let idAtivoNaoExiste = 32767
        cy.deleteCEM('issuerShare', idAtivoNaoExiste).then(resp => {

            expect(resp.status).to.be.eq(EnumApi.notFound)
            assert.isTrue(resp.body.description.includes("Dados do Ativo não encontrado : " + idAtivoNaoExiste), "Ativo informado não existe")

            cy.log(resp)

        })
    })

    it('Consultar nivel de emissão BDR', () => {

        cy.getCEM('issuerShare/getAllBdrLevel').then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)

            cy.log(resp.body)

        })
    })

    it('Consultar tipo de transferência', () => {

        cy.getCEM('issuerShare/getAllTransferType').then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)

            cy.log(resp.body)

        })
    })

    it('Consultar tipo de emissor', () => {

        cy.getCEM('issuerShare/getAllShareType/' + EnumTipoEmissor.ciaAberta).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)

            cy.log(resp.body)

        })
    })

    after("Delete Created issuer", () => {
        cy.deleteCEM('issuer', idEmissor)
    })
})