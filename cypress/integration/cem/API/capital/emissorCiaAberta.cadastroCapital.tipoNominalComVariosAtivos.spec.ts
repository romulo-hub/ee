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
let qtdeAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapital: number
let controleAcionarioAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapital: number
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let resgatavelAtivoPreferencialCapital: boolean
let qtdeAtivoPreferencialCapital: number
let tagAlongAtivoPreferencialCapital: number
let controleAcionarioAtivoPreferencialCapital: number
let idListaAtivoPreferencialCapital: number
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let resgatavelAtivoPHCapital: boolean
let qtdeAtivoPHCapital: number
let tagAlongAtivoPHCapital: number
let controleAcionarioAtivoPHCapital: number
let idListaAtivoPHCapital: number
let idTipoAtivoPHCapital: number = EnumTipoClasseAtivo.preferencialPH
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let qtdeAtivosTotalCapital: number
let qtdeAtivosTotalPreferencialCapital: number
let qtdeAtivosTotalOrdinarioCapital: number
let buscaListaAtivoOrdinario: any
let buscaListaAtivoPreferencial: any
let buscaListaAtivoPreferencialPH: any
let idListaAtivoOrdinarioEventoCapital: number
let idListaAtivoPreferencialEventoCapital: number
let idListaAtivoPHEventoCapital: number
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Cadastro capital com tipo nominal com vários ativos', () => {
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
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('POST - Cadastrar capital tipo nominal com vários ativos', () => {

            valorUnitAcaoCapital = 3200
            valorPrecoCapital = 24872
            qtdeAtivoOrdinarioCapital = 1600
            controleAcionarioAtivoOrdinarioCapital = 0
            tagAlongAtivoOrdinarioCapital = 96
            resgatavelAtivoOrdinarioCapital = true

            qtdeAtivoPreferencialCapital = 1352
            controleAcionarioAtivoPreferencialCapital = 0
            tagAlongAtivoPreferencialCapital = 98
            resgatavelAtivoPreferencialCapital = false

            qtdeAtivoPHCapital = 1456
            controleAcionarioAtivoPHCapital = 0
            tagAlongAtivoPHCapital = 92
            resgatavelAtivoPHCapital = true

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
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPHCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPHCapital,
                            "shareClassQuantity": qtdeAtivoPHCapital,
                            "shareControlPercentage": controleAcionarioAtivoPHCapital,
                            "tagAlongPercentage": tagAlongAtivoPHCapital
                        }
                    ]
                }).then(resp => {

                    idCapital = resp.body.id
                    idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id
                    idListaAtivoPreferencialCapital = resp.body.capitalShares[1].id
                    idListaAtivoPHCapital = resp.body.capitalShares[2].id
                    idEventoCapital = resp.body.capitalEventCode

                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('GET Capital Ativo pelo idEmissor - Consultar capital tipo nominal com vários ativos já cadastrado com o evento IPO já homologado', () => {

            qtdeAtivosTotalCapital = qtdeAtivoOrdinarioCapital + qtdeAtivoPreferencialCapital + qtdeAtivoPHCapital
            qtdeAtivosTotalOrdinarioCapital = qtdeAtivoOrdinarioCapital
            qtdeAtivosTotalPreferencialCapital = qtdeAtivoPreferencialCapital + qtdeAtivoPHCapital

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivosTotalCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivosTotalCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoOrdinarioCapital), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivoOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongAtivoOrdinarioCapital), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioAtivoOrdinarioCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivoPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongAtivoPreferencialCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioAtivoPreferencialCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoPreferencialPH = resp.body.capitalShares.filter(i => i.id == idListaAtivoPHCapital)
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.id == idListaAtivoPHCapital), "Id da lista do ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPHCapital), "Resgatavel ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassQuantity == qtdeAtivoPHCapital), "Qtdes ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.tagAlongPercentage == tagAlongAtivoPHCapital), "TagAlong ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeAcronym == 'PH'), "Nome tipo ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareControlPercentage == controleAcionarioAtivoPHCapital), "Controle acionario ativo preferencial PH capital")

                buscaListaAtivoOrdinario = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosTotalOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosTotalOrdinarioCapital), "Qtde total ativos ordinário")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descrição Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosTotalPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivosTotalPreferencialCapital), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descrição Total Ativos PN")

                cy.log(resp.body)

            })
        })

        it('GET - Consultar evento IPO já homologado após cadastro capital tipo nominal com vários ativos', () => {

            cy.getCEM('capitalEvent/' + idEventoCapital).then(resp => {

                idListaAtivoOrdinarioEventoCapital = resp.body.capitalEventShares[0].id
                idListaAtivoPreferencialEventoCapital = resp.body.capitalEventShares[1].id
                idListaAtivoPHEventoCapital = resp.body.capitalEventShares[2].id

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

                buscaListaAtivoPreferencial = resp.body.capitalEventShares.filter(i => i.id == idListaAtivoPreferencialEventoCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalEventCode == idEventoCapital), "Id Evento capital na lista preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialEventoCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivoPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongAtivoPreferencialCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")

                buscaListaAtivoPreferencialPH = resp.body.capitalEventShares.filter(i => i.id == idListaAtivoPHEventoCapital)
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalEventCode == idEventoCapital), "Id Evento capital na lista preferencial PH")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.id == idListaAtivoPHEventoCapital), "Id da lista do ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPHCapital), "Resgatavel ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassQuantity == qtdeAtivoPHCapital), "Qtdes ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.tagAlongPercentage == tagAlongAtivoPHCapital), "TagAlong ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")

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

            qtdeAtivosTotalCapital = qtdeAtivoOrdinarioCapital + qtdeAtivoPreferencialCapital + qtdeAtivoPHCapital
            qtdeAtivosTotalOrdinarioCapital = qtdeAtivoOrdinarioCapital
            qtdeAtivosTotalPreferencialCapital = qtdeAtivoPreferencialCapital + qtdeAtivoPHCapital

            cy.getCEM('Capital/' + idCapital).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivosTotalCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivosTotalCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapital), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoOrdinarioCapital), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivoOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongAtivoOrdinarioCapital), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioAtivoOrdinarioCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapital), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialCapital), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivoPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongAtivoPreferencialCapital), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioAtivoPreferencialCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoPreferencialPH = resp.body.capitalShares.filter(i => i.id == idListaAtivoPHCapital)
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.id == idListaAtivoPHCapital), "Id da lista do ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPHCapital), "Resgatavel ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassQuantity == qtdeAtivoPHCapital), "Qtdes ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.tagAlongPercentage == tagAlongAtivoPHCapital), "TagAlong ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeAcronym == 'PH'), "Nome tipo ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareControlPercentage == controleAcionarioAtivoPHCapital), "Controle acionario ativo preferencial PH capital")

                buscaListaAtivoOrdinario = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosTotalOrdinarioCapital)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivosTotalOrdinarioCapital), "Qtde total ativos ordinário")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareTypeDescription == 'ON'), "Descrição Total Ativos ON")

                buscaListaAtivoPreferencial = resp.body.capitalSummaryList.filter(i => i.shareClassQuantity == qtdeAtivosTotalPreferencialCapital)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivosTotalPreferencialCapital), "Qtde total ativos preferencial")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareTypeDescription == 'PN'), "Descrição Total Ativos PN")

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
                expect(resp.body[0]).to.have.property('quantity', qtdeAtivosTotalCapital)
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