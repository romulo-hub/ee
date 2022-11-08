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
let resgatavelAtivoPreferencialCapitalAlterado: boolean
let resgatavelAtivoPreferencialPHCapitalAlterado: boolean
let qtdeAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapitalAlterado: number
let tagAlongAtivoPreferencialCapitalAlterado: number
let tagAlongAtivoPHCapitalAlterado: number
let controleAcionarioAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapital: number
let idListaAtivoOrdinarioCapitalAlterado: number
let idListaAtivoPreferencialCapitalAlterado: number
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idEventoCapital: number
let valorUnitAcaoCapital: number
let valorUnitAcaoCapitalAlterado: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
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
let qtdeAtivosTotalCapital: number
let qtdeAtivosTotalPreferencialCapital: number
let qtdeAtivosTotalOrdinarioCapital: number
let buscaListaAtivoOrdinario: any
let buscaListaAtivoPreferencial: any
let buscaListaAtivoPreferencialPH: any
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Emissor Cia Aberta - Alterar capital com tipo nominal com vários ativos', () => {
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

        it('PUT - Alterar o capital já cadastrado', () => {

            valorUnitAcaoCapitalAlterado = 4258
            tagAlongAtivoOrdinarioCapitalAlterado = 90
            resgatavelAtivoOrdinarioCapitalAlterado = false
            tagAlongAtivoPreferencialCapitalAlterado = 91
            resgatavelAtivoPreferencialCapitalAlterado = true
            tagAlongAtivoPHCapitalAlterado = 97
            resgatavelAtivoPreferencialPHCapitalAlterado = false

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
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapitalAlterado,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapitalAlterado
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPHCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialPHCapitalAlterado,
                            "tagAlongPercentage": tagAlongAtivoPHCapitalAlterado
                        }
                    ]
                }).then(resp => {

                    idListaAtivoOrdinarioCapitalAlterado = resp.body.capitalShares[0].id
                    idListaAtivoPreferencialCapitalAlterado = resp.body.capitalShares[1].id
                    idListaAtivoPHCapital = resp.body.capitalShares[2].id

                    cy.log(resp.body)
                })

        })

        it('GET Capital Ativo pelo idEmissor - Consultar a alteração do capital já cadastrado', () => {

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
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapitalAlterado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivosTotalCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapitalAlterado)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapitalAlterado), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoOrdinarioCapitalAlterado), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivoOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongAtivoOrdinarioCapitalAlterado), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioAtivoOrdinarioCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapitalAlterado)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapitalAlterado), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialCapitalAlterado), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivoPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongAtivoPreferencialCapitalAlterado), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioAtivoPreferencialCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoPreferencialPH = resp.body.capitalShares.filter(i => i.id == idListaAtivoPHCapital)
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.id == idListaAtivoPHCapital), "Id da lista do ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialPHCapitalAlterado), "Resgatavel ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassQuantity == qtdeAtivoPHCapital), "Qtdes ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.tagAlongPercentage == tagAlongAtivoPHCapitalAlterado), "TagAlong ativo preferencial PH capital")
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

        it('GET lista eventos pendente de homologação - Consultar a lista homologação evento capital vazia', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("CapitalEvent_GetEventsToHomologate"), "Não tem eventos pendentes de homologação, por isso lista vazio.")

                cy.log(resp.body)

            })
        })

        it('GET por idCapital - Consultar a alteração do capital já cadastrado', () => {

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
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapitalAlterado)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body).to.have.property('capitalSummaryTotal', qtdeAtivosTotalCapital)

                buscaListaAtivoOrdinario = resp.body.capitalShares.filter(i => i.id == idListaAtivoOrdinarioCapitalAlterado)
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeCode == idTipoAtivoOrdinarioCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.id == idListaAtivoOrdinarioCapitalAlterado), "Id da lista do ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoOrdinarioCapitalAlterado), "Resgatavel ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassQuantity == qtdeAtivoOrdinarioCapital), "Qtdes ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.tagAlongPercentage == tagAlongAtivoOrdinarioCapitalAlterado), "TagAlong ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareClassTypeAcronym == 'OR'), "Nome tipo ativo ordinário capital")
                assert.isTrue(buscaListaAtivoOrdinario.some(i => i.shareControlPercentage == controleAcionarioAtivoOrdinarioCapital), "Controle acionario ativo ordinário capital")

                buscaListaAtivoPreferencial = resp.body.capitalShares.filter(i => i.id == idListaAtivoPreferencialCapitalAlterado)
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeCode == idTipoAtivoPreferencialCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.id == idListaAtivoPreferencialCapitalAlterado), "Id da lista do ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialCapitalAlterado), "Resgatavel ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassQuantity == qtdeAtivoPreferencialCapital), "Qtdes ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.tagAlongPercentage == tagAlongAtivoPreferencialCapitalAlterado), "TagAlong ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.capitalCode == idCapital), "Id Capital cadastrado")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareClassTypeAcronym == 'PR'), "Nome tipo ativo preferencial capital")
                assert.isTrue(buscaListaAtivoPreferencial.some(i => i.shareControlPercentage == controleAcionarioAtivoPreferencialCapital), "Controle acionario ativo preferencial capital")

                buscaListaAtivoPreferencialPH = resp.body.capitalShares.filter(i => i.id == idListaAtivoPHCapital)
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassTypeCode == idTipoAtivoPHCapital), "Id Tipo ativo do capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.id == idListaAtivoPHCapital), "Id da lista do ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.capitalShareRedemptionIndicator == resgatavelAtivoPreferencialPHCapitalAlterado), "Resgatavel ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.shareClassQuantity == qtdeAtivoPHCapital), "Qtdes ativo preferencial PH capital")
                assert.isTrue(buscaListaAtivoPreferencialPH.some(i => i.tagAlongPercentage == tagAlongAtivoPHCapitalAlterado), "TagAlong ativo preferencial PH capital")
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