///<reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumTipoEmissor, EnumCargo, EnumCategoriaB3, EnumCategoriaCVM, EnumTipoMercado, EnumSegmentoNegociacao, EnumSituacaoEmissor, EnumNegociacaoSeparado, EnumFatorCotacao, EnumLotePadrao, EnumMercadoNegociacao, EnumTipoAtivo, EnumFormaEmissaoAtivo, EnumTipoTransferencia, EnumNivelEmissaoBDR } from '../../utilitarios/enum.utilitario'
import AtivoUtilitarioSite from '../../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import { DataUtilitario } from '../../utilitarios/data.utilitario'

let codigoNegociacaoEmissorAlterado = "KIKI"
let idEscrituradorAlterado: number
let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let idEscriturador: number
let bloqueioProcuracao: number
let dateTodayApi = DataUtilitario.formatarDataHojeApi()
let isencaoFiscal: boolean
let codigoCVMCode: number
let idListaAtivoBdr: number
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
let idTipoAtivo: number = EnumTipoAtivo.bdr
let idFormaEmissao: number = EnumFormaEmissaoAtivo.escritural
let idTipoTransferencia: number = EnumTipoTransferencia.eletronico
let idTipoEmissor: number = EnumTipoEmissor.emissorBDR
let idCategoriaB3: number = EnumCategoriaB3.a
let idSegmentoNegociacao: number = EnumSegmentoNegociacao.bolsa
let idCategoriaB3Alterado: number = EnumCategoriaB3.a
let dataSeguinte: string
let qtdeBDR: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let CNPJInstituicaoFinanceira: string
let instituicaoFinanceira: string

describe('Emissor BDR - validar as alterações do emissor no legado', () => {
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

            emissorUtilitarioApi.criarEmissorBDRNP(mercadoData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(mercadoData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoBDRApi(mercadoData.Emissor)
            cy.getCEM('issuer?searchQuery=' + mercadoData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

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
            nomeRepresentante = mercadoData.Emissor.Representante
            dataConstituicao = "2020-06-27T13:27:02.827Z",
            exercicioSocial = "9999-02-24T22:12:41.098Z",
            emissorStatus = true
            nomeCompletoEmissor = "JOCADAONCA"
            inscricaoMunicipal = mercadoData.Emissor.InscriçaoMunicipal
            codigoCerEmissor = 5566
            email = mercadoData.Emissor.Email
            nomeReduzidoEmissor = "BUGG"
            nomePregao = mercadoData.Emissor.NomePregao
            instituicaoFinanceira = mercadoData.Emissor.InstituicaoFinanceira
            CNPJInstituicaoFinanceira = mercadoData.Emissor.CNPJInstituicaoFinanceira
            
           
            cy.putCEM('issuer',
            {
                "consitutionDate": null,
                "custodianInstitutionDocument": Cypress.env("CnpjApiDepositaria"),
                "custodianInstitutionName": "NOME TESTE 8890",
                "emailName": email,
                "financialYearEndDate": exercicioSocial,
                "hasAddress": false,
                "hasCapital": false,
                "hasMarket": true,
                "hasShare": true,
                "id": idEmissor,
                "issuerAcronym": codigoNegociacaoEmissorAlterado,
                "issuerDocument": "",
                "issuerName": nomeReduzidoEmissor,
                "issuerStatusIndicator": true,
                "issuerTypeCode": idTipoEmissor,
                "issuerTypeDesc": "Emissor de Bdr",
                "municiplaInsCriptionCode": inscricaoMunicipal,
                "representativeName": nomeRepresentante,
                "representativePositionCode": 2,
                "sectorClassificationCode": null,
                "settlingInstitutionDocument": Cypress.env("CnpjApiLiquidante"),
                "settlingInstitutionName": "ITAU UNIBANCO S/A",
                "shareControlTypeCode": 1,
                "tradingName": nomePregao,
            }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.accepted)

                cy.log(resp.body)
            })
        })

       /*  it("GET - validar consulta do emissor após atualização no legado", () => {    
                 
            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                bloqueioProcuracao = 1
                codigoCVMCode = 4531
                isencaoFiscal = false
                idEscriturador = 193

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', 'NAO')
                expect(resp.body).to.have.property('cnbvDigit', '0')
                expect(resp.body).to.have.property('cnbvNumber', 0)
                assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
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
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data registro cvm")
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
                assert.isFalse(resp.body.markets[0].marketIssuerStatusEndDate.includes(dateTodayApi), "Data de termino do status emissor")
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
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', isencaoFiscal)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', idSegmentoNegociacao)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[0]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(1)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscriturador)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 193)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data inicio escriturador desde")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        }) */

        it("PUT - validar atualização do ativo", () => {

            idEscrituradorAlterado = 261
            qtdeBDR = ""
            bloqueioProcuracao = 1

            cy.putCEM('IssuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": idListaAtivoBdr,
                            "shareTypeCode": idTipoAtivo,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissao,
                            "transferTypeCode": idTipoTransferencia,
                            "shareAdministratorCode": idEscrituradorAlterado,
                            "procurationBlockIndicator": bloqueioProcuracao
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.accepted)

                    idListaAtivoBdr = resp.body.issuerShares[0].id

                    cy.log(resp.body)
                })
        })

       /*  it("GET - validar consulta do ativo após atualização no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', 'NAO')
                expect(resp.body).to.have.property('cnbvDigit', '0')
                expect(resp.body).to.have.property('cnbvNumber', 0)
                assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
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
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data registro cvm")
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
                assert.isFalse(resp.body.markets[0].marketIssuerStatusEndDate.includes(dateTodayApi), "Data de termino do status emissor")
                assert.isTrue(resp.body.markets[0].marketIssuerStatusStartDate.includes(dataSeguinte), "Data de inicio do status emissor")
                expect(resp.body.markets[0]).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body.markets[0]).to.have.property('marketTypeDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('parityDescription', qtdeBDR)
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
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', isencaoFiscal)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', idSegmentoNegociacao)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[0]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(1)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 261)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data inicio escriturador desde")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        }) */

        it("PUT - validar atualização do mercado", () => {

                isencaoFiscal = false
                codigoCVMCode = 4531

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
                    "cvmCode": 4531,
                    "tradingMarkets": [
                        {
                            "startDate": dataSeguinte,
                            "endDate": dataSeguinte,
                            "roundLotStartDate": dataSeguinte,
                            "factorStartDate": dataSeguinte,
                            "factorValue": EnumFatorCotacao.fator10,
                            "roundLotValue": EnumLotePadrao.lote1,
                            "tradeMarketTypeCode": EnumMercadoNegociacao.bolsaRendaVariavel
                        }
                    ]
                }
            ).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.accepted)
                idMercado = resp.body.id
                idListaMercadoNegociacao = resp.body.tradingMarkets[0].id

                cy.log(resp.body)

            })
        })

       /*  it("GET - validar consulta do mercado após atualização no legado", () => {

            cy.getCEM('IssuerLegacy/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('authorizedCapital', 'NAO')
                expect(resp.body).to.have.property('cnbvDigit', '0')
                expect(resp.body).to.have.property('cnbvNumber', 0)
                assert.isTrue(resp.body.constitutionDate.includes("2020-06-27T13:27:02.827"), "Data de constituição")
                expect(resp.body).to.have.property('fileTransferTypeCode', 0)
                assert.isTrue(resp.body.financialYearEndDate.includes("9999-12-31T00:00:00"), "Data fim de exercicio social")
                expect(resp.body).to.have.property('id', idEmissor)
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
                assert.isTrue(resp.body.markets[0].cvmRegistryDate.includes(dateTodayApi), "Data registro cvm")
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
                assert.isTrue(resp.body.markets[0].marketIssuerStatusEndDate.includes(dateTodayApi), "Data de termino do status emissor")
                assert.isFalse(resp.body.markets[0].marketIssuerStatusStartDate.includes(dataSeguinte), "Data de inicio do status emissor")
                expect(resp.body.markets[0]).to.have.property('marketTypeCode', EnumTipoMercado.bolsa)
                expect(resp.body.markets[0]).to.have.property('marketTypeDate', "9999-12-31T00:00:00")
                expect(resp.body.markets[0]).to.have.property('parityDescription', qtdeBDR)
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
                expect(resp.body.markets[0]).to.have.property('taxBenefitIndicator', isencaoFiscal)
                expect(resp.body.markets[0]).to.have.property('tertiarySectorCode', 83)
                expect(resp.body.markets[0]).to.have.property('tradingName', nomePregao)
                expect(resp.body.markets[0]).to.have.property('tradingSegmentCode', idSegmentoNegociacao)
                assert.isTrue(resp.body.markets[0].tradingSegmentDate.includes(dateTodayApi), "Data de segmento")
                expect(resp.body.markets[1]).to.have.property('userName', "                    ")
                expect(resp.body.markets).to.be.length(2)
                expect(resp.body.shares[0]).to.have.property('issuerCode', idEmissor)
                expect(resp.body.shares[0]).to.have.property('issuingTypeCode', idFormaEmissao)
                expect(resp.body.shares[0]).to.have.property('procurationBlockIndicator', bloqueioProcuracao)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCode', idEscrituradorAlterado)
                expect(resp.body.shares[0]).to.have.property('shareAdministratorCustCode', 261)
                expect(resp.body.shares[0]).to.have.property('shareTypeCode', idTipoAtivo)
                assert.isTrue(resp.body.shares[0].startDate.includes(dataSeguinte), "Data inicio escriturador desde")
                assert.isTrue(resp.body.shares[0].startDateCust.includes(dataSeguinte), "Data inicio cust")
                assert.isTrue(resp.body.shares[0].validityStart.includes(dataSeguinte), "Data inicio de validade")
                expect(resp.body.shares).to.be.length(1)

                cy.log(resp.body)

            })
        }) */

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

        after("Delete Created issuer", () => {

            cy.deleteCEM('issuer', idEmissor)
        })        
    })
   
})