/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoEventoCapital, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.unitario
let idTipoEventoCapital: number = EnumTipoEventoCapital.conversaoDebentures
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idEventoCapital: number
let idEmissor: number
let idCapital: number
let dataAprovacaoEventoCapital = dataHoje
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let statusEventoCapital: boolean
let idListaEventoAtivoOrdinarioCapital: number
let resgataveOrdinarioAtivosCapital: boolean
let qtdeAtivosOrdinarioCapital: number
let tagAlongOrdinarioAtivosCapital: number
let controleAcionarioOrdinarioAtivosCapital: number
let idListaAtivoOrdinarioCapital: number
let qtdeAtivoAlterar: number
let idNovoCapitalAposEventoHomologado: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let valorUnitarioAposEventoHomologado: number
let buscaCapitalInicial: any
let buscaEventoConversaoDebentures: any
let valorEventoCapitalAlterar: number
let valorCapitalAposEventoHomologado: number
let qtdesAtivosOrdinarioTotalAposEventoHomologado: number
let qtdesAtivosOrdinarioParcial: number
let valorEventoCapitalParcial: number
let qtdeAtivosRestanteEventoCapital: number
let idEventoRestanteCapital: number
let valorEventoCapitalRestante: number

describe('Emissor Cia Estrangeira - Homologar parcial evento editado Conversão de Debêntures com manter restante ativado - Capital Tipo Unitário', () => {
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

            emissorUtilitarioApi.criarEmissorCiaEstrangeiraApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalData.Emissor)

            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            }).then(resp => {

                valorPrecoCapital = 28500
                resgataveOrdinarioAtivosCapital = false
                qtdeAtivosOrdinarioCapital = 1600
                tagAlongOrdinarioAtivosCapital = 98
                controleAcionarioOrdinarioAtivosCapital = 0

                cy.postCEM('Capital',
                    {
                        "issuerCode": idEmissor,
                        "capitalPriceValue": valorPrecoCapital,
                        "approvalDate": dataHoje,
                        "startDate": dataSeguinte,
                        "sharePriceTypeCode": idTipoCalculoCapital,
                        "capitalShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                                "capitalShareRedemptionIndicator": resgataveOrdinarioAtivosCapital,
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
                valorUnitAcaoCapital = resp.body.sharePriceValue

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
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioOrdinarioAtivosCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico o capital antes de homologar parcial o evento Conversão de Debêntures', () => {

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

        it('POST - Cadastrar evento Conversão de Debêntures pendente de homologação', () => {

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
                            "capitalShareRedemptionIndicator": resgataveOrdinarioAtivosCapital,
                            "shareClassQuantity": qtdeAtivosOrdinarioCapital,
                            "tagAlongPercentage": tagAlongOrdinarioAtivosCapital
                        }
                    ]
                }).then(resp => {

                    idEventoCapital = resp.body.id
                    idListaEventoAtivoOrdinarioCapital = resp.body.capitalEventShares[0].id

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
                expect(resp.body[0]).to.have.property('capitalEventTypeDescription', "Conversão Debêntures")
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeAcronym', "OR")
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property('actionCode', 0)
                expect(resp.body[0].capitalType).to.have.property('description', "Conversão Debêntures")
                expect(resp.body[0].capitalType).to.have.property('fieldsCode', 2)
                expect(resp.body[0].capitalType).to.have.property('id', 6)
                expect(resp.body[0].capitalType).to.have.property('portfolioCompositionIndicator', false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Editar evento sem homologar', () => {

            valorEventoCapitalAlterar = 6800
            qtdeAtivoAlterar = 2800

            cy.putCEM('capitalEvent',
                {
                    "id": idEventoCapital,
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "capitalPriceValue": valorEventoCapitalAlterar,
                    "approvalDate": dataHoje,
                    "justificationDescripition": justificativaEvento,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgataveOrdinarioAtivosCapital,
                            "shareClassQuantity": qtdeAtivoAlterar,
                            "tagAlongPercentage": tagAlongOrdinarioAtivosCapital
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    cy.log(resp.body)

                })
        })

        it('GET lista eventos pendente de homologação - Consultar evento capital que foi editado sem homologar', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idEventoCapital)
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorEventoCapitalAlterar)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0]).to.have.property("capitalEventStatus", 0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Conversão Debêntures')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoAlterar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 0)
                expect(resp.body[0].capitalType).to.have.property("description", 'Conversão Debêntures')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 2)
                expect(resp.body[0].capitalType).to.have.property("id", 6)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataAprovacaoEventoCapital), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Homologar parcial evento editado Conversão de Debêntures', () => {

            qtdesAtivosOrdinarioParcial = qtdeAtivoAlterar - 860
            valorEventoCapitalParcial = valorEventoCapitalAlterar - 1200
            qtdeAtivosRestanteEventoCapital = qtdeAtivoAlterar - qtdesAtivosOrdinarioParcial

            cy.putCEM('capitalEvent/homolog',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "approvalDate": dataHoje,
                    "id": idEventoCapital,
                    "capitalPriceValue": {
                        "homologated": valorEventoCapitalParcial,
                        "keepPending": true
                    },
                    "homologateDate": dataHoje,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgataveOrdinarioAtivosCapital,
                            "tagAlongPercentage": tagAlongOrdinarioAtivosCapital,
                            "id": idListaEventoAtivoOrdinarioCapital,
                            "shareClassQuantity": {
                                "homologated": qtdesAtivosOrdinarioParcial,
                                "approved": qtdeAtivoAlterar,
                                "remainder": qtdeAtivosRestanteEventoCapital,
                                "keepPending": true,
                            },
                            "justificationDescripition": justificativaEvento
                        }
                    ],
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    cy.log(resp.body)

                })
        })

        it('GET - Consultar evento capital que foi homologado parcial', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorEventoCapitalParcial)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologação evento capital")
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovação evento capital")
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassQuantity', qtdesAtivosOrdinarioParcial)
                expect(resp.body.capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo unitário com um ativo após homologar parcial o evento editado Conversão de Debêntures', () => {

            valorCapitalAposEventoHomologado = valorPrecoCapital + valorEventoCapitalParcial
            qtdesAtivosOrdinarioTotalAposEventoHomologado = qtdesAtivosOrdinarioParcial + qtdeAtivosOrdinarioCapital
            valorUnitarioAposEventoHomologado = 9.6327683
            idNovoCapitalAposEventoHomologado = idCapital + 1

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idNovoCapitalAposEventoHomologado)
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorCapitalAposEventoHomologado)
                expect(resp.body).to.have.property('capitalStatusCode', 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdesAtivosOrdinarioTotalAposEventoHomologado)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitarioAposEventoHomologado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id')
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdesAtivosOrdinarioTotalAposEventoHomologado)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idNovoCapitalAposEventoHomologado)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioOrdinarioAtivosCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdesAtivosOrdinarioTotalAposEventoHomologado)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

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

                buscaEventoConversaoDebentures = resp.body.filter(i => i.eventType == "Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.id == idNovoCapitalAposEventoHomologado), "Id novo capital após evento homologado - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.capital == valorCapitalAposEventoHomologado), "valor capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.eventType == "Conversão Debêntures"), "Tipo evento capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.quantity == qtdesAtivosOrdinarioTotalAposEventoHomologado), "Quantidade total ativos - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - Conversão Debêntures")
                expect(resp.body).to.be.length(2)

                cy.log(resp.body)

            })
        })

        it('GET lista eventos pendente de homologação - Consultar evento capital restante após homologação parcial', () => {

            valorEventoCapitalRestante = valorEventoCapitalAlterar - valorEventoCapitalParcial

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                idEventoRestanteCapital = resp.body[0].id
                idListaEventoAtivoOrdinarioCapital = resp.body[0].capitalEventShares[0].id

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idEventoRestanteCapital)
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorEventoCapitalRestante)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0]).to.have.property("capitalEventStatus", 0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Conversão Debêntures')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoRestanteCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgataveOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivosRestanteEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 0)
                expect(resp.body[0].capitalType).to.have.property("description", 'Conversão Debêntures')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 2)
                expect(resp.body[0].capitalType).to.have.property("id", 6)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataAprovacaoEventoCapital), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})