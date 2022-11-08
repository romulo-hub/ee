/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoEventoCapital, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.unitario
let idTipoEventoCapital: number = EnumTipoEventoCapital.bonificacao
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let idEventoCapital: number
let idEmissor: number
let idCapital: number
let dataAprovacaoEventoCapital = dataHoje
let qtdeAtivosPreferencialAposEventoHomologado: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let statusEventoCapital: boolean
let idListaEventoAtivoOrdinarioCapital: number
let resgatavelOrdinarioAtivosCapital: boolean
let qtdeAtivosOrdinarioCapital: number
let tagAlongOrdinarioAtivosCapital: number
let controleAcionarioOrdinarioAtivosCapital: number
let idListaAtivoOrdinarioCapital: number
let qtdeAtivoOrdinarioAlterar: number
let idNovoCapitalAposEventoHomologado: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let buscaCapitalInicial: any
let buscaEventoSomarQtdeAtivos: any
let qtdeTotalAtivosAposEventoHomologado: number
let qtdeAtivosOrdinarioAntesEventoHomologado: number
let qtdeAtivosOrdinarioAposEventoHomologado: number
let qtdeAtivosOrdinarioTotalAposEventoHomologado: number
let resgatavelAddNovoAtivoPreferencialAtivosCapital: boolean
let qtdeAddNovoAtivoPreferencialCapital: number
let tagAlongAddNovoAtivoPreferencialAtivosCapital: number
let idListaEventoNovoAtivoPreferencialCapital: number

describe('Emissor BDR - Homologar completo evento Somar Quantidade dos Ativos com add novo ativo - Capital Tipo Unitário', () => {
    const capitalEventoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    capitalEventoEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            ativoUtilitario = new AtivoUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            cy.getCEM('Calendar/get-next-workingday').then(resp => {

                dataSeguinte = resp.body

                cy.log(resp.body)

            })

            emissorUtilitarioApi.criarEmissorBDRNP(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(capitalData.Emissor)

            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            }).then(resp => {

                valorUnitAcaoCapital = 0
                valorPrecoCapital = 0
                resgatavelOrdinarioAtivosCapital = false
                qtdeAtivosOrdinarioCapital = 1600
                tagAlongOrdinarioAtivosCapital = 98
                controleAcionarioOrdinarioAtivosCapital = 0

                cy.postCEM('Capital',
                    {
                        "issuerCode": idEmissor,
                        "sharePriceValue": valorUnitAcaoCapital,
                        "capitalPriceValue": valorPrecoCapital,
                        "approvalDate": dataHoje,
                        "startDate": dataSeguinte,
                        "sharePriceTypeCode": idTipoCalculoCapital,
                        "capitalShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                                "capitalShareRedemptionIndicator": resgatavelOrdinarioAtivosCapital,
                                "shareClassQuantity": qtdeAtivosOrdinarioCapital,
                                "shareControlPercentage": controleAcionarioOrdinarioAtivosCapital,
                                "tagAlongPercentage": tagAlongOrdinarioAtivosCapital
                            }
                        ]
                    })
            }).then(resp => {

                idCapital = resp.body.id
                idEventoCapital = resp.body.capitalEventCode
                idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id

                cy.log(resp.body)

            })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('GET - Consultar capital tipo unitário com um ativo já cadastrado com o evento IPO já homologado', () => {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property('capitalStatusCode', 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivosOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioOrdinarioAtivosCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                qtdeAtivosOrdinarioAntesEventoHomologado = resp.body.capitalSummaryList[0].shareClassQuantity

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico o capital antes de homologar completo o evento Bonificação', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idCapital)
                expect(resp.body[0]).to.have.property('capital', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('eventType', "Capital Inicial")
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivosOrdinarioCapital)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao capital")
                assert.isTrue(resp.body[0].startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.be.length(1)

                cy.log(resp.body)

            })
        })

        it('POST - Cadastrar evento Somar Quantidade dos Ativos com add novo ativo pendente de homologação', () => {

            statusEventoCapital = false
            qtdeAtivoOrdinarioAlterar = 3870
            justificativaEvento = "Teste"

            resgatavelAddNovoAtivoPreferencialAtivosCapital = true
            qtdeAddNovoAtivoPreferencialCapital = 2200
            tagAlongAddNovoAtivoPreferencialAtivosCapital = 90

            cy.postCEM('capitalEvent',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataAprovacaoEventoCapital,
                    "capitalEventStatus": statusEventoCapital,
                    "justificationDescripition": justificativaEvento,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelOrdinarioAtivosCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioAlterar,
                            "tagAlongPercentage": tagAlongOrdinarioAtivosCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAddNovoAtivoPreferencialAtivosCapital,
                            "shareClassQuantity": qtdeAddNovoAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAddNovoAtivoPreferencialAtivosCapital
                        }
                    ]
                }).then(resp => {

                    idEventoCapital = resp.body.id
                    idListaEventoAtivoOrdinarioCapital = resp.body.capitalEventShares[0].id
                    idListaEventoNovoAtivoPreferencialCapital = resp.body.capitalEventShares[1].id

                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('GET lista eventos pendente de homologação - Consultar evento capital cadastrado pendente de homologação', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idEventoCapital)
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0].capitalEventStatus).to.be.eq(0)
                expect(resp.body[0]).to.have.property('capitalEventTypeDescription', "Bonificação")
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeAcronym', "OR")
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioAlterar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('id', idListaEventoNovoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassTypeAcronym', "PR")
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelAddNovoAtivoPreferencialAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassQuantity', qtdeAddNovoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('tagAlongPercentage', tagAlongAddNovoAtivoPreferencialAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property('actionCode', 0)
                expect(resp.body[0].capitalType).to.have.property('description', "Bonificação")
                expect(resp.body[0].capitalType).to.have.property('fieldsCode', 2)
                expect(resp.body[0].capitalType).to.have.property('id', 3)
                expect(resp.body[0].capitalType).to.have.property('portfolioCompositionIndicator', false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Homologar completo evento Bonificação com add novo ativo', () => {

            cy.putCEM('capitalEvent/homolog',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "approvalDate": dataHoje,
                    "id": idEventoCapital,
                    "capitalPriceValue": {
                        "homologated": valorPrecoCapital,
                        "keepPending": false
                    },
                    "homologateDate": dataHoje,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelOrdinarioAtivosCapital,
                            "tagAlongPercentage": tagAlongOrdinarioAtivosCapital,
                            "id": idListaEventoAtivoOrdinarioCapital,
                            "shareClassQuantity": {
                                "homologated": qtdeAtivoOrdinarioAlterar,
                                "approved": qtdeAtivoOrdinarioAlterar,
                                "remainder": 0,
                                "keepPending": false,
                            },
                            "justificationDescripition": justificativaEvento
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAddNovoAtivoPreferencialAtivosCapital,
                            "tagAlongPercentage": tagAlongAddNovoAtivoPreferencialAtivosCapital,
                            "id": idListaEventoNovoAtivoPreferencialCapital,
                            "shareClassQuantity": {
                                "homologated": qtdeAddNovoAtivoPreferencialCapital,
                                "approved": qtdeAddNovoAtivoPreferencialCapital,
                                "remainder": 0,
                                "keepPending": false,
                            },
                            "justificationDescripition": justificativaEvento
                        }
                    ],
                }).then(resp => {

                    qtdeAtivosPreferencialAposEventoHomologado = resp.body.capitalEventShares[1].shareClassQuantity
                    qtdeAtivosOrdinarioAposEventoHomologado = resp.body.capitalEventShares[0].shareClassQuantity

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    cy.log(resp.body)

                })
        })

        it('GET - Consultar evento capital que foi homologado completo', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologação evento capital")
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovação evento capital")
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioAposEventoHomologado)
                expect(resp.body.capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('id', idListaEventoNovoAtivoPreferencialCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelAddNovoAtivoPreferencialAtivosCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('shareClassQuantity', qtdeAtivosPreferencialAposEventoHomologado)
                expect(resp.body.capitalEventShares[1]).to.have.property('tagAlongPercentage', tagAlongAddNovoAtivoPreferencialAtivosCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo unitário com um ativo após homologar completo evento Subscrição com add novo ativo', () => {

            qtdeAtivosOrdinarioTotalAposEventoHomologado = qtdeAtivosOrdinarioAntesEventoHomologado + qtdeAtivosOrdinarioAposEventoHomologado
            qtdeTotalAtivosAposEventoHomologado = qtdeAtivosOrdinarioTotalAposEventoHomologado + qtdeAtivosPreferencialAposEventoHomologado
            idNovoCapitalAposEventoHomologado = idCapital + 1

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idNovoCapitalAposEventoHomologado)
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property('capitalStatusCode', 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeTotalAtivosAposEventoHomologado)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id')
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioTotalAposEventoHomologado)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idNovoCapitalAposEventoHomologado)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeAcronym', "OR")
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body.capitalShares[1]).to.have.property('id')
                expect(resp.body.capitalShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelAddNovoAtivoPreferencialAtivosCapital)
                expect(resp.body.capitalShares[1]).to.have.property('shareClassQuantity', qtdeAtivosPreferencialAposEventoHomologado)
                expect(resp.body.capitalShares[1]).to.have.property('tagAlongPercentage', tagAlongAddNovoAtivoPreferencialAtivosCapital)
                expect(resp.body.capitalShares[1]).to.have.property('capitalCode', idNovoCapitalAposEventoHomologado)
                expect(resp.body.capitalShares[1]).to.have.property('shareClassTypeAcronym', "PR")
                expect(resp.body.capitalShares[1]).to.have.property('shareControlPercentage', 0)
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeTotalAtivosAposEventoHomologado)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareTypeDescription', "ON")
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioTotalAposEventoHomologado)
                expect(resp.body.capitalSummaryList[1]).to.have.property('shareTypeDescription', "PN")
                expect(resp.body.capitalSummaryList[1]).to.have.property('shareClassQuantity', qtdeAtivosPreferencialAposEventoHomologado)

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico os eventos capital já homologado', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                buscaCapitalInicial = resp.body.filter(i => i.eventType == "Capital Inicial")
                assert.isTrue(buscaCapitalInicial.some(i => i.id == idCapital), "Id novo capital após evento homologado - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.capital == valorPrecoCapital), "valor capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.eventType == "Capital Inicial"), "Tipo evento capital - Capital Inicial")
                assert.isTrue(buscaCapitalInicial.some(i => i.quantity == qtdeAtivosOrdinarioCapital), "Qtdes ativo ordinário capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - IPO")

                buscaEventoSomarQtdeAtivos = resp.body.filter(i => i.eventType == "Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.id == idNovoCapitalAposEventoHomologado), "Id novo capital após evento homologado - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.capital == valorPrecoCapital), "valor capital - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.eventType == "Bonificação"), "Tipo evento capital - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.quantity == qtdeTotalAtivosAposEventoHomologado), "Quantidade total ativos - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - Bonificação")
                expect(resp.body).to.be.length(2)

                cy.log(resp.body)

            })
        })

        it('GET lista eventos pendente de homologação - Consultar evento capital que foi homologado completo na lista de eventos pendente de homologação', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes('CapitalEvent_GetEventsToHomologate'), "Não possui evento pendente homologação")

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})