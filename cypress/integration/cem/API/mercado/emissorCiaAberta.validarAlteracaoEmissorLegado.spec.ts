///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoEmissor, EnumCargo, EnumCategoriaB3, EnumCategoriaCVM, EnumTipoMercado, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumNegociacaoSeparado, EnumFatorCotacao, EnumLotePadrao, EnumMercadoNegociacao, EnumTipoAtivo, EnumFormaEmissaoAtivo, EnumTipoTransferencia } from '../../utilitarios/enum.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import AtivoUtilitarioSite from '../../utilitarios/ativo.utilitario'

let codigoNegociacaoEmissorAlterado = "KIKI"
let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let idEscriturador: number
let bloqueioProcuracao: number
let dateTodayApi = DataUtilitario.formatarDataHojeApi()
let isencaoFiscal: boolean
let codigoCVMCode: number
let idMercado: number
let idListaMercadoNegociacao: number
let idSetorClassificacao: number
let idEspecieControleAcionario: number
let emissorCNPJ: string
let nomeRepresentante: string
let dataConstituicao: string
let exercicioSocial: string
let emissorStatus: boolean
let nomeCompletoEmissor: string
let inscricaoMunicipal: string
let codigoCerEmissor: number
let email: string
let nomeReduzidoEmissor: string
let nomePregao: string
let idCargo: number = EnumCargo.diretorResponsavel
let idTipoAtivo: number = EnumTipoAtivo.preferencial
let idFormaEmissao: number = EnumFormaEmissaoAtivo.escritural
let idTipoTransferencia: number = EnumTipoTransferencia.eletronico
let idCategoriaCVMCode: number = EnumCategoriaCVM.b
let idTipoMercado: number = EnumTipoMercado.bolsa
let idTipoEmissor: number = EnumTipoEmissor.ciaAberta
let idCategoriaB3: number = EnumCategoriaB3.a
let idSegmentoNegociacao: number = EnumSegmentoNegociacao.bolsa
let idSituacaoEmissor: number = EnumSituacaoEmissor.listado
let idFatorCotacao: number = EnumFatorCotacao.fator10
let idLotePadrao: number = EnumLotePadrao.lote3
let idMercadoNegociacao: number = EnumMercadoNegociacao.bolsaRendaFixa
let idCategoriaB3Alterado: number = EnumCategoriaB3.a
let dataSeguinte: string
let idOutrasCondicoes: number = EnumNegociacaoSeparado.outrasCondicoes
let idListaAtivoPreferencial: number
let CNPJInstituicaoFinanceira: string
let instituicaoFinanceira: string
let mercadoUtilitario: MercadoUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite

describe('Emissor Cia Aberta - validar as alterações do emissor no legado', () => {
    const mercadoEmissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    mercadoEmissor.forEach((mercadoData: CemModel) => {

        before(() => {
            
            emissorUtilitarioApi = new EmissorUtilitarioApi()
            mercadoUtilitario = new MercadoUtilitarioApi()
            ativoUtilitario = new AtivoUtilitarioSite()
    

            cy.getCEM('Calendar/get-next-workingday').then(resp => {

                dataSeguinte = resp.body

                cy.log(resp.body)

            })

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(mercadoData.Emissor)
            
            cy.getCEM('issuer?searchQuery=' + mercadoData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)
                

            }).then(resp => {

                isencaoFiscal = false
                codigoCVMCode = 4538

                cy.postCEM('market',
                    {
                        "id": idEmissor,
                        "categoryCvmCode": idCategoriaCVMCode,
                        "marketTypeCode": idTipoMercado,
                        "issuerTypeCode": idTipoEmissor,
                        "categoryB3Code": idCategoriaB3,
                        "tradingSegmentCode": idSegmentoNegociacao,
                        "marketIssuerStatusCode": idSituacaoEmissor,
                        "startDateMarketIssuerStatus": dataSeguinte,
                        "endDateMarketIssuerStatus": dataSeguinte,
                        "categoryB3Date": dateTodayApi,
                        "tradingSegmentDate": dateTodayApi,
                        "cvmRegistryDate": dateTodayApi,
                        "taxBenefitIndicator": isencaoFiscal,
                        "taxBenefitStartDate": "",
                        "taxBenefitEndDate": "",
                        "conditionTypeCode": idOutrasCondicoes,
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
            }).then(resp => {

                idEscriturador = 1
                bloqueioProcuracao = 1

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
                    })
            }).then(resp => {

                idListaAtivoPreferencial = resp.body.issuerShares[0].id

                expect(resp.status).to.have.equal(EnumApi.accepted)

                cy.log(resp.body)
            })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("DELETE - validar delete do emissor no legado", () => {

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

        it("PUT NOVO CEM - validar alteração do emissor", () => {

            idSetorClassificacao = 6
            idEspecieControleAcionario = 3
            emissorCNPJ = mercadoData.Emissor.CNPJ
            nomeRepresentante = mercadoData.Emissor.Representante
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            exercicioSocial = "9999-06-27T13:27:02.827Z"
            emissorStatus = true
            nomeCompletoEmissor = "JOCADAONCA                                        "
            inscricaoMunicipal = mercadoData.Emissor.InscriçaoMunicipal
            codigoCerEmissor = 8881
            email = mercadoData.Emissor.Email
            nomeReduzidoEmissor = "JUCO                                              "
            nomePregao = mercadoData.Emissor.NomePregao
            instituicaoFinanceira = mercadoData.Emissor.InstituicaoFinanceira
            CNPJInstituicaoFinanceira = mercadoData.Emissor.CNPJInstituicaoFinanceira

            cy.putCEM('issuer',
                {
                    "id": idEmissor,
                    "issuerAcronym": codigoNegociacaoEmissorAlterado,
                    "issuerDocument": emissorCNPJ,
                    "issuerTypeCode": idTipoEmissor,
                    "sectorClassificationCode": idSetorClassificacao,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
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

                expect(resp.status).to.have.equal(EnumApi.accepted)

                cy.log(resp.body)
            })
        })

        it("GET - validar consulta do emissor após atualização no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', "NAO")
                expect(resp.body).to.have.property('cnbvDigit', "0")
                expect(resp.body).to.have.property('cnbvNumber', 0)
                //assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                //expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                //assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
                expect(resp.body).to.have.property('issuerDocument', emissorCNPJ)
                expect(resp.body).to.have.property('name', nomeReduzidoEmissor)
                expect(resp.body).to.have.property('participantCode', codigoCerEmissor)
                assert.isTrue(resp.body.registerDate.includes(dateTodayApi), "Data de registro")
                expect(resp.body).to.have.property('registrationInstitution', 21)
                expect(resp.body.representativeName.trim()).to.be.equal(nomeRepresentante.trim())
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('shareholderCode', 0)
                expect(resp.body).to.have.property('situationCode', "A")
                assert.isTrue(resp.body.situationDate.includes(dateTodayApi), "Data da situação")
                expect(resp.body.markets[0]).to.have.property('annuityExemptionCode', true)
                expect(resp.body.markets[0]).to.have.property('annuityExemptionStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberIndicator', "N  ")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('categoryB3Code', idCategoriaB3)
                assert.isTrue(resp.body.markets[0].categoryB3Date.includes(dateTodayApi), "Data da categoria B3")
                expect(resp.body.markets[0]).to.have.property('categoryCvmCode', EnumCategoriaCVM.b)
                assert.isTrue(resp.body.markets[0].categoryCvmDate.includes(dateTodayApi), "Data da categoria CVM date")
                assert.isTrue(resp.body.markets[0].changeDate.includes(dateTodayApi), "Data mudança")
                expect(resp.body.markets[0]).to.have.property('conditionTypeCode', EnumNegociacaoSeparado.outrasCondicoes)
                assert.isTrue(resp.body.markets[0].conditionTypeDate.includes(dataSeguinte), "Data da condição")
                expect(resp.body.markets[0]).to.have.property('cvmCode', codigoCVMCode)
                expect(resp.body.markets[0]).to.have.property('cvmRegistrationEndDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data do registro CVM")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceCode', 99)
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceValue', 0)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotCode', 99999)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('issuerAcrn', codigoNegociacaoEmissorAlterado)
                expect(resp.body.markets[0]).to.have.property('issuerAcrnPrevious', "KIKI")
                expect(resp.body.markets[0]).to.have.property('issuerActiveInd', "A")
                expect(resp.body.markets[0]).to.have.property('issuerClassCode', 16)
                expect(resp.body.markets[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerFullName', nomeCompletoEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerTypeCode', EnumTipoEmissor.ciaAberta)
                expect(resp.body.markets[0]).to.have.property('issuerTypeDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].marketIssuerStatusEndDate.includes(dataSeguinte), "Data de termino do status emissor")
                assert.isTrue(resp.body.markets[0].marketIssuerStatusStartDate.includes(dataSeguinte), "Data de inicio do status emissor")
                expect(resp.body.markets[0]).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body.markets[0]).to.have.property('marketTypeDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('parityDescription', "")
                assert.isTrue(resp.body.markets[0].parityRegistryDate.includes(dateTodayApi), "Data registro paridade")
                assert.isTrue(resp.body.markets[0].parityStartDate.includes(dateTodayApi), "Data inicio paridade")
                expect(resp.body.markets[0]).to.have.property('primarySectorCode', 3)
                expect(resp.body.markets[0]).to.have.property('quaternarySectorCode', 220)
                expect(resp.body.markets[0]).to.have.property('recbUltItrDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].registrationStockExchangeDate.includes(dateTodayApi), "Data de registro na bolsa de valores")
                expect(resp.body.markets[0]).to.have.property('secondarySectorCode', 18)
                expect(resp.body.markets[0]).to.have.property('sectorClassificationCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderValue', 0)
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleIndicator', "N")
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', false)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', EnumSegmentoNegociacao.bolsa)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[0]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(1)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscriturador)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 1)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data de inicio")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data de inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        })

        it("PUT - validar atualização do ativo", () => {

            idEscriturador = 164
            bloqueioProcuracao = 1

            cy.putCEM('IssuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": idListaAtivoPreferencial,
                            "shareTypeCode": idTipoAtivo,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissao,
                            "transferTypeCode": idTipoTransferencia,
                            "shareAdministratorCode": idEscriturador,
                            "procurationBlockIndicator": bloqueioProcuracao,
                        }
                    ]
                }).then(resp => {

                    idListaAtivoPreferencial = resp.body.issuerShares[0].id

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    cy.log(resp.body)
                })
        })

        it("GET - validar consulta do ativo após atualização no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', "NAO")
                expect(resp.body).to.have.property('cnbvDigit', "0")
                expect(resp.body).to.have.property('cnbvNumber', 0)
                assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
                expect(resp.body).to.have.property('issuerDocument', emissorCNPJ)
                expect(resp.body).to.have.property('name', nomeReduzidoEmissor)
                expect(resp.body).to.have.property('participantCode', codigoCerEmissor)
                assert.isTrue(resp.body.registerDate.includes(dateTodayApi), "Data de registro")
                expect(resp.body).to.have.property('registrationInstitution', 21)
                expect(resp.body.representativeName.trim()).to.be.equal(nomeRepresentante.trim())
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('shareholderCode', 0)
                expect(resp.body).to.have.property('situationCode', "A")
                assert.isTrue(resp.body.situationDate.includes(dateTodayApi), "Data da situação")
                expect(resp.body.markets[0]).to.have.property('annuityExemptionCode', true)
                expect(resp.body.markets[0]).to.have.property('annuityExemptionStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberIndicator', "N  ")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('categoryB3Code', idCategoriaB3)
                assert.isTrue(resp.body.markets[0].categoryB3Date.includes(dateTodayApi), "Data da categoria B3")
                expect(resp.body.markets[0]).to.have.property('categoryCvmCode', EnumCategoriaCVM.b)
                assert.isTrue(resp.body.markets[0].categoryCvmDate.includes(dateTodayApi), "Data da categoria CVM date")
                assert.isTrue(resp.body.markets[0].changeDate.includes(dateTodayApi), "Data mudança")
                expect(resp.body.markets[0]).to.have.property('conditionTypeCode', EnumNegociacaoSeparado.outrasCondicoes)
                assert.isTrue(resp.body.markets[0].conditionTypeDate.includes(dataSeguinte), "Data da condição")
                expect(resp.body.markets[0]).to.have.property('cvmCode', codigoCVMCode)
                expect(resp.body.markets[0]).to.have.property('cvmRegistrationEndDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data do registro CVM")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceCode', 99)
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceValue', 0)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotCode', 99999)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('issuerAcrn', codigoNegociacaoEmissorAlterado)
                expect(resp.body.markets[0]).to.have.property('issuerAcrnPrevious', "KIKI")
                expect(resp.body.markets[0]).to.have.property('issuerActiveInd', "A")
                expect(resp.body.markets[0]).to.have.property('issuerClassCode', 16)
                expect(resp.body.markets[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerFullName', nomeCompletoEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerTypeCode', EnumTipoEmissor.ciaAberta)
                expect(resp.body.markets[0]).to.have.property('issuerTypeDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].marketIssuerStatusEndDate.includes(dataSeguinte), "Data de termino do status emissor")
                assert.isTrue(resp.body.markets[0].marketIssuerStatusStartDate.includes(dataSeguinte), "Data de inicio do status emissor")
                expect(resp.body.markets[0]).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body.markets[0]).to.have.property('marketTypeDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('parityDescription', "")
                assert.isTrue(resp.body.markets[0].parityRegistryDate.includes(dateTodayApi), "Data registro paridade")
                assert.isTrue(resp.body.markets[0].parityStartDate.includes(dateTodayApi), "Data inicio paridade")
                expect(resp.body.markets[0]).to.have.property('primarySectorCode', 3)
                expect(resp.body.markets[0]).to.have.property('quaternarySectorCode', 220)
                expect(resp.body.markets[0]).to.have.property('recbUltItrDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].registrationStockExchangeDate.includes(dateTodayApi), "Data de registro na bolsa de valores")
                expect(resp.body.markets[0]).to.have.property('secondarySectorCode', 18)
                expect(resp.body.markets[0]).to.have.property('sectorClassificationCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderValue', 0)
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleIndicator', "N")
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', false)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', EnumSegmentoNegociacao.bolsa)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[0]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(1)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscriturador)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 164)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data de inicio")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data de inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        })

        it("PUT - validar atualização do mercado", function () {

            cy.putCEM('market',
                {
                    "id": idEmissor,
                    "categoryCvmCode": EnumCategoriaCVM.b,
                    "marketTypeCode": EnumTipoMercado.bolsa,
                    "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                    "categoryB3Code": idCategoriaB3Alterado,
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
                    "conditionDate": dataSeguinte,
                    "categoryCvmDate": dateTodayApi,
                    "cvmCode": 4538,
                    "tradingMarkets": [
                        {
                            "startDate": dataSeguinte,
                            "endDate": dataSeguinte,
                            "roundLotStartDate": dataSeguinte,
                            "factorStartDate": dataSeguinte,
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

        it("GET - validar consulta do mercado após atualização no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', "NAO")
                expect(resp.body).to.have.property('cnbvDigit', "0")
                expect(resp.body).to.have.property('cnbvNumber', 0)
                assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
                expect(resp.body).to.have.property('issuerDocument', emissorCNPJ)
                expect(resp.body).to.have.property('name', nomeReduzidoEmissor)
                expect(resp.body).to.have.property('participantCode', codigoCerEmissor)
                assert.isTrue(resp.body.registerDate.includes(dateTodayApi), "Data de registro")
                expect(resp.body).to.have.property('registrationInstitution', 21)
                expect(resp.body.representativeName.trim()).to.be.equal(nomeRepresentante.trim())
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('shareholderCode', 0)
                expect(resp.body).to.have.property('situationCode', "A")
                assert.isTrue(resp.body.situationDate.includes(dateTodayApi), "Data da situação")
                expect(resp.body.markets[0]).to.have.property('annuityExemptionCode', true)
                expect(resp.body.markets[0]).to.have.property('annuityExemptionStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberIndicator', "N  ")
                expect(resp.body.markets[0]).to.have.property('arbitrationChamberStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('categoryB3Code', idCategoriaB3)
                assert.isTrue(resp.body.markets[0].categoryB3Date.includes(dateTodayApi), "Data da categoria B3")
                expect(resp.body.markets[0]).to.have.property('categoryCvmCode', EnumCategoriaCVM.b)
                assert.isTrue(resp.body.markets[0].categoryCvmDate.includes(dateTodayApi), "Data da categoria CVM date")
                assert.isTrue(resp.body.markets[0].changeDate.includes(dateTodayApi), "Data mudança")
                expect(resp.body.markets[0]).to.have.property('conditionTypeCode', EnumNegociacaoSeparado.outrasCondicoes)
                assert.isTrue(resp.body.markets[0].conditionTypeDate.includes(dataSeguinte), "Data da condição")
                expect(resp.body.markets[0]).to.have.property('cvmCode', codigoCVMCode)
                expect(resp.body.markets[0]).to.have.property('cvmRegistrationEndDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data do registro CVM")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceCode', 99)
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('fundingInformationSourceValue', 0)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotCode', 99999)
                expect(resp.body.markets[0]).to.have.property('incomeTaxExemptionAliquotDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('issuerAcrn', codigoNegociacaoEmissorAlterado)
                expect(resp.body.markets[0]).to.have.property('issuerAcrnPrevious', "KIKI")
                expect(resp.body.markets[0]).to.have.property('issuerActiveInd', "A")
                expect(resp.body.markets[0]).to.have.property('issuerClassCode', 16)
                expect(resp.body.markets[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerFullName', nomeCompletoEmissor)
                expect(resp.body.markets[0]).to.have.property('issuerTypeCode', EnumTipoEmissor.ciaAberta)
                expect(resp.body.markets[0]).to.have.property('issuerTypeDate', "9999-12-31T00:00:00")
                assert.isFalse(resp.body.markets[0].marketIssuerStatusEndDate.includes(dataSeguinte), "Data de termino do status emissor")
                assert.isFalse(resp.body.markets[0].marketIssuerStatusStartDate.includes(dataSeguinte), "Data de inicio do status emissor")
                expect(resp.body.markets[0]).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body.markets[0]).to.have.property('marketTypeDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('parityDescription', "")
                assert.isTrue(resp.body.markets[0].parityRegistryDate.includes(dateTodayApi), "Data registro paridade")
                assert.isTrue(resp.body.markets[0].parityStartDate.includes(dateTodayApi), "Data inicio paridade")
                expect(resp.body.markets[0]).to.have.property('primarySectorCode', 3)
                expect(resp.body.markets[0]).to.have.property('quaternarySectorCode', 220)
                expect(resp.body.markets[0]).to.have.property('recbUltItrDate', "9999-12-31T00:00:00")
                assert.isTrue(resp.body.markets[0].registrationStockExchangeDate.includes(dateTodayApi), "Data de registro na bolsa de valores")
                expect(resp.body.markets[0]).to.have.property('secondarySectorCode', 18)
                expect(resp.body.markets[0]).to.have.property('sectorClassificationCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderCode', 0)
                expect(resp.body.markets[0]).to.have.property('shareHolderValue', 0)
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleIndicator', "N")
                expect(resp.body.markets[0]).to.have.property('sociallyResponsibleStartDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', false)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', EnumSegmentoNegociacao.bolsa)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[0]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(2)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscriturador)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 164)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data de inicio")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data de inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        })

        it("DELETE - deletar emissor", () => {

            cy.deleteCEM('issuer', + idEmissor).then(resp => {

                expect(resp.status).to.be.equal(EnumApi.noContent)

                cy.log(resp.body)
            })
        })

        it("GET - validar consulta após delete do emissor no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)

                cy.log(resp.body)

            })
        })
    })
})