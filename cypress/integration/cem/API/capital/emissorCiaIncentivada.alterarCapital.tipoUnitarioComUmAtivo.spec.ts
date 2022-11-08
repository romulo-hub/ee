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
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.unitario
let resgatavelAtivoPreferencialCapital: boolean
let resgatavelAtivoPreferencialCapitalAlterado: boolean
let qtdeAtivoPreferencialCapital: number
let tagAlongAtivoPreferencialCapital: number
let tagAlongAtivoPreferencialCapitalAlterado: number
let controleAcionarioAtivoPreferencialCapital: number
let idListaAtivoPreferencialCapital: number
let idListaAtivoPreferencialCapitalAlterado: number
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Incentivada - Alterar capital com tipo unitário com ativo preferencial', () => {
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

            emissorUtilitarioApi.criarEmissorCiaIncentivada(capitalData.Emissor)
            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })

            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(capitalData.Emissor)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('POST - Cadastrar capital tipo unitário com ativo preferencial', () => {

            qtdeAtivoPreferencialCapital = 1600
            controleAcionarioAtivoPreferencialCapital = 0
            tagAlongAtivoPreferencialCapital = 96
            resgatavelAtivoPreferencialCapital = true

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital
                        }
                    ]
                }).then(resp => {

                    idCapital = resp.body.id
                    idListaAtivoPreferencialCapital = resp.body.capitalShares[0].id
                    valorUnitAcaoCapital = resp.body.sharePriceValue
                    valorPrecoCapital = resp.body.capitalPriceValue
                    idEventoCapital = resp.body.capitalEventCode

                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('PUT - Alterar o capital já cadastrado', () => {

            tagAlongAtivoPreferencialCapitalAlterado = 98
            resgatavelAtivoPreferencialCapitalAlterado = false

            cy.putCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "id": idCapital,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapitalAlterado,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapitalAlterado
                        }
                    ]
                }).then(resp => {

                    idListaAtivoPreferencialCapitalAlterado = resp.body.capitalShares[0].id

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
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoPreferencialCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'PR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoPreferencialCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'PN')

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
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoPreferencialCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoPreferencialCapitalAlterado)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'PR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoPreferencialCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'PN')

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
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivoPreferencialCapital)
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