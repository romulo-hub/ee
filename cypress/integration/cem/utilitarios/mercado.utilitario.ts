import CapitalPage from '../pages/capital.page'
import SharedPage from '../pages/shared.page'
import { CemModel } from '../model/cem.model'
import EmissorModel from "../model/emissor.model"
import { DataUtilitario } from './data.utilitario'
import { EmissorUtilitarioApi } from './emissor.utilitario'
import { EnumCategoriaB3, EnumCategoriaCVM, EnumFatorCotacao, EnumLotePadrao, EnumMercadoNegociacao, EnumNegociacaoSeparado, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumTipoEmissor, EnumTipoMercado } from './enum.utilitario'

let idEmissor: number
let dateTodayApi = DataUtilitario.formatarDataHojeApi()
let isencaoFiscal: boolean
let codigoCVMCode: number
let idMercado: number
let idListaMercadoNegociacao: number
let dataSeguinte: string
let emissorUtilitarioApi: EmissorUtilitarioApi
let cemModel: CemModel
let sharedPage: SharedPage
let capitalPage: CapitalPage

cemModel = new CemModel()
sharedPage = new SharedPage()
capitalPage = new CapitalPage()
emissorUtilitarioApi = new EmissorUtilitarioApi()

export class CapitalUtilitario {

    capitalUtilitarioApi() {

        return new MercadoUtilitarioApi()

    }
}

export class MercadoUtilitarioApi {

    cadastroMercadoSituacaoListado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            isencaoFiscal = false
            codigoCVMCode = 4540

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": EnumCategoriaB3.a,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.listado,
                    "startDateMarketIssuerStatus": dataSeguinte,
                    "endDateMarketIssuerStatus": dataSeguinte,
                    "categoryB3Date": dataSeguinte, //dateTodayApi
                    "tradingSegmentDate": dataSeguinte, //dateTodayApi
                    "cvmRegistryDate": dateTodayApi,
                    "taxBenefitIndicator": isencaoFiscal,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.outrasCondicoes,
                    "conditionDate": dataSeguinte,
                    "categoryCvmDate": dateTodayApi,
                    "aliquotCode": 0,
	                "tradingStartDate": dataSeguinte, //dateTodayApi
                    "cvmCode": codigoCVMCode,
                    "tradingMarkets": [
                        {
                            "startDate": dataSeguinte,
                            "endDate": "",
                            "roundLotStartDate": dataSeguinte,
                            "factorStartDate": dataSeguinte,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaFixa
                        }
                    ]
                }
            ).then(resp => {

                idMercado = resp.body.id
                idListaMercadoNegociacao = resp.body.tradingMarkets[0].id

                cy.log(resp.body)
            })
        })
    }

    cadastroMercadoSituacaoApenasAdmitidoANegociacao(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            isencaoFiscal = false
            codigoCVMCode = 4540

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.outros,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.emissorBDR,
                    "categoryB3Code": EnumCategoriaB3.categoriaB3BDR3,
                    "tradingSegmentCode": EnumSegmentoNegociacao.bolsa,
                    "marketIssuerStatusCode": EnumSituacaoEmissor.apenasAdmitidoNegociacao,
                    "startDateMarketIssuerStatus": dataSeguinte,
                    "endDateMarketIssuerStatus": dataSeguinte,
                    "categoryB3Date": dataSeguinte, //dateTodayApi
                    "tradingSegmentDate": dataSeguinte, //dateTodayApi
                    "cvmRegistryDate": dateTodayApi,
                    "taxBenefitIndicator": isencaoFiscal,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": EnumNegociacaoSeparado.outrasCondicoes,
                    "conditionDate": dataSeguinte,
                    "categoryCvmDate": dateTodayApi,
                    "aliquotCode": 0,
	                "tradingStartDate": dataSeguinte, //dateTodayApi
                    "cvmCode": codigoCVMCode,
                    "tradingMarkets": [
                        {
                            "startDate": dataSeguinte,
                            "endDate": "",
                            "roundLotStartDate": dataSeguinte,
                            "factorStartDate": dataSeguinte,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote3,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaVariavel
                        }
                    ]
                }
            ).then(resp => {

                idMercado = resp.body.id
                idListaMercadoNegociacao = resp.body.tradingMarkets[0].id

                cy.log(resp.body)
            })
        })
    }
}

export default CapitalUtilitario