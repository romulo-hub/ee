/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoEventoCapital, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.unitario
let idTipoEventoCapital: number = EnumTipoEventoCapital.subscricao
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let idTipoAtivoPHCapital: number = EnumTipoClasseAtivo.preferencialPH
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
let idListaEventoNovoAtivoCapital: number
let resgatavelPreferencialAtivosCapital: boolean
let qtdeAtivosPreferencialCapital: number
let tagAlongPreferencialAtivosCapital: number
let controleAcionarioPreferencialAtivosCapital: number
let idListaAtivoPreferencialCapital: number
let qtdeAtivoPreferencialAlterar: number
let qtdeTotalAtivosAposCadastroCapital: number
let tagAlongNovoAtivoEventoCapital: number
let resgatavelNovoAtivoEventoCapital: boolean
let qtdeAtivosNovoAtivoEventoCapital: number
let valorEventoCapitalAlterar: number
let idNovoCapitalAposEventoHomologado: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let buscaCapitalInicial: any
let buscaEventoSubscricao: any
let valorCapitalAposEventoHomologado: number
let buscaListaAtivoOrdinario: any
let buscaListaAtivoPreferencial: any
let buscaListaAtivoPH: any
let qtdeTotalAtivoOrdinarioAposEventoHomologado: number
let qtdeTotalAtivoPreferencialAposEventoHomologado: number
let idListaAtivoPHCapital: number
let valorUnitarioAposEventoHomologado: number
let qtdeTotalAtivoPreferencialSemAddNovoAtivoEventoHomologado: number

describe('Emissor Cia Aberta - Homologar completo evento Subscri????o com add novo ativo - Capital Tipo Unit??rio', () => {
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

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            }).then(resp => {

                valorPrecoCapital = 28500
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
                valorUnitAcaoCapital = resp.body.sharePriceValue

                cy.log(resp.body)

            })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('GET - Consultar capital tipo unit??rio com v??rios ativos j?? cadastrado com o evento IPO j?? homologado', () => {

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
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unit??rio')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeTotalAtivosAposCadastroCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelOrdinarioAtivosCapital), "Resgatavel ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosOrdinarioCapital), "Qtdes ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongOrdinarioAtivosCapital), "TagAlong ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioOrdinarioAtivosCapital), "Controle acionario ativo ordin??rio capital")

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
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosOrdinarioCapital), "Qtde total ativos ordin??rio")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descri????o Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivosPreferencialCapital), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descri????o Total Ativos PN")

                cy.log(resp.body)

            })
        })

        it('GET Hist??rico capital - Consultar no hist??rico o capital antes de homologar completo o evento Subscri????o', () => {

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

        it('POST - Cadastrar evento Subscri????o com add novo ativo pendente de homologa????o', () => {

            statusEventoCapital = false
            justificativaEvento = "Teste"
            valorEventoCapitalAlterar = 2400
            qtdeAtivoOrdinarioAlterar = 1800
            qtdeAtivoPreferencialAlterar = 2647
            resgatavelNovoAtivoEventoCapital = false
            qtdeAtivosNovoAtivoEventoCapital = 1600
            tagAlongNovoAtivoEventoCapital = 94

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
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelPreferencialAtivosCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialAlterar,
                            "tagAlongPercentage": tagAlongPreferencialAtivosCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPHCapital,
                            "capitalShareRedemptionIndicator": resgatavelNovoAtivoEventoCapital,
                            "shareClassQuantity": qtdeAtivosNovoAtivoEventoCapital,
                            "tagAlongPercentage": tagAlongNovoAtivoEventoCapital
                        }
                    ]
                }).then(resp => {

                    idEventoCapital = resp.body.id

                    expect(resp.status).to.have.equal(EnumApi.created)

                    idListaEventoAtivoOrdinarioCapital = resp.body.capitalEventShares[0].id
                    idListaEventoAtivoPreferencialCapital = resp.body.capitalEventShares[1].id
                    idListaEventoNovoAtivoCapital = resp.body.capitalEventShares[2].id

                    cy.log(resp.body)

                })
        })

        it('GET lista eventos pendente de homologa????o - Consultar evento capital cadastrado pendente de homologa????o', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idEventoCapital)
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorEventoCapitalAlterar)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0].capitalEventStatus).to.be.eq(0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Subscri????o')
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
                expect(resp.body[0].capitalEventShares[2]).to.have.property('shareClassTypeCode', idTipoAtivoPHCapital)
                expect(resp.body[0].capitalEventShares[2]).to.have.property('id', idListaEventoNovoAtivoCapital)
                expect(resp.body[0].capitalEventShares[2]).to.have.property("shareClassTypeAcronym", 'PH')
                expect(resp.body[0].capitalEventShares[2]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[2]).to.have.property('capitalShareRedemptionIndicator', resgatavelNovoAtivoEventoCapital)
                expect(resp.body[0].capitalEventShares[2]).to.have.property('shareClassQuantity', qtdeAtivosNovoAtivoEventoCapital)
                expect(resp.body[0].capitalEventShares[2]).to.have.property('tagAlongPercentage', tagAlongNovoAtivoEventoCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 0)
                expect(resp.body[0].capitalType).to.have.property("description", 'Subscri????o')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 2)
                expect(resp.body[0].capitalType).to.have.property("id", 15)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataHoje), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Homologar completo evento Subscri????o com add novo ativo', () => {

            cy.putCEM('capitalEvent/homolog',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "approvalDate": dataAprovacaoEventoCapital,
                    "id": idEventoCapital,
                    "capitalPriceValue": {
                        "homologated": valorEventoCapitalAlterar,
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
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPHCapital,
                            "capitalShareRedemptionIndicator": resgatavelNovoAtivoEventoCapital,
                            "tagAlongPercentage": tagAlongNovoAtivoEventoCapital,
                            "id": idListaEventoNovoAtivoCapital,
                            "shareClassQuantity": {
                                "homologated": qtdeAtivosNovoAtivoEventoCapital,
                                "approved": qtdeAtivosNovoAtivoEventoCapital,
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
                expect(resp.body).to.have.property('capitalPriceValue', valorEventoCapitalAlterar)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property("capitalEventStatus", 1)
                assert.isTrue(resp.body.homologateDate.includes(dataHoje), "Data homologa????o evento capital")
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
                expect(resp.body.capitalEventShares[2]).to.have.property('shareClassTypeCode', idTipoAtivoPHCapital)
                expect(resp.body.capitalEventShares[2]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body.capitalEventShares[2]).to.have.property('id', idListaEventoNovoAtivoCapital)
                expect(resp.body.capitalEventShares[2]).to.have.property('capitalShareRedemptionIndicator', resgatavelNovoAtivoEventoCapital)
                expect(resp.body.capitalEventShares[2]).to.have.property('shareClassQuantity', qtdeAtivosNovoAtivoEventoCapital)
                expect(resp.body.capitalEventShares[2]).to.have.property('tagAlongPercentage', tagAlongNovoAtivoEventoCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo unit??rio com v??rios ativos ap??s homologar completo evento Subscri????o com add novo ativo', function () {

            valorUnitarioAposEventoHomologado = 3.4536716
            qtdeTotalAtivoOrdinarioAposEventoHomologado = qtdeAtivosOrdinarioCapital + qtdeAtivoOrdinarioAlterar
            qtdeTotalAtivoPreferencialAposEventoHomologado = qtdeAtivosPreferencialCapital + qtdeAtivoPreferencialAlterar + qtdeAtivosNovoAtivoEventoCapital
            qtdeTotalAtivoPreferencialSemAddNovoAtivoEventoHomologado = qtdeAtivosPreferencialCapital + qtdeAtivoPreferencialAlterar
            qtdeTotalAtivosAposEventoHomologado = qtdeAtivosOrdinarioCapital + qtdeAtivoOrdinarioAlterar + qtdeAtivosPreferencialCapital + qtdeAtivoPreferencialAlterar + qtdeAtivosNovoAtivoEventoCapital
            valorCapitalAposEventoHomologado = valorPrecoCapital + valorEventoCapitalAlterar
            idNovoCapitalAposEventoHomologado = idCapital + 1

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id
                idListaAtivoPreferencialCapital = resp.body.capitalShares[1].id
                idListaAtivoPHCapital = resp.body.capitalShares[2].id

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idNovoCapitalAposEventoHomologado)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorCapitalAposEventoHomologado)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeTotalAtivosAposEventoHomologado)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Unit??rio')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitarioAposEventoHomologado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeTotalAtivosAposEventoHomologado)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelOrdinarioAtivosCapital), "Resgatavel ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado), "Qtdes ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongOrdinarioAtivosCapital), "TagAlong ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idNovoCapitalAposEventoHomologado), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordin??rio capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioOrdinarioAtivosCapital), "Controle acionario ativo ordin??rio capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelPreferencialAtivosCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialSemAddNovoAtivoEventoHomologado), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongPreferencialAtivosCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idNovoCapitalAposEventoHomologado), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioPreferencialAtivosCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoPH = resp.body.capitalShares.filter(i => i.id == idListaAtivoPHCapital)
                assert.isTrue(buscaListaAtivoPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.id == idListaAtivoPHCapital), "Id da lista do ativo PH capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.capitalShareRedemptionIndicator == resgatavelNovoAtivoEventoCapital), "Resgatavel ativo PH capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.shareClassQuantity == qtdeAtivosNovoAtivoEventoCapital), "Qtdes ativo PH capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.tagAlongPercentage == tagAlongNovoAtivoEventoCapital), "TagAlong ativo PH capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.capitalCode == idNovoCapitalAposEventoHomologado), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPH.some(i => i.shareClassTypeAcronym == 'PH'), "Nome tipo ativo PH capital")
                assert.isTrue(buscaListaAtivoPH.some(i => i.shareControlPercentage == 0), "Controle acionario ativo PH capital")

                buscaListaAtivoOrdinario = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeTotalAtivoOrdinarioAposEventoHomologado), "Qtde total ativos ordin??rio")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descri????o Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialAposEventoHomologado)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeTotalAtivoPreferencialAposEventoHomologado), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descri????o Total Ativos PN")

                cy.log(resp.body)

            })
        })

        it('GET Hist??rico capital - Consultar no hist??rico os eventos capital j?? homologado', () => {

            cy.getCEM('Capital/' + idEmissor + '/history').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                buscaCapitalInicial = resp.body.filter(i => i.eventType == "Capital Inicial")
                assert.isTrue(buscaCapitalInicial.some(i => i.id == idCapital), "Id novo capital ap??s evento homologado - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.capital == valorPrecoCapital), "valor capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.eventType == "Capital Inicial"), "Tipo evento capital - Capital Inicial")
                assert.isTrue(buscaCapitalInicial.some(i => i.quantity == qtdeTotalAtivosAposCadastroCapital), "Qtdes ativos total capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - IPO")
                assert.isTrue(buscaCapitalInicial.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - IPO")

                buscaEventoSubscricao = resp.body.filter(i => i.eventType == "Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.id == idNovoCapitalAposEventoHomologado), "Id novo capital ap??s evento homologado - Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.capital == valorCapitalAposEventoHomologado), "valor capital - Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.eventType == "Subscri????o"), "Tipo evento capital - Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.quantity == qtdeTotalAtivosAposEventoHomologado), "Qtdes ativos total capital - Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.approvalDate.includes(dataHoje)), "Data aprovacao capital - Subscri????o")
                assert.isTrue(buscaEventoSubscricao.some(i => i.startDate == dataSeguinte), "Data inicio vigencia capital - Subscri????o")
                expect(resp.body).to.be.length(2)

                cy.log(resp.body)

            })
        })

        it('GET lista eventos pendente de homologa????o - Consultar evento capital que foi homologado completo na lista de eventos pendente de homologa????o', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes('CapitalEvent_GetEventsToHomologate'), "N??o possui evento pendente homologa????o")

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})