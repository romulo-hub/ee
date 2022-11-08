///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoEmissor, EnumCategoriaB3, EnumCategoriaCVM, EnumTipoMercado, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumNegociacaoSeparado, EnumFatorCotacao, EnumLotePadrao, EnumMercadoNegociacao, EnumTipoAtivo, EnumFormaEmissaoAtivo, EnumTipoTransferencia, EnumCargo } from '../../utilitarios/enum.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'

let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let idEscriturador: number
let bloqueioProcuracao: boolean
let dateTodayApi = DataUtilitario.formatarDataHojeApi()
let isencaoFiscal: boolean
let codigoCVMCode: number
let idListaAtivoOrdinario: number
let idMercado: number
let idListaMercadoNegociacao: number
let codigoEmissor: string
let idSetorClassificacao: number
let idEspecieControleAcionario: number
let emissorCNPJ: string
let nomeRepresentante: string
let dataConstituicao: string
let exercicioSocial: string
let emissorStatus: boolean
let nomeCompletoEmissor: string
let inscricaoMunicipal: string
let codigoCerEmissor: string
let email: string
let nomeReduzidoEmissor: string
let nomePregao: string
let idCargo: number = EnumCargo.diretorResponsavel
let idTipoAtivo: number = EnumTipoAtivo.ordinario
let idFormaEmissao: number = EnumFormaEmissaoAtivo.escritural
let idTipoTransferencia: number = EnumTipoTransferencia.eletronico
let idCategoriaCVMCode: number = EnumCategoriaCVM.b
let idTipoMercado: number = EnumTipoMercado.bolsa
let idTipoEmissor: number = EnumTipoEmissor.ciaAberta
let idCategoriaB3: number = EnumCategoriaB3.a
let idSegmentoNegociacao: number = EnumSegmentoNegociacao.bolsa
let idSituacaoEmissor: number = EnumSituacaoEmissor.listado
let idNegociacaoSeparado: number = EnumNegociacaoSeparado.intervencao
let idFatorCotacao: number = EnumFatorCotacao.fator10
let idLotePadrao: number = EnumLotePadrao.lote3
let idMercadoNegociacao: number = EnumMercadoNegociacao.bolsaRendaFixa
let dataSeguinte: string
let CNPJInstituicaoFinanceira: string
let instituicaoFinanceira: string


describe('validar a inclusao do emissor até o cadastro do ativo no emissor legado - emissor cia. aberta', () => {
    const mercadoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    mercadoEmissor.forEach((mercadoData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()

            cy.getCEM('Calendar/get-next-workingday').then(resp => {

                dataSeguinte = resp.body

                cy.log(resp.body)

            })

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("POST NOVO CEM - validar inclusão do emissor", function () {

            codigoEmissor = mercadoData.Emissor.CodigoEmissor
            idSetorClassificacao = 10
            idEspecieControleAcionario = 3
            emissorCNPJ = mercadoData.Emissor.CNPJ
            nomeRepresentante = mercadoData.Emissor.Representante
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            exercicioSocial = "9999-06-27T13:27:02.827Z"
            emissorStatus = true
            nomeCompletoEmissor = 'jocadaonca'
            inscricaoMunicipal = mercadoData.Emissor.InscriçaoMunicipal
            codigoCerEmissor = 'nove'
            email = mercadoData.Emissor.Email
            nomeReduzidoEmissor = 'juck'
            nomePregao = mercadoData.Emissor.NomePregao
            instituicaoFinanceira = mercadoData.Emissor.InstituicaoFinanceira 
            CNPJInstituicaoFinanceira = mercadoData.Emissor.CNPJInstituicaoFinanceira
            

            cy.postCEM('issuer',
                {
                    "issuerAcronym": codigoEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "sectorClassificationCode": idSetorClassificacao,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "issuerDocument": emissorCNPJ,
                    "tradingName": nomePregao,
                    "issuerName": nomeReduzidoEmissor,
                    "representativeName": nomeRepresentante,
                    "consitutionDate": dataConstituicao,
                    "financialYearEndDate": exercicioSocial,
                    "issuerStatusIndicator": emissorStatus,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "issuerParticipantCode": codigoCerEmissor,
                    "emailName": email,
                    "financialInstitutionName": instituicaoFinanceira,
                    "financialInstitutionDocument": CNPJInstituicaoFinanceira
                }
            ).then(resp => {

                idEmissor = resp.body.id

                expect(resp.status).to.have.equal(EnumApi.created)
                

                cy.log(resp.body)
            })
        })

        it("DELETE LEGADO - validar delete do emissor no legado", () => {

            cy.deleteCEM('IssuerLegacy', idEmissor).then(resp => {

                expect(resp.status).to.be.equal(EnumApi.noContent)

                cy.log(resp.body)
            })
        })

        it('GET LEGADO - validar que delete do legado foi realizado', () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("IssuerLegacy_GetById"), "Não tem mercado cadastrado, por isso o emissor não foi localizado no legado.")

                cy.log(resp.body)

            })
        })

        it("PUT - cadastrar um ativo", () => {

            idEscriturador = 164
            bloqueioProcuracao = false

            cy.putCEM('IssuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivo,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissao,
                            "transferTypeCode": idTipoTransferencia,
                            "shareAdministratorCode": idEscriturador,
                            "procurationBlockIndicator": bloqueioProcuracao,
                        }
                    ]
                }).then(resp => {

                    idListaAtivoOrdinario = resp.body.issuerShares[0].id

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    cy.log(resp.body)
                })
        })

        it("GET LEGADO - validar que o ativo não foi cadastrado no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("IssuerLegacy_GetById"), "Não tem mercado cadastrado, por isso o ativo não foi localizado no legado.")

                cy.log(resp.body)

            })
        })

        it("POST NOVO CEM - validar inclusão do mercado", () => {

            isencaoFiscal = false
            codigoCVMCode = 4531

            cy.postCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": idCategoriaCVMCode,
                    "marketTypeCode": idTipoMercado,
                    "issuerTypeCode": idTipoEmissor,
                    "categoryB3Code": idCategoriaB3,
                    "tradingSegmentCode": idSegmentoNegociacao,
                    "marketIssuerStatusCode": idSituacaoEmissor,
                    "startDateMarketIssuerStatus": dateTodayApi,
                    "endDateMarketIssuerStatus": dataSeguinte,
                    "categoryB3Date": dateTodayApi,
                    "tradingSegmentDate": dateTodayApi,
                    "cvmRegistryDate": dateTodayApi,
                    "taxBenefitIndicator": isencaoFiscal,
                    "taxBenefitStartDate": "",
                    "taxBenefitEndDate": "",
                    "conditionTypeCode": idNegociacaoSeparado,
                    "conditionDate": dataSeguinte,
                    "categoryCvmDate": dateTodayApi,
                    "cvmCode": codigoCVMCode,
                    "tradingMarkets": [
                        {
                            "startDate": dataSeguinte,
                            "endDate": "",
                            "roundLotStartDate": dataSeguinte,
                            "factorStartDate": dataSeguinte,
                            "factorValue": idFatorCotacao,
                            "roundLotValue": idLotePadrao,
                            "tradeMarketTypeCode": idMercadoNegociacao
                        }
                    ]
                }
            ).then(resp => {

                idMercado = resp.body.id
                idListaMercadoNegociacao = resp.body.tradingMarkets[0].id

                expect(resp.status).to.have.equal(EnumApi.created)

                cy.log(resp.body)
            })
        })

        it("GET LEGADO - validar que o mercado e o ativo foi cadastrado no registro do emissor", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it("DELETE NOVO CEM - deletar emissor", () => {

            cy.deleteCEM('issuer', + idEmissor).then(resp => {

                expect(resp.status).to.be.equal(EnumApi.noContent)

                cy.log(resp.body)
            })
        })

        it("GET NOVO CEM - validar que o emissor cadastrado foi excluido", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("IssuerLegacy_GetById"), "Não tem emissor cadastrado, por isso lista vazia.")

                cy.log(resp.body)

            })
        })
    })
})