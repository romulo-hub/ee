/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEmissor: number
let idCapital: number
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.nominal
let resgatavelAtivoBDRCapital: boolean
let qtdeAtivoBDRCapital: number
let tagAlongAtivoBDRCapital: number
let controleAcionarioAtivoBDRCapital: number
let idListaAtivoBDRCapital: number
let idTipoAtivoBDRCapital: number = 36
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let idListaAtivoBDREventoCapital: number
let buscaListaAtivoBDR: any
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor BDR - Cadastro capital com tipo nominal com ativo BDR', () => {
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

            emissorUtilitarioApi.criarEmissorBDRNP(capitalData.Emissor)
            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })

            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(capitalData.Emissor)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('POST - Cadastrar capital tipo nominal com ativo BDR', () => {

            valorUnitAcaoCapital = 3410
            qtdeAtivoBDRCapital = 1854
            controleAcionarioAtivoBDRCapital = 0
            tagAlongAtivoBDRCapital = 92
            resgatavelAtivoBDRCapital = false

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoBDRCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBDRCapital,
                            "shareClassQuantity": qtdeAtivoBDRCapital,
                            "shareControlPercentage": controleAcionarioAtivoBDRCapital,
                            "tagAlongPercentage": tagAlongAtivoBDRCapital
                        }
                    ]
                }).then(resp => {

                    idCapital = resp.body.id
                    idListaAtivoBDRCapital = resp.body.capitalShares[0].id
                    valorPrecoCapital = resp.body.capitalPriceValue
                    idEventoCapital = resp.body.capitalEventCode

                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('GET Capital Ativo pelo idEmissor - Consultar capital tipo nominal com um ativo já cadastrado com o evento IPO já homologado', () => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoBDRCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OA')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoBDRCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoBDRCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar evento IPO já homologado após cadastro capital tipo nominal com um ativo', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                idListaAtivoBDREventoCapital = resp.body.capitalEventShares[0].id

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologação IPO capital já cadastrado")

                buscaListaAtivoBDR = resp.body.capitalEventShares.filter(i => i.id == idListaAtivoBDREventoCapital)
                assert.isTrue(buscaListaAtivoBDR.some(i => i.capitalEventCode == idEventoCapital), "Id Evento capital na lista BDR")
                assert.isTrue(buscaListaAtivoBDR.some(i => i.id == idListaAtivoBDREventoCapital), "Id da lista do ativo BDR capital")
                assert.isTrue(buscaListaAtivoBDR.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoBDRCapital), "Resgatavel ativo BDR capital")
                assert.isTrue(buscaListaAtivoBDR.some(i => i.shareClassQuantity == qtdeAtivoBDRCapital), "Qtdes ativo BDR capital")
                assert.isTrue(buscaListaAtivoBDR.some(i => i.tagAlongPercentage == tagAlongAtivoBDRCapital), "TagAlong ativo BDR capital")
                assert.isTrue(buscaListaAtivoBDR.some(i => i.shareClassTypeCode == idTipoAtivoBDRCapital), "Id Tipo ativo do capital")
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

        it('GET por idCapital - Consultar o capital já cadastrado', () => {

            cy.getCEM('Capital/' + idCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoBDRCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoBDRCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OA')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoBDRCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoBDRCapital)

                cy.log(resp.body)

            })
        })

        it('GET Capital por idEmissor - Consultar o detalhe do capital cadastrado', () => {

            cy.getCEM('Capital/issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar o histórico do capital tipo nominal já cadastrado', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idCapital)
                expect(resp.body[0]).to.have.property('capital', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('eventType', "Capital Inicial")
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivoBDRCapital)
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