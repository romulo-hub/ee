/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioSite } from '../../utilitarios/emissor.utilitario'
import { MercadoUtilitarioApi } from "../../utilitarios/mercado.utilitario"
import { CapitalUtilitario } from "../../utilitarios/capital.utilitario"
import {AtivoUtilitarioSite} from '../../utilitarios/ativo.utilitario'
import { EnumApi, EnumTipoEmissor } from '../../utilitarios/enum.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalUtilitario: CapitalUtilitario
let mercadoUtilitario: MercadoUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite

let issuerTypeCode: number = EnumTipoEmissor.ciaIncentivada
let idEmissor: number
let idEndereco: number
let addressName: string
let addressNumber: string
let addressComplementName: string
let cityName: string
let stateName: string
let countryName: string
let postalCode: string
let phoneNumber: string
let phoneComplementNumber: string
let faxNumber: string
let faxComplementNumber: string
let addressTypeCode: number
let districtName: string
let issuerCode: number

describe('Emissor cia incentivada e criação de endereço', () => {
    const endereco = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    endereco.forEach((enderecoData: CemModel) => {

        before(() => {

            emissorUtilitarioSite = new EmissorUtilitarioSite()
            capitalUtilitario = new CapitalUtilitario()
            mercadoUtilitario = new MercadoUtilitarioApi()
            ativoUtilitario = new AtivoUtilitarioSite()

            //Armazenar datas necessarias para validações em testes 
            cy.getNextWorkingDay().as('next_wdate')
            cy.getDate().as('today_date')

            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(enderecoData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(enderecoData.Emissor)
           
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(enderecoData.Emissor)
            capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoNominalComVariosAtivosCadastrado(enderecoData.Emissor)

            cy.getCEM('issuer?searchQuery=' + enderecoData.Emissor.CodigoEmissor).then(resp => {

                idEmissor = resp.body[0].id

                cy.log(resp.body)
            })
        })
        beforeEach(() => {

            cy.viewport(1366, 768)
        
        })

            it('PUT - Criação do endereço', () => {
                addressName = "rua 20 de março"
                addressNumber = "100"
                addressComplementName = "casa 2"
                cityName = "São Paulo"
                stateName = "SP"
                countryName = "Brasil"
                postalCode =   "0002354090"
                phoneNumber = "55 011 50568300"
                phoneComplementNumber = "55 011 50568300"
                faxNumber = "55 011 50568300"
                faxComplementNumber = "55 011 50568300"
                addressTypeCode = 1
                districtName = ""

                cy.putCEM('address',
                    {
                        "issuerTypeCode": issuerTypeCode,
                        "addresses": [
                            {
                                "addressName": addressName,
                                "addressNumber": addressNumber,
                                "addressComplementName": addressComplementName,
                                "cityName": cityName,
                                "stateName": stateName,
                                "countryName": countryName,
                                "postalCode": postalCode,
                                "phoneNumber": phoneNumber,
                                "phoneComplementNumber": phoneComplementNumber,
                                "faxNumber": faxNumber,
                                "faxComplementNumber": faxComplementNumber,
                                "addressTypeCode": addressTypeCode,
                                "issuerCode": idEmissor,
                                "districtName": districtName
                            }
                        ]
                    })
                    .then(resp => {
                        expect(resp.status).to.have.equal(EnumApi.accepted)
                        idEndereco = resp.body.addresses[0].id
                        cy.log(resp.body)
                    })
            })


            it('GET - Validar pesquisa de endereço por id do endereço', () => {


                cy.getCEM('address/' + idEndereco).then(resp => {
                    expect(resp.status).to.have.equal(EnumApi.success)
                    expect(resp.body.addressName).to.have.equal(addressName)
                    expect(resp.body.addressNumber).to.have.equal(addressNumber)
                    expect(resp.body.addressComplementName).to.have.equal(addressComplementName)
                    expect(resp.body.cityName).to.have.equal(cityName)
                    expect(resp.body.stateName).to.have.equal(stateName)
                    expect(resp.body.countryName).to.have.equal(countryName)
                    expect(resp.body.postalCode).to.have.equal(postalCode)
                    expect(resp.body.phoneNumber).to.have.equal(phoneNumber)
                    expect(resp.body.phoneComplementNumber).to.have.equal(phoneComplementNumber)
                    expect(resp.body.faxNumber).to.have.equal(faxNumber)
                    expect(resp.body.faxComplementNumber).to.have.equal(faxComplementNumber)
                    expect(resp.body.addressTypeCode).to.have.equal(addressTypeCode)
                    expect(resp.body.issuerCode).to.have.equal(idEmissor)

                    cy.log(resp.body)
                })
            })

            it('GET - Validar pesquisa de endereço por id do emissor', () => {


                cy.getCEM('address/addressByIssuerCode/' + idEmissor).then(resp => {
                    expect(resp.status).to.have.equal(EnumApi.success)
                    expect(resp.body.issuerCode).to.have.equal(idEmissor)
                    expect(resp.body.mailingAddressInactive).to.have.equal(true)
                    expect(resp.body.addresses[0].addressName).to.have.equal(addressName)
                    expect(resp.body.addresses[0].addressNumber).to.have.equal(addressNumber)
                    expect(resp.body.addresses[0].addressComplementName).to.have.equal(addressComplementName)
                    expect(resp.body.addresses[0].cityName).to.have.equal(cityName)
                    expect(resp.body.addresses[0].stateName).to.have.equal(stateName)
                    expect(resp.body.addresses[0].countryName).to.have.equal(countryName)
                    expect(resp.body.addresses[0].postalCode).to.have.equal(postalCode)
                    expect(resp.body.addresses[0].phoneNumber).to.have.equal(phoneNumber)
                    expect(resp.body.addresses[0].phoneComplementNumber).to.have.equal(phoneComplementNumber)
                    expect(resp.body.addresses[0].faxNumber).to.have.equal(faxNumber)
                    expect(resp.body.addresses[0].faxComplementNumber).to.have.equal(faxComplementNumber)
                    expect(resp.body.addresses[0].addressTypeCode).to.have.equal(addressTypeCode)
                    expect(resp.body.addresses[0].issuerCode).to.have.equal(idEmissor)

                    cy.log(resp.body)
                })
            })

            it('DELETE - Pelo id do endereço', () => {

                cy.deleteCEM('address', idEndereco).then(resp => {
                expect(resp.status).to.be.eq(EnumApi.noContent)
                cy.log(resp.body)
            })
            })

            it('GET - Consultar tipo de endereço', () => {

                cy.getCEM('address/getAddresTypeList').then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.success)

                    cy.log(resp.body)

                })
            })

            it('GET - Consultar lista de estados', () => {

                cy.getCEM('address/getStateList').then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.success)

                    cy.log(resp.body)

                })
            })

            after("Delete Emissor criado para o teste", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})