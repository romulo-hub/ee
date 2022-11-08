/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEmissor: number
let idCapital: number
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.nominal
let resgatavelAtivoOrdinarioCapital: boolean
let qtdeAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapital: number
let controleAcionarioAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapital: number
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let buscaListaAtivoOrdinario: any
let idListaAtivoOrdinarioEventoCapital: number
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Cadastro capital com tipo nominal com ativo ordinário', () => {
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

        it('GET Capital Ativo pelo idEmissor - Consultar capital tipo nominal com um ativo já cadastrado com o evento IPO já homologado', () => {

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
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('GET - Consultar evento IPO já homologado após cadastro capital tipo nominal com um ativo', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                idListaAtivoOrdinarioEventoCapital = resp.body.capitalEventShares[0].id

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologação IPO capital já cadastrado")

                buscaListaAtivoOrdinario = resp.body.capitalEventShares.filter(i => i.id == idListaAtivoOrdinarioEventoCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalEventCode == idEventoCapital), "Id Evento capital na lista ordinário")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioEventoCapital), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoOrdinarioCapital), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivoOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongAtivoOrdinarioCapital), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")

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
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivoOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

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
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivoOrdinarioCapital)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao capital")
                assert.isTrue(resp.body[0].startDate.includes(dataSeguinte), "Data inicio vigencia capital")

                cy.log(resp.body)

            })
        })

        it('DELETE - Deletar capital já cadastrado', () => {

            cy.deleteCEM('Capital', idCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.noContent)

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar o histórico do capital após deletar o capital cadastrado', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("Capital_GetHistory"), "Capital informado não existe, pois foi excluído")

                cy.log(resp.body)

            })
        })

        it('GET por idCapital - Consultar que o capital cadastrado foi deletado', () => {

            cy.getCEM('Capital/' + idCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("Capital_GetById"), "Capital informado não existe, pois foi excluído")

                cy.log(resp.body)

            })
        })

        it('GET Capital Ativo pelo idEmissor - Consultar capital que não está ativo', () => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("Capital_GetActiveCapital"), "Emissor informado não possui capital ativo cadastrado")

                cy.log(resp.body)

            })
        })

        it('DELETE - Deletar capital que não existe', () => {

            let idCapitalNoExist: number = 32769

            cy.deleteCEM('Capital', idCapitalNoExist).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.conflict)
                assert.isTrue(resp.body.description.includes("Capital não encontrado ou não está ativo : " + idCapitalNoExist), "Capital informado não existe")

                cy.log(resp.body)

            })
        })
        it('POST - Validar mensagem de erro ao informar 0 no valor unit ação', () => {

            valorUnitAcaoCapital = 0
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

                    expect(resp.status).to.have.equal(EnumApi.badRequest)
                    assert.isTrue(resp.body.values.flatMap(i => i.item2).some(i => i.includes("'Valor Unitário/Nominal' deve ser superior a '0'.")), "Valor Unitário / Nominal deve ser superior a 0")

                    cy.log(resp.body)
                })

        })

        it('PUT - Validar mensagem de erro ao informar 0 no valor unit ação', () => {

            valorUnitAcaoCapital = 0

            cy.putCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapital,
                    "id": idCapital,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.badRequest)
                    assert.isTrue(resp.body.values.flatMap(i => i.item2).some(i => i.includes("'Valor Unitário/Nominal' deve ser superior a '0'.")), "Valor Unitário / Nominal deve ser superior a 0")

                    cy.log(resp.body)
                })

        })

        it('Consultar a lista de status do capital', () => {

            cy.getCEM('Capital/get-status-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('Consultar a lista de tipo cálculo capital', () => {

            cy.getCEM('Capital/get-share-price-type-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})