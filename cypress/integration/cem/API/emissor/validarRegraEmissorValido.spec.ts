/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { DataUtilitario } from '../../utilitarios/data.utilitario'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
import { EnumApi, EnumTipoClasseAtivo, EnumTipoEmissor, EnumTipoPrecoCapital } from '../../utilitarios/enum.utilitario'

let dataHoje = DataUtilitario.formatarDataHojeApi()
let idEmissor: number
let idTipoCalculoCapital: number = EnumTipoPrecoCapital.nominal
let resgatavelAtivoOrdinarioCapital: boolean
let qtdeAtivoOrdinarioCapital: number
let tagAlongAtivoOrdinarioCapital: number
let controleAcionarioAtivoOrdinarioCapital: number
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let idTipoEmissor: number = EnumTipoEmissor.ciaAberta
let nomeEndereco: string
let numeroEndereco: string
let nomeComplementoEndereco: string
let cidadeEndereco: string
let estadoEndereco: string
let paisEndereco: string
let enderecoCEP: string
let numeroTelefone: string
let numeroComplementoTelefone: string
let numeroFAX: string
let numeroFaxComplemento: string
let idTipoEndereco: number = 1

describe('Validar a regra do emissor válido', () => {
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
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

            emissorUtilitarioApi.criarEmissorCiaAbertaApi(capitalData.Emissor)
            cy.getCEM('issuer?searchQuery=' + capitalData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)

            })
        })

        it('Validar a obrigatoriedade do preenchimento da aba mercado ao tentar cadastrar o capital', () => {

            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalData.Emissor)

            valorUnitAcaoCapital = 3200
            valorPrecoCapital = 24872
            qtdeAtivoOrdinarioCapital = 1600
            controleAcionarioAtivoOrdinarioCapital = 0
            tagAlongAtivoOrdinarioCapital = 96
            resgatavelAtivoOrdinarioCapital = true

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
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.conflict)
                    assert.isTrue(resp.body.description.includes("Emissor deve ter mercado e ativo cadastrado"), "Não tem mercado cadastrado")

                    cy.log(resp.body)
                })
        })

        it('Validar a obrigatoriedade do preenchimento da aba ativo ao tentar cadastrar o capital', () => {

            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)

            valorUnitAcaoCapital = 3200
            valorPrecoCapital = 24872
            qtdeAtivoOrdinarioCapital = 1600
            controleAcionarioAtivoOrdinarioCapital = 0
            tagAlongAtivoOrdinarioCapital = 96
            resgatavelAtivoOrdinarioCapital = true

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
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.conflict)
                    assert.isTrue(resp.body.description.includes("Emissor deve ter mercado e ativo cadastrado"), "Não tem ativo cadastrado")

                    cy.log(resp.body)
                })
        })

        it('Validar a obrigatoriedade do preenchimento da aba mercado ao tentar cadastrar o endereço', () => {

            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalData.Emissor)

            nomeEndereco = 'Rua Edu Chaves'
            numeroEndereco = '110'
            nomeComplementoEndereco = 'casa'
            cidadeEndereco = 'Botucatu'
            estadoEndereco = 'SP'
            paisEndereco = 'Brasil'
            enderecoCEP = '18618316'
            numeroTelefone = '55 011 50568300'
            numeroComplementoTelefone = null
            numeroFAX = '55 011 50568300'
            numeroFaxComplemento = null

            cy.putCEM('address',
                {
                    "issuerTypeCode": idTipoEmissor,
                    "addresses": [
                        {
                            "addressName": nomeEndereco,
                            "addressNumber": numeroEndereco,
                            "addressComplementName": nomeComplementoEndereco,
                            "cityName": cidadeEndereco,
                            "stateName": estadoEndereco,
                            "countryName": paisEndereco,
                            "postalCode": enderecoCEP,
                            "phoneNumber": numeroTelefone,
                            "phoneComplementNumber": numeroComplementoTelefone,
                            "faxNumber": numeroFAX,
                            "faxComplementNumber": numeroFaxComplemento,
                            "addressTypeCode": idTipoEndereco,
                            "issuerCode": idEmissor
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.conflict)
                    assert.isTrue(resp.body.description.includes("Emissor deve ter mercado e ativo cadastrado"), "Não tem ativo cadastrado")

                    cy.log(resp.body)
                })
        })

        it('Validar a obrigatoriedade do preenchimento da aba ativo ao tentar cadastrar o endereço', () => {

            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)

            nomeEndereco = 'Rua Edu Chaves'
            numeroEndereco = '110'
            nomeComplementoEndereco = 'casa'
            cidadeEndereco = 'Botucatu'
            estadoEndereco = 'SP'
            paisEndereco = 'Brasil'
            enderecoCEP = '18618316'
            numeroTelefone = '55 011 50568300'
            numeroComplementoTelefone = null
            numeroFAX = '55 011 50568300'
            numeroFaxComplemento = null

            cy.putCEM('address',
                {
                    "issuerTypeCode": idTipoEmissor,
                    "addresses": [
                        {
                            "addressName": nomeEndereco,
                            "addressNumber": numeroEndereco,
                            "addressComplementName": nomeComplementoEndereco,
                            "cityName": cidadeEndereco,
                            "stateName": estadoEndereco,
                            "countryName": paisEndereco,
                            "postalCode": enderecoCEP,
                            "phoneNumber": numeroTelefone,
                            "phoneComplementNumber": numeroComplementoTelefone,
                            "faxNumber": numeroFAX,
                            "faxComplementNumber": numeroFaxComplemento,
                            "addressTypeCode": idTipoEndereco,
                            "issuerCode": idEmissor
                        }
                    ]
                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.conflict)
                    assert.isTrue(resp.body.description.includes("Emissor deve ter mercado e ativo cadastrado"), "Não tem ativo cadastrado")

                    cy.log(resp.body)
                })
        })

        afterEach("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})