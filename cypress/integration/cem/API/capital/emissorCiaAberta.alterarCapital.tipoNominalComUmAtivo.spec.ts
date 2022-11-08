/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEmissor: number
let idCapital: number
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.nominal
let resgatavelAtivoOrdinarioCapital: boolean
let resgatavelAtivoOrdinarioCapitalAlterado: boolean
let qtdeAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapitalAlterado: number
let controleAcionarioAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapitalAlterado: number
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorUnitAcaoCapitalAlterado: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Alterar capital com tipo nominal com ativo ordinário', () => {
    const capitalEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    capitalEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            ativoUtilitario = new AtivoUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            cy.getCEM('Calendar/get-next-workingday').then(resp => {

                dataSeguinte = resp.body

                cy.log(resp.body)

            })

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(capitalData.Emissor)
            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })

            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalData.Emissor)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('POST - Cadastrar capital tipo nominal com ativo ordinário', () => {

            valorUnitAcaoCapital = 3200
            valorPrecoCapital = 24872
            qtdeAtivoOrdinarioCapital = 1600
            controleAcionarioAtivoOrdinarioCapital = 0
            tagAlongAtivoOrdinarioCapital = 96
            resgatavelAtivoOrdinarioCapital = true

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioCapital,
                            "shareControlPercentage": controleAcionarioAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital
                        }
                    ]
                }).then(resp => {

                    idCapital = resp.body.id
                    idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id
                    idEventoCapital = resp.body.capitalEventCode

                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('PUT - Alterar o capital já cadastrado', () => {

            valorUnitAcaoCapitalAlterado = 3822
            tagAlongAtivoOrdinarioCapitalAlterado = 98
            resgatavelAtivoOrdinarioCapitalAlterado = false

            cy.putCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapitalAlterado,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "id": idCapital,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapitalAlterado,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapitalAlterado
                        }
                    ]
                }).then(resp => {

                    idListaAtivoOrdinarioCapitalAlterado = resp.body.capitalShares[0].id

                    cy.log(resp.body)
                })

        })

        it('GET Capital Ativo pelo idEmissor - Consultar a alteração do capital já cadastrado', () => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapitalAlterado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('GET lista eventos pendente de homologação - Consultar a lista homologação evento capital vazia', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("CapitalEvent_GetEventsToHomologate"), "Não tem eventos pendentes de homologação, por isso lista vazio.")

                cy.log(resp.body)

            })
        })

        it('GET por idCapital - Consultar a alteração do capital já cadastrado', () => {

            cy.getCEM('Capital/' + idCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapitalAlterado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoOrdinarioCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('GET Capital por idEmissor - Consultar a alteração do capital já cadastrado', () => {

            cy.getCEM('Capital/issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico a alteração do capital já cadastrado', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idCapital)
                expect(resp.body[0]).to.have.property('capital', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('eventType', "Capital Inicial")
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivoOrdinarioCapital)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao capital")
                assert.isTrue(resp.body[0].startDate.includes(dataSeguinte), "Data inicio vigencia capital")

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})