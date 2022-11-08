///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumFormaEmissaoAtivo, EnumTipoAtivo, EnumTipoTransferencia } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let idEmissor: number
let idTipoAtivoOrdinario: number
let idFormaEmissaoAtivoOrdinario: number
let idEscrituradorAtivoOrdinario: number
let idTipoTransferenciaAtivoOrdinario: number
let bloqueioProcuracaoAtivoOrdinario: boolean
let idListaAtivoOrdinario: number
let idListaAtivoPreferencialAlterado: number
let idFormaEmissaoAtivoPreferencial: number
let idEscrituradorAtivoPreferencial: number
let idTipoTransferenciaAtivoPreferencial: number
let bloqueioProcuracaoAtivoPreferencial: boolean
let idListaAtivoPreferencial: number
let idListaAtivoOrdinarioAlterado: number
let idTipoAtivoPreferencial: number
let idFormaEmissaoAtivoPreferencialAlterado: number
let idEscrituradorAtivoPreferencialAlterado: number
let idTipoTransferenciaAtivoPreferencialAlterado: number
let bloqueioProcuracaoAtivoPreferencialAlterado: boolean
let idFormaEmissaoAtivoOrdinarioAlterado: number
let idEscrituradorAtivoOrdinarioAlterado: number
let idTipoTransferenciaAtivoOrdinarioAlterado: number
let bloqueioProcuracaoAtivoOrdinarioAlterado: boolean
let emissorUtilitarioApi: EmissorUtilitarioApi
let buscaListaAtivoOrdinario: any
let buscaListaAtivoPreferencial: any
let buscaListaAtivoOrdinarioAlterado: any
let buscaListaAtivoPreferencialAlterado: any
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Outros Emissores - Cadastrar ativo ordinária e ativo preferencial', () => {
    const ativoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    ativoEmissor.forEach((ativoData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            mercadoUtilitario = new MercadoUtilitarioApi()

            cy.getNextWorkingDayApi().as('next_wdate')

            emissorUtilitarioApi.criarEmissorOutrosEmissores(ativoData.Emissor)
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

    it('PUT - Cadastrar ativo ordinária e ativo preferencial', function () {

        idTipoAtivoOrdinario = EnumTipoAtivo.ordinario
        idFormaEmissaoAtivoOrdinario = EnumFormaEmissaoAtivo.escritural
        idEscrituradorAtivoOrdinario = 164
        idTipoTransferenciaAtivoOrdinario = EnumTipoTransferencia.eletronico
        bloqueioProcuracaoAtivoOrdinario = false
        idTipoAtivoPreferencial = EnumTipoAtivo.preferencial
        idFormaEmissaoAtivoPreferencial = EnumFormaEmissaoAtivo.nominativa
        idEscrituradorAtivoPreferencial = 203
        idTipoTransferenciaAtivoPreferencial = EnumTipoTransferencia.papel
        bloqueioProcuracaoAtivoPreferencial = true

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivoOrdinario,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissaoAtivoOrdinario,
                        "transferTypeCode": idTipoTransferenciaAtivoOrdinario,
                        "shareAdministratorCode": idEscrituradorAtivoOrdinario,
                        "procurationBlockIndicator": bloqueioProcuracaoAtivoOrdinario
                    },
                    {
                        "id": 0,
                        "shareTypeCode": idTipoAtivoPreferencial,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissaoAtivoPreferencial,
                        "transferTypeCode": idTipoTransferenciaAtivoPreferencial,
                        "shareAdministratorCode": idEscrituradorAtivoPreferencial,
                        "procurationBlockIndicator": bloqueioProcuracaoAtivoPreferencial
                    }
                ]
            }).then(resp => {

                idListaAtivoOrdinario = resp.body.issuerShares[0].id
                idListaAtivoPreferencial = resp.body.issuerShares[1].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(2)

                cy.log(resp.body)

            })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo ordinária cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoOrdinario).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoOrdinario)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAtivoOrdinario)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoOrdinario)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAtivoOrdinario)
            expect(resp.body).to.have.property('shareAdministratorName', "CIA CEARA TEXTIL")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivoOrdinario)
            expect(resp.body).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAtivoOrdinario)
            expect(resp.body).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista ordinária")

            cy.log(resp.body)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo preferencial cadastrado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoPreferencial).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoPreferencial)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAtivoPreferencial)
            expect(resp.body).to.have.property('issuingTypeDescription', "Nominativa")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoPreferencial)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAtivoPreferencial)
            expect(resp.body).to.have.property('shareAdministratorName', "JOJOBA DO NORDESTE S/A - JOBENE")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivoPreferencial)
            expect(resp.body).to.have.property('shareTypeDescription', "Preferencial")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAtivoPreferencial)
            expect(resp.body).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista preferencial")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar o ativo ordinária e o ativo preferencial cadastrado', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)

            buscaListaAtivoOrdinario = resp.body.issuerShares.filter(i => i.id == idListaAtivoOrdinario)
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.issuerCode == idEmissor), "Id emissor da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.issuingTypeCode == idFormaEmissaoAtivoOrdinario), "Id forma de emissão da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.issuingTypeDescription == "Escritural"), "Descrição forma de emissão da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.procurationBlockIndicator == bloqueioProcuracaoAtivoOrdinario), "Bloqueio por procuração da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareAdministratorCode == idEscrituradorAtivoOrdinario), "Id escriturador da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareAdministratorName.trim() == "CIA CEARA TEXTIL"), "Nome escriturador da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeCode == idTipoAtivoOrdinario), "Id tipo ativo da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == "Ordinária"), "Descrição tipo ativo da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.transferTypeDescription == "Eletrônico"), "Descrição tipo transferênciada lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.transferTypeCode == idTipoTransferenciaAtivoOrdinario), "Id tipo de transferência da lista ordinária")
            assert.isTrue(buscaListaAtivoOrdinario.some(i => i.startDate.includes(this.next_wdate)), "Escriturador desde da lista ordinária")

            buscaListaAtivoPreferencial = resp.body.issuerShares.filter(i => i.id == idListaAtivoPreferencial)
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.issuerCode == idEmissor), "Id emissor da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.issuingTypeCode == idFormaEmissaoAtivoPreferencial), "Id forma de emissão da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.issuingTypeDescription == "Nominativa"), "Descrição forma de emissão da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.procurationBlockIndicator == bloqueioProcuracaoAtivoPreferencial), "Bloqueio por procuração da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareAdministratorCode == idEscrituradorAtivoPreferencial), "Id escriturador da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareAdministratorName.trim() == "JOJOBA DO NORDESTE S/A - JOBENE"), "Nome escriturador da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeCode == idTipoAtivoPreferencial), "Id tipo ativo da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == "Preferencial"), "Descrição tipo ativo da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.transferTypeDescription == "Papel"), "Descrição tipo transferênciada lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.transferTypeCode == idTipoTransferenciaAtivoPreferencial), "Id tipo de transferência da lista preferencial")
            assert.isTrue(buscaListaAtivoPreferencial.some(i => i.startDate.includes(this.next_wdate)), "Escriturador desde da lista preferencial")

            cy.log(resp.body)

        })
    })

    it('PUT - Alterar ativo ordinária e ativo preferencial cadastrado', function () {

        idTipoAtivoOrdinario = EnumTipoAtivo.ordinario
        idFormaEmissaoAtivoOrdinarioAlterado = EnumFormaEmissaoAtivo.nominativa
        idEscrituradorAtivoOrdinarioAlterado = 246
        idTipoTransferenciaAtivoOrdinarioAlterado = EnumTipoTransferencia.papel
        bloqueioProcuracaoAtivoOrdinarioAlterado = true
        idTipoAtivoPreferencial = EnumTipoAtivo.preferencial
        idFormaEmissaoAtivoPreferencialAlterado = EnumFormaEmissaoAtivo.escritural
        idEscrituradorAtivoPreferencialAlterado = 261
        idTipoTransferenciaAtivoPreferencialAlterado = EnumTipoTransferencia.eletronico
        bloqueioProcuracaoAtivoPreferencialAlterado = false

        cy.putCEM('issuerShare',
            {
                "issuerCode": idEmissor,
                "issuerShares": [
                    {
                        "id": idListaAtivoPreferencial,
                        "shareTypeCode": idTipoAtivoPreferencial,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissaoAtivoPreferencialAlterado,
                        "transferTypeCode": idTipoTransferenciaAtivoPreferencialAlterado,
                        "shareAdministratorCode": idEscrituradorAtivoPreferencialAlterado,
                        "procurationBlockIndicator": bloqueioProcuracaoAtivoPreferencialAlterado
                    },
                    {
                        "id": idListaAtivoOrdinario,
                        "shareTypeCode": idTipoAtivoOrdinario,
                        "startDate": this.next_wdate,
                        "issuingTypeCode": idFormaEmissaoAtivoOrdinarioAlterado,
                        "transferTypeCode": idTipoTransferenciaAtivoOrdinarioAlterado,
                        "shareAdministratorCode": idEscrituradorAtivoOrdinarioAlterado,
                        "procurationBlockIndicator": bloqueioProcuracaoAtivoOrdinarioAlterado
                    }
                ]
            }).then(resp => {

                idListaAtivoOrdinarioAlterado = resp.body.issuerShares[1].id
                idListaAtivoPreferencialAlterado = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)
                expect(resp.body.issuerShares).to.be.length(2)

            })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo preferencial que foi alterado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoPreferencialAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('shareAdministratorName', "CIA SIDERURGICA DO PARA - COSIPAR")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivoPreferencial)
            expect(resp.body).to.have.property('shareTypeDescription', "Preferencial")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista preferencial alterado")

            cy.log(resp.body)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo ordinária que foi alterado', function () {

        cy.getCEM('issuerShare/' + idListaAtivoOrdinarioAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoOrdinarioAlterado)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAtivoOrdinarioAlterado)
            expect(resp.body).to.have.property('issuingTypeDescription', "Nominativa")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoOrdinarioAlterado)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAtivoOrdinarioAlterado)
            expect(resp.body).to.have.property('shareAdministratorName', "AGRIMEC - AGRICULTURA MECANIZADA S.A.")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivoOrdinario)
            expect(resp.body).to.have.property('shareTypeDescription', "Ordinária")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAtivoOrdinarioAlterado)
            expect(resp.body).to.have.property('transferTypeDescription', "Papel")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista ordinária alterado")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar o ativo ordinária e o ativo preferencial com as alterações', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('issuerCode', idEmissor)

            buscaListaAtivoOrdinarioAlterado = resp.body.issuerShares.filter(i => i.id == idListaAtivoOrdinarioAlterado)
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.issuerCode == idEmissor), "Id emissor da lista ordinário")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.issuingTypeCode == idFormaEmissaoAtivoOrdinarioAlterado), "Id forma de emissão da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.issuingTypeDescription == "Nominativa"), "Descrição forma de emissão da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.procurationBlockIndicator == bloqueioProcuracaoAtivoOrdinarioAlterado), "Bloqueio por procuração da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.shareAdministratorCode == idEscrituradorAtivoOrdinarioAlterado), "Id escriturador da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.shareAdministratorName.trim() == "AGRIMEC - AGRICULTURA MECANIZADA S.A."), "Nome escriturador da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.shareTypeCode == idTipoAtivoOrdinario), "Id tipo ativo da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.shareTypeDescription == "Ordinária"), "Descrição tipo ativo da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.transferTypeDescription == "Papel"), "Descrição tipo transferênciada lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.transferTypeCode == idTipoTransferenciaAtivoOrdinarioAlterado), "Id tipo de transferência da lista ordinária alterado")
            assert.isTrue(buscaListaAtivoOrdinarioAlterado.some(i => i.startDate.includes(this.next_wdate)), "Escriturador desde da lista ordinária alterado")

            buscaListaAtivoPreferencialAlterado = resp.body.issuerShares.filter(i => i.id == idListaAtivoPreferencialAlterado)
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.issuerCode == idEmissor), "Id emissor da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.issuingTypeCode == idFormaEmissaoAtivoPreferencialAlterado), "Id forma de emissão da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.issuingTypeDescription == "Escritural"), "Descrição forma de emissão da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.procurationBlockIndicator == bloqueioProcuracaoAtivoPreferencialAlterado), "Bloqueio por procuração da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.shareAdministratorCode == idEscrituradorAtivoPreferencialAlterado), "Id escriturador da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.shareAdministratorName.trim() == "CIA SIDERURGICA DO PARA - COSIPAR"), "Nome escriturador da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.shareTypeCode == idTipoAtivoPreferencial), "Id tipo ativo da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.shareTypeDescription == "Preferencial"), "Descrição tipo ativo da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.transferTypeDescription == "Eletrônico"), "Descrição tipo transferênciada lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.transferTypeCode == idTipoTransferenciaAtivoPreferencialAlterado), "Id tipo de transferência da lista preferencial alterado")
            assert.isTrue(buscaListaAtivoPreferencialAlterado.some(i => i.startDate.includes(this.next_wdate)), "Escriturador desde da lista preferencial alterado")

            cy.log(resp.body)

        })
    })

    it('DELETE - Deletar o ativo ordinária que foi alterado', () => {

        cy.deleteCEM('issuerShare', idListaAtivoOrdinarioAlterado).then(resp => {

            expect(resp.status).to.be.eq(EnumApi.noContent)

            cy.log(resp)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo ordinária alterado que foi excluído', function () {

        cy.getCEM('issuerShare/' + idListaAtivoOrdinarioAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.notFound)
            assert.isTrue(resp.body.detail.includes("IssuerShare_GetById"), "Ativo ordinário foi excluído, por isso lista vazio.")

            cy.log(resp.body)

        })
    })

    it('GET ID LISTA ATIVO - Consultar o ativo preferencial permanece na lista de ativos com a alteração realizada', function () {

        cy.getCEM('issuerShare/' + idListaAtivoPreferencialAlterado).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body).to.have.property('id', idListaAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('issuerCode', idEmissor)
            expect(resp.body).to.have.property('issuingTypeCode', idFormaEmissaoAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('shareAdministratorCode', idEscrituradorAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('shareAdministratorName', "CIA SIDERURGICA DO PARA - COSIPAR")
            expect(resp.body).to.have.property('shareTypeCode', idTipoAtivoPreferencial)
            expect(resp.body).to.have.property('shareTypeDescription', "Preferencial")
            expect(resp.body).to.have.property('transferTypeCode', idTipoTransferenciaAtivoPreferencialAlterado)
            expect(resp.body).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.startDate.includes(this.next_wdate), "Escriturador desde da lista preferencial alterado")

            cy.log(resp.body)

        })
    })

    it('GET ID EMISSOR - Consultar que somente o ativo preferencial permanece na lista de ativos', function () {

        cy.getCEM('issuerShare/issuer/' + idEmissor).then(resp => {

            expect(resp.status).to.have.equal(EnumApi.success)
            expect(resp.body.issuerShares[0]).to.have.property('id', idListaAtivoPreferencialAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuerCode', idEmissor)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeCode', idFormaEmissaoAtivoPreferencialAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('issuingTypeDescription', "Escritural")
            expect(resp.body.issuerShares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracaoAtivoPreferencialAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorCode', idEscrituradorAtivoPreferencialAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('shareAdministratorName', "CIA SIDERURGICA DO PARA - COSIPAR")
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeCode', idTipoAtivoPreferencial)
            expect(resp.body.issuerShares[0]).to.have.property('shareTypeDescription', "Preferencial")
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeCode', idTipoTransferenciaAtivoPreferencialAlterado)
            expect(resp.body.issuerShares[0]).to.have.property('transferTypeDescription', "Eletrônico")
            assert.isTrue(resp.body.issuerShares[0].startDate.includes(this.next_wdate), "Escriturador desde da lista preferencial alterado")

            cy.log(resp.body)

        })
    })

    after("Delete Created issuer", () => {
        cy.deleteCEM('issuer', idEmissor)
    })
})