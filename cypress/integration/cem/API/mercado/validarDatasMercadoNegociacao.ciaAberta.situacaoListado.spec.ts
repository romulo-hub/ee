/// <reference types="Cypress" />

import CemModel from "../../model/cem.model"
import { DataUtilitario } from "../../utilitarios/data.utilitario"
import { EmissorUtilitarioApi } from "../../utilitarios/emissor.utilitario"
import { EnumApi, EnumCategoriaCVM, EnumCategoriaB3, EnumTipoMercado, EnumTipoEmissor, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumNegociacaoSeparado, EnumMercadoNegociacao, EnumCargo, EnumLotePadrao, EnumFatorCotacao } from "../../utilitarios/enum.utilitario"

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
//let dataNaoUtil: string = '2021-07-24'
let dataNaoUtil: string = DataUtilitario.proximoDiaNaoUtilApi()


describe('Mercado Negociação do emissor Cia Aberta com situação listado - Validar datas inicio mercado com data hoje, data inicio lote padrao e data inicio fator de cotação com datas não útil', () => {
    const mercadoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    mercadoEmissor.forEach((mercadoData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()

            cy.viewport(1366, 768)

            cy.getNextWorkingDayApi().as('next_wdate')

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(mercadoData.Emissor)
            cy.getCEM('issuer?searchQuery=' + mercadoData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })
        })

        it("POST - Validar a data inicio do mercado de negociação com data hoje", function () {

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": EnumCategoriaB3.a,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.listado,
                    "startDateMarketIssuerStatus": "2020-11-16T00:00:00.000Z",
                    "endDateMarketIssuerStatus": dataHoje,
                    "categoryB3Date": dataHoje,
                    "tradingSegmentDate": dataHoje,
                    "cvmRegistryDate": dataHoje,
                    "taxBenefitIndicator": false,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.intervencao,
                    "conditionDate": this.next_wdate,
                    "categoryCvmDate": dataHoje,
                    "cvmCode": 0,
                    "tradingMarkets": [
                        {
                            "startDate": dataHoje,
                            "endDate": "",
                            "roundLotStartDate": '2021-02-28',
                            "factorStartDate": this.next_wdate,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.badRequest)
                assert.isTrue(resp.body.values.flatMap(i => i.item2).some(i => i.includes("'Início do Mercado' deve ser superior")), "Início do Mercado' deve ser superior a data hoje")
                cy.log(resp.body)

            })
        })

        it("POST - Validar a data inicio lote padrão do mercado de negociação com dia não útil", function () {

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": EnumCategoriaB3.a,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.listado,
                    "startDateMarketIssuerStatus": "2020-11-16T00:00:00.000Z",
                    "endDateMarketIssuerStatus": dataHoje,
                    "categoryB3Date": dataHoje,
                    "tradingSegmentDate": dataHoje,
                    "cvmRegistryDate": dataHoje,
                    "taxBenefitIndicator": false,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.intervencao,
                    "conditionDate": this.next_wdate,
                    "categoryCvmDate": dataHoje,
                    "cvmCode": 1,
                    "tradingMarkets": [
                        {
                            "startDate": this.next_wdate,
                            "endDate": "",
                            "roundLotStartDate": dataNaoUtil,
                            "factorStartDate": this.next_wdate,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.conflict)
                assert.isTrue(resp.body.description.includes("Data do Lote Padrao precisa ser em um dia util"), "Data do Lote Padrao precisa ser em um dia util")
                cy.log(resp.body)

            })
        })

        it("POST - Validar a data inicio fator de cotação do mercado de negociação com dia não útil", function () {

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": EnumCategoriaB3.a,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.listado,
                    "startDateMarketIssuerStatus": "2020-11-16T00:00:00.000Z",
                    "endDateMarketIssuerStatus": dataHoje,
                    "categoryB3Date": dataHoje,
                    "tradingSegmentDate": dataHoje,
                    "cvmRegistryDate": dataHoje,
                    "taxBenefitIndicator": false,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.intervencao,
                    "conditionDate": this.next_wdate,
                    "categoryCvmDate": dataHoje,
                    "cvmCode": 2,
                    "tradingMarkets": [
                        {
                            "startDate": this.next_wdate,
                            "endDate": "",
                            "roundLotStartDate": this.next_wdate,
                            "factorStartDate": dataNaoUtil,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.conflict)
                assert.isTrue(resp.body.description.includes("Data do Fator de Cotação precisa ser em um dia util"), "Data do Fator de Cotação precisa ser em um dia util")
                cy.log(resp.body)

            })
        })

        it("GET por ID - consultar que o mercado não foi cadastrado", function () {

            cy.getCEM('market/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("Market_GetById"), "Não identificado mercado do emissor informado")

                cy.log(resp.body)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})