/// <reference types="Cypress" />

import CemModel from "../../model/cem.model"
import { EmissorUtilitarioApi } from "../../utilitarios/emissor.utilitario";
import { EnumApi, EnumCategoriaCVM, EnumCategoriaB3, EnumTipoMercado, EnumTipoEmissor, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumNegociacaoSeparado, EnumMercadoNegociacao, EnumCargo, EnumLotePadrao, EnumFatorCotacao } from "../../utilitarios/enum.utilitario"
const dayjs = require('dayjs');

let dateTodayApi = dayjs().format()
let idEmissor: number
let idSituacaoEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dateToday = new Date().toISOString().slice(0, 10);

describe('cadastro mercado de negociação do emissor Cia. Aberta', () => {
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

        it("POST - cadastrar mercado de negociação do emissor Cia. Aberta com situação listado", function () {

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
                    "endDateMarketIssuerStatus": dateToday,
                    "categoryB3Date": dateToday,
                    "tradingSegmentDate": dateToday,
                    "cvmRegistryDate": dateToday,
                    "taxBenefitIndicator": false,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.outrasCondicoes,
                    "conditionDate": this.next_wdate,
                    "categoryCvmDate": dateToday,
                    "cvmCode": 4531,
                    "tradingMarkets": [
                        {
                            "startDate": this.next_wdate,
                            "endDate": "",
                            "roundLotStartDate": this.next_wdate,
                            "factorStartDate": this.next_wdate,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                idEmissor = resp.body.id
                idSituacaoEmissor = resp.body.marketIssuerStatusCode

                expect(resp.status).to.have.equal(EnumApi.created)
                cy.log(resp.body)

            })

        })

        it("GET por ID - consultar mercado de negociação do emissor Cia. Aberta com situação listado criado no post", function () {

            cy.getCEM('market/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', resp.body.id)
                expect(resp.body).to.have.property('categoryB3Code', EnumCategoriaB3.a)
                expect(resp.body).to.have.property('categoryB3Date').contains(dateToday)
                expect(resp.body).to.have.property('categoryCvmCode', EnumCategoriaCVM.b)
                expect(resp.body).to.have.property('categoryCvmDate').contains(dateToday)
                expect(resp.body).to.have.property('conditionDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body).to.have.property('conditionTypeCode', EnumNegociacaoSeparado.outrasCondicoes)
                expect(resp.body).to.have.property('cvmCode', 4531)
                expect(resp.body).to.have.property('cvmRegistryDate').contains(dateToday)
                expect(resp.body).to.have.property('endDateMarketIssuerStatus').contains(dateToday)
                expect(resp.body).to.have.property('issuerCode')
                expect(resp.body).to.have.property('marketIssuerStatusCode')
                expect(resp.body).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body).to.have.property('startDateMarketIssuerStatus').contains('2020-11-16')
                expect(resp.body).to.have.property('taxBenefitIndicator', false)
                expect(resp.body).to.have.property('tradingSegmentCode', EnumSegmentoNegociacao.bolsa)
                expect(resp.body.tradingMarkets[0]).to.have.property('startDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('roundLotStartDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('factorStartDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('factorValue', EnumFatorCotacao.fator10)
                expect(resp.body.tradingMarkets[0]).to.have.property('roundLotValue', EnumLotePadrao.lote3)
                expect(resp.body.tradingMarkets[0]).to.have.property('tradeMarketTypeCode', EnumMercadoNegociacao.bolsaRendaFixa)

                cy.log(resp.body)

            })

        })

        it("PUT - alterar mercado de negociação do emissor Cia. Aberta com situação listado", function () {

            cy.putCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": EnumCategoriaCVM.a,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.listado,
                    "startDateMarketIssuerStatus": "2020-11-23T00:00:00.000Z",
                    "endDateMarketIssuerStatus": dateTodayApi,
                    "categoryB3Date": dateTodayApi,
                    "tradingSegmentDate": dateTodayApi,
                    "cvmRegistryDate": dateTodayApi,
                    "taxBenefitIndicator": false,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.outrasCondicoes,
                    "conditionDate": this.next_wdate,
                    "categoryCvmDate": dateTodayApi,
                    "cvmCode": 4534,
                    "tradingMarkets": [
                        {
                            "startDate": this.next_wdate,
                            "endDate": "",
                            "roundLotStartDate": this.next_wdate,
                            "factorStartDate": this.next_wdate,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.accepted)

                cy.log(resp.body)

            })
        })

        it("GET - consultar mercado de negociação do emissor Cia. Aberta com situação listado alterado no put", function () {

            cy.getCEM('market/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEmissor)
                expect(resp.body).to.have.property('categoryCvmCode', EnumCategoriaCVM.b)
                expect(resp.body).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body).to.have.property('categoryB3Code', EnumCategoriaCVM.a)
                expect(resp.body).to.have.property('tradingSegmentCode', EnumSegmentoNegociacao.bolsa)
                expect(resp.body).to.have.property('marketIssuerStatusCode', EnumSituacaoEmissor.listado)
                expect(resp.body).to.have.property('startDateMarketIssuerStatus').contains('2020-11-23')
                expect(resp.body).to.have.property('endDateMarketIssuerStatus').contains(dateToday)
                expect(resp.body).to.have.property('categoryB3Date').contains(dateToday)
                expect(resp.body).to.have.property('cvmRegistryDate').contains(dateToday)
                expect(resp.body).to.have.property('taxBenefitIndicator', false)
                expect(resp.body).to.have.property('conditionTypeCode',  EnumNegociacaoSeparado.outrasCondicoes)
                expect(resp.body).to.have.property('conditionDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body).to.have.property('categoryCvmDate').contains(dateToday)
                expect(resp.body).to.have.property('cvmCode', 4534)
                expect(resp.body.tradingMarkets[0]).to.have.property('startDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('roundLotStartDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('factorStartDate').contains(this.next_wdate.slice(0, 10))
                expect(resp.body.tradingMarkets[0]).to.have.property('factorValue', EnumFatorCotacao.fator10)
                expect(resp.body.tradingMarkets[0]).to.have.property('roundLotValue', EnumLotePadrao.lote3)
                expect(resp.body.tradingMarkets[0]).to.have.property('tradeMarketTypeCode', EnumMercadoNegociacao.bolsaRendaFixa)
            })
        })

        it("DELETE - mercado de negociação cadastrado", () => {

            cy.deleteCEM('market', idEmissor).then(resp => {

                expect(resp.status).to.be.eq(EnumApi.noContent)

                cy.log(resp)
            })
        })

        it("GET - consultar mercado de negociação foi deletado", () => {

            cy.getCEM('market/' + idEmissor).then(resp => {

                expect(resp.status).to.be.eq(EnumApi.notFound)

                cy.log(resp)
            })
        })
        

        after("Delete Created issuer", () => {

                cy.deleteCEM('issuer', idEmissor)
            })        
        })
})  