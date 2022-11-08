/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoEventoCapital, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEventoCapital: number
let idEmissor: number
let idCapital: number
let dataAprovacaoEventoCapital = dataHoje
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.nominal
let idTipoEventoCapital: number = EnumTipoEventoCapital.conversaoAcoes
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let qtdeAtivosOrdinarioParcial: number
let qtdeTotalAtivosOrdinarioAposEventoEventoSemHomologar: number
let qtdesAtivosRestanteOrdinario: number
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let resgatavelAtivosCapital: boolean
let qtdeAtivosOrdinarioCapital: number
let tagAlongAtivosCapital: number
let controleAcionarioCapital: number
let idListaAtivoOrdinarioCapital: number
let qtdeAtivoOrdinarioAlterar: number
let statusEventoCapital: boolean
let idListaEventoAtivoOrdinarioCapital: number
let justificativaEvento: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let idEventoCapitalIPO: number

describe('Emissor BDR - Homologar parcial evento Conversão de ações - Capital Tipo Nominal', () => {
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

                valorUnitAcaoCapital = 3200
                valorPrecoCapital = 0
                qtdeAtivosOrdinarioCapital = 1300
                controleAcionarioCapital = 0
                tagAlongAtivosCapital = 96
                resgatavelAtivosCapital = true

                cy.postCEM('Capital',
                    {
                        "sharePriceValue": valorUnitAcaoCapital,
                        "issuerCode": idEmissor,
                        "capitalPriceValue": valorPrecoCapital,
                        "approvalDate": dataHoje,
                        "startDate": dataSeguinte,
                        "sharePriceTypeCode": idTipoCalculoCapital,
                        "capitalShares": [
                            {
                                "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                                "capitalShareRedemptionIndicator": resgatavelAtivosCapital,
                                "shareClassQuantity": qtdeAtivosOrdinarioCapital,
                                "shareControlPercentage": controleAcionarioCapital,
                                "tagAlongPercentage": tagAlongAtivosCapital
                            }
                        ]
                    })
            }).then(resp => {

                idCapital = resp.body.id
                idEventoCapitalIPO = resp.body.capitalEventCode
                idListaAtivoOrdinarioCapital = resp.body.capitalShares[0].id

                cy.log(resp.body)

            })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('GET - Consultar capital tipo nominal com um ativo já cadastrado com o evento IPO já homologado', function () {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapitalIPO)
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivosOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('POST - Cadastrar evento Conversão de ações pendente de homologação', () => {

            statusEventoCapital = false
            qtdeAtivoOrdinarioAlterar = 4800
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
                            "capitalShareRedemptionIndicator": resgatavelAtivosCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioAlterar,
                            "tagAlongPercentage": tagAlongAtivosCapital
                        }
                    ]
                }).then(resp => {

                    idEventoCapital = resp.body.id
                    idListaEventoAtivoOrdinarioCapital = resp.body.capitalEventShares[0].id

                    expect(resp.status).to.have.equal(EnumApi.created)

                    qtdeTotalAtivosOrdinarioAposEventoEventoSemHomologar = qtdeAtivoOrdinarioAlterar

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
                expect(resp.body[0]).to.have.property("capitalEventStatus", 0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Conversão de ações')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeTotalAtivosOrdinarioAposEventoEventoSemHomologar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 1)
                expect(resp.body[0].capitalType).to.have.property("description", 'Conversão de ações')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 1)
                expect(resp.body[0].capitalType).to.have.property("id", EnumTipoEventoCapital.conversaoAcoes)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                assert.isTrue(resp.body[0].approvalDate.includes(dataAprovacaoEventoCapital), "Data aprovacao evento capital")

                cy.log(resp.body)

            })
        })

        it('PUT - Homologar parcial evento Conversão de ações', () => {

            qtdeAtivosOrdinarioParcial = 2200
            qtdesAtivosRestanteOrdinario = qtdeTotalAtivosOrdinarioAposEventoEventoSemHomologar - qtdeAtivosOrdinarioParcial

            cy.putCEM('capitalEvent/homolog',
                {
                    "issuerCode": idEmissor,
                    "capitalEventTypeCode": idTipoEventoCapital,
                    "approvalDate": dataAprovacaoEventoCapital,
                    "id": idEventoCapital,
                    "capitalPriceValue": {
                        "homologated": valorPrecoCapital,
                        "keepPending": true
                    },
                    "homologateDate": dataAprovacaoEventoCapital,
                    "capitalEventShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivosCapital,
                            "tagAlongPercentage": tagAlongAtivosCapital,
                            "id": idListaEventoAtivoOrdinarioCapital,
                            "shareClassQuantity": {
                                "homologated": qtdeAtivosOrdinarioParcial,
                                "approved": qtdeAtivoOrdinarioAlterar,
                                "remainder": qtdesAtivosRestanteOrdinario,
                                "keepPending": false,
                            },
                            "justificationDescripition": justificativaEvento
                        }
                    ],
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.conflict)
                    assert.isTrue(resp.body.description.includes('Não é permitida homologação parcial para esse tipo de emissor.'), 'Não é permitida homologação parcial para esse tipo de emissor.')

                    cy.log(resp.body)

                })
        })

        it('GET lista eventos pendente de homologação - Consultar evento capital permanece cadastrado pendente de homologação ', () => {

            cy.getCEM('capitalEvent/' + idEmissor + '/homologate-list').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body[0]).to.have.property('id', idEventoCapital)
                expect(resp.body[0]).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body[0]).to.have.property('capitalEventTypeCode', idTipoEventoCapital)
                expect(resp.body[0]).to.have.property("capitalEventStatus", 0)
                expect(resp.body[0]).to.have.property("capitalEventTypeDescription", 'Conversão de ações')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('id', idListaEventoAtivoOrdinarioCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalEventCode', idEventoCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivosCapital)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('shareClassQuantity', qtdeTotalAtivosOrdinarioAposEventoEventoSemHomologar)
                expect(resp.body[0].capitalEventShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivosCapital)
                expect(resp.body[0].capitalType).to.have.property("actionCode", 1)
                expect(resp.body[0].capitalType).to.have.property("description", 'Conversão de ações')
                expect(resp.body[0].capitalType).to.have.property("fieldsCode", 1)
                expect(resp.body[0].capitalType).to.have.property("id", EnumTipoEventoCapital.conversaoAcoes)
                expect(resp.body[0].capitalType).to.have.property("portfolioCompositionIndicator", false)
                expect(resp.body[0].approvalDate.slice(0, 10)).to.be.eq(dataAprovacaoEventoCapital)

                cy.log(resp.body)

            })
        })

        it('GET - Consultar capital tipo nominal com um ativo continua sem alteração do evento pendente de homologação', function () {

            cy.getCEM('Capital/get-active/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idCapital)
                expect(resp.body).to.have.property('capitalEventCode', idEventoCapitalIPO)
                assert.isTrue(resp.body.approvalDate.includes(dataHoje), "Data aprovacao capital")
                expect(resp.body).to.have.property('capitalPriceValue', valorPrecoCapital)
                expect(resp.body).to.have.property("capitalStatusCode", 0)
                expect(resp.body).to.have.property('issuerCode', idEmissor)
                expect(resp.body).to.have.property('capitalShareQuantity', qtdeAtivosOrdinarioCapital)
                assert.isTrue(resp.body.requestDate.includes(dataHoje), "Data requisicao capital")
                expect(resp.body).to.have.property('sharePriceTypeCode', idTipoCalculoCapital)
                expect(resp.body).to.have.property("sharePriceTypeDescription", 'Nominal')
                expect(resp.body).to.have.property('sharePriceValue', valorUnitAcaoCapital)
                assert.isTrue(resp.body.startDate.includes(dataSeguinte), "Data inicio vigencia capital")
                expect(resp.body.capitalShares[0]).to.have.property('shareClassTypeCode', idTipoAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('id', idListaAtivoOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalShareRedemptionIndicator', resgatavelAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalShares[0]).to.have.property('tagAlongPercentage', tagAlongAtivosCapital)
                expect(resp.body.capitalShares[0]).to.have.property('capitalCode', idCapital)
                expect(resp.body.capitalShares[0]).to.have.property("shareClassTypeAcronym", 'OR')
                expect(resp.body.capitalShares[0]).to.have.property('shareControlPercentage', controleAcionarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property('shareClassQuantity', qtdeAtivosOrdinarioCapital)
                expect(resp.body.capitalSummaryList[0]).to.have.property("shareTypeDescription", 'ON')

                cy.log(resp.body)

            })
        })

        it('GET Histórico capital - Consultar no histórico o capital já cadastrado sem alteração do evento que não foi homologado', () => {

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

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})