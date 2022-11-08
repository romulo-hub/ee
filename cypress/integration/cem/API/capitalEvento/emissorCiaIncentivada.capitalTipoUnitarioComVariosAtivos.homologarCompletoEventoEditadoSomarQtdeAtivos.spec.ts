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
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idEventoCapital: number
let idEmissor: number
let idCapital: number
let dataAprovacaoEventoCapital = dataHoje
let qtdeTotalAtivosAposEventoHomologado: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let resgatavelOrdinarioAtivosCapital: boolean
let qtdeAtivosOrdinarioCapital: number
let tagAlongOrdinarioAtivosCapital: number
let controleAcionarioOrdinarioAtivosCapital: number
let idListaAtivoOrdinarioCapital: number
let qtdeAtivoOrdinarioAlterar: number
let statusEventoCapital: boolean
let idListaEventoAtivoOrdinarioCapital: number
let idListaEventoAtivoPreferencialCapital: number
let resgatavelPreferencialAtivosCapital: boolean
let qtdeAtivosPreferencialCapital: number
let tagAlongPreferencialAtivosCapital: number
let controleAcionarioPreferencialAtivosCapital: number
let idListaAtivoPreferencialCapital: number
let qtdeAtivoPreferencialAlterar: number
let qtdeTotalAtivosAposCadastroCapital: number
let idNovoCapitalAposEventoHomologado: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let buscaCapitalInicial: any
let buscaEventoSomarQtdeAtivos: any
let dataSeguinte: string
let buscaListaAtivoOrdinario: any
let buscaListaAtivoPreferencial: any
let qtdeTotalAtivoOrdinarioAposEventoHomologado: number
let qtdeTotalAtivoPreferencialAposEventoHomologado: number

describe('Emissor Cia Incentivada - Homologar completo evento editado Somar Quantidade dos Ativos - Capital Tipo Unitário', () => {
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

            emissorUtilitarioApi.criarEmissorCiaIncentivada(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

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
                resgatavelPreferencialAtivosCapital = true
                qtdeAtivosPreferencialCapital = 1300
                tagAlongPreferencialAtivosCapital = 96
                controleAcionarioPreferencialAtivosCapital = 0

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
                                "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                                "capitalShareRedemptionIndicator": resgatavelPreferencialAtivosCapital,
                                "shareClassQuantity": qtdeAtivosPreferencialCapital,
                                "shareControlPercentage": controleAcionarioPreferencialAtivosCapital,
                                "tagAlongPercentage": tagAlongPreferencialAtivosCapital
                            },
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
                idListaAtivoOrdinarioCapital = resp.body.capitalShares[1].id
                idListaAtivoPreferencialCapital = resp.body.capitalShares[0].id

                cy.log(resp.body)

            })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('GET - Consultar capital tipo unitário com vários ativos já cadastrado com o evento IPO já homologado', () => {

            qtdeTotalAtivosAposCadastroCapital = qtdeAtivosOrdinarioCapital + qtdeAtivosPreferencialCapital

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeTotalAtivosAposCadastroCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeTotalAtivosAposCadastroCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelOrdinarioAtivosCapital), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongOrdinarioAtivosCapital), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioOrdinarioAtivosCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelPreferencialAtivosCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivosPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongPreferencialAtivosCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioPreferencialAtivosCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoOrdinario = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosOrdinarioCapital), "Qtde total ativos ordinário")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descrição Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivosPreferencialCapital), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descrição Total Ativos PN")

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico o capital antes de homologar completo o evento Bonificação', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idCapital)
                expect(resp.body[0]).to.have.property('capital', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('eventType', "Capital Inicial")
                expect(resp.body[0]).to.have.property('quantity', qtdeTotalAtivosAposCadastroCapital)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao capital")
                assert.isTrue(resp.body[0].startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.be.length(1)

                cy.log(resp.body)

            })
        })

        it('POST - Cadastrar evento Somar Quantidade dos Ativos pendente de homologação', () => {

            statusEventoCapital = false
            qtdeAtivoPreferencialAlterar = 3788
            qtdeAtivoOrdinarioAlterar = 1147
            justificativaEvento = "Teste"

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
                            "capitalShareRedemptionIndicator": resgatavelPreferencialAtivosCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialAlterar,
                            "tagAlongPercentage": tagAlongPreferencialAtivosCapital
                        }
                    ]
                }).then(resp => {

                    idEventoCapital = resp.body.id

                    expect(resp.status).to.have.equal(EnumApi.created)

                    idListaEventoAtivoOrdinarioCapital = resp.body.capitalEventShares[0].id
                    idListaEventoAtivoPreferencialCapital = resp.body.capitalEventShares[1].id

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
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Bonificação')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioAlterar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('id', idListaEventoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property("shareClassTypeAcronym", 'PR')
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelPreferencialAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialAlterar)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('tagAlongPercentage', tagAlongPreferencialAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 0)
                expect(resp.body[0].capitalType).to.have.property("description", 'Bonificação')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 2)
                expect(resp.body[0].capitalType).to.have.property("id", 3)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Editar evento sem homologar', () => {

            qtdeAtivoPreferencialAlterar = 2422
            qtdeAtivoOrdinarioAlterar = 4877

            cy.putCEM('capitalEvent',
                {
                    "id": idEventoCapital,
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "justificationDescripition": justificativaEvento,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelPreferencialAtivosCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialAlterar,
                            "tagAlongPercentage": tagAlongPreferencialAtivosCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelOrdinarioAtivosCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioAlterar,
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
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0].capitalEventStatus).to.be.eq(0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Bonificação')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioAlterar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('id', idListaEventoAtivoPreferencialCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property("shareClassTypeAcronym", 'PR')
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelPreferencialAtivosCapital)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialAlterar)
                expect(resp.body[0].capitalEventShares[1]).to.have.property('tagAlongPercentage', tagAlongPreferencialAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 0)
                expect(resp.body[0].capitalType).to.have.property("description", 'Bonificação')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 2)
                expect(resp.body[0].capitalType).to.have.property("id", 3)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Homologar completo evento editado Somar Quantidade dos Ativos', () => {

            cy.putCEM('capitalEvent/homolog',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "approvalDate": dataAprovacaoEventoCapital,
                    "id": idEventoCapital,
                    "capitalPriceValue": {
                        "homologated": valorPrecoCapital,
                        "keepPending": false
                    },
                    "homologateDate": dataAprovacaoEventoCapital,
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
                            "capitalShareRedemptionIndicator": resgatavelPreferencialAtivosCapital,
                            "tagAlongPercentage": tagAlongPreferencialAtivosCapital,
                            "id": idListaEventoAtivoPreferencialCapital,
                            "shareClassQuantity": {
                                "homologated": qtdeAtivoPreferencialAlterar,
                                "approved": qtdeAtivoPreferencialAlterar,
                                "remainder": 0,
                                "keepPending": false,
                            },
                            "justificationDescripition": justificativaEvento
                        }
                    ],
                }).then(resp => {

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
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeAtivoOrdinarioAlterar)
                expect(resp.body.capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongOrdinarioAtivosCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('shareClassTypeCode', idTipoAtivoPreferencialCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('id', idListaEventoAtivoPreferencialCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('capitalShareRedemptionIndicator', resgatavelPreferencialAtivosCapital)
                expect(resp.body.capitalEventShares[1]).to.have.property('shareClassQuantity', qtdeAtivoPreferencialAlterar)
                expect(resp.body.capitalEventShares[1]).to.have.property('tagAlongPercentage', tagAlongPreferencialAtivosCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo unitário com vários ativos após homologar completo evento editado Somar Quantidade dos Ativos', () => {

            qtdeTotalAtivoOrdinarioAposEventoHomologado = qtdeAtivosOrdinarioCapital + qtdeAtivoOrdinarioAlterar
            qtdeTotalAtivoPreferencialAposEventoHomologado = qtdeAtivosPreferencialCapital + qtdeAtivoPreferencialAlterar
            qtdeTotalAtivosAposEventoHomologado = qtdeAtivosOrdinarioCapital + qtdeAtivoOrdinarioAlterar + qtdeAtivosPreferencialCapital + qtdeAtivoPreferencialAlterar
            idNovoCapitalAposEventoHomologado = idCapital + 1

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id
                idListaAtivoPreferencialCapital = resp.body.capitalShares[1].id

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idNovoCapitalAposEventoHomologado)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeTotalAtivosAposEventoHomologado)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unitário')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeTotalAtivosAposEventoHomologado)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelOrdinarioAtivosCapital), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongOrdinarioAtivosCapital), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idNovoCapitalAposEventoHomologado), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioOrdinarioAtivosCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelPreferencialAtivosCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialAposEventoHomologado), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongPreferencialAtivosCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idNovoCapitalAposEventoHomologado), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioPreferencialAtivosCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoOrdinario = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado), "Qtde total ativos ordinário")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descrição Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialAposEventoHomologado)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialAposEventoHomologado), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descrição Total Ativos PN")

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
                assert.isTrue(buscaCapitalInicial.some(i => i.quantity == qtdeTotalAtivosAposCadastroCapital), "Qtdes ativos total capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - IPO")

                buscaEventoSomarQtdeAtivos = resp.body.filter(i => i.eventType == "Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.id == idNovoCapitalAposEventoHomologado), "Id novo capital após evento homologado - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.capital == valorPrecoCapital), "valor capital - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.eventType == "Bonificação"), "Tipo evento capital - Bonificação")
                assert.isTrue(buscaEventoSomarQtdeAtivos.some(i => i.quantity == qtdeTotalAtivosAposEventoHomologado), "Qtdes ativos total capital - Bonificação")
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