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
let resgatavelOrdinarioAtivosCapital: boolean
let qtdeAtivosOrdinarioCapital: number
let tagAlongOrdinarioAtivosCapital: number
let controleAcionarioOrdinarioAtivosCapital: number
let idListaAtivoOrdinarioCapital: number
let valorEventoCapitalAlterar: number
let idNovoCapitalAposEventoHomologado: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let buscaCapitalInicial: any
let buscaEventoConversaoDebentures: any
let dataSeguinte: string
let valorTotalCapitalAposEventoHomologado: number
let qtdesAtivosOrdinarioTotalAposEventoHomologado: number
let valorUnitarioAposEventoHomologado: number
let qtdeAtivoOrdinarioAlterar: number

describe('Emissor Cia Estrangeira - Cadastro evento Conversão de Debêntures já homologado - Capital Tipo Unitário', () => {
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
                resgatavelOrdinarioAtivosCapital = false
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
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
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

        it('GET Histórico capital - Consultar no histórico o capital antes de homologar completo o evento Conversão de Debêntures', () => {

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

        it('POST - Cadastrar evento Conversão de Debêntures já homologado', () => {

            valorEventoCapitalAlterar = 3400
            statusEventoCapital = true
            justificativaEvento = "Teste"
            qtdeAtivoOrdinarioAlterar = 1800

            cy.postCEM('capitalEvent',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "capitalPriceValue": valorEventoCapitalAlterar,
                    "approvalDate": dataAprovacaoEventoCapital,
                    "capitalEventStatus": statusEventoCapital,
                    "justificationDescripition": justificativaEvento,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelOrdinarioAtivosCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioAlterar,
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

        it('GET lista eventos pendente de homologação - Consultar evento capital cadastrado já homologado', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes('CapitalEvent_GetEventsToHomologate'), "Não possui evento pendente homologação")

                cy.log(resp.body)

            })
        })

        it('GET - Consultar evento capital que foi cadastrado já homologado', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorEventoCapitalAlterar)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologação evento capital")
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioAlterar)
                expect(resp.body.capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo unitário com um ativo após cadastrar evento Conversão de Debêntures já homologado', () => {

            valorTotalCapitalAposEventoHomologado = valorPrecoCapital + valorEventoCapitalAlterar
            qtdesAtivosOrdinarioTotalAposEventoHomologado = qtdeAtivosOrdinarioCapital + qtdeAtivoOrdinarioAlterar
            valorUnitarioAposEventoHomologado = 9.3823529
            idNovoCapitalAposEventoHomologado = idCapital + 1

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idNovoCapitalAposEventoHomologado)
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorTotalCapitalAposEventoHomologado)
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
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
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
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.capital == valorTotalCapitalAposEventoHomologado), "valor capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.eventType == "Conversão Debêntures"), "Tipo evento capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.quantity == qtdesAtivosOrdinarioTotalAposEventoHomologado), "Qtdes ativo ordinário capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - Conversão Debêntures")
                assert.isTrue(buscaEventoConversaoDebentures.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - Conversão Debêntures")
                expect(resp.body).to.be.length(2)

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})