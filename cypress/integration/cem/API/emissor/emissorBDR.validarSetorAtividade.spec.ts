/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumCargo, EnumTipoEmissor } from '../../utilitarios/enum.utilitario'
import { MercadoUtilitarioApi } from '../../utilitarios/mercado.utilitario'
import { AtivoUtilitarioSite } from '../../utilitarios/ativo.utilitario'
const dayjs = require('dayjs');


let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi
let codEmissor: string
let razaoSocial: string
let inscricaoMunicipal: string
let representante: string
let idCargo: number
let instituicaoFinanceira: string
let instituicaoFinanceiraCNPJ: string
let idEspecieControleAcionario: number
let email: string
let dataConstituicao: string
let exercicioSocial: string
let nomePregao: string
let idTipoEmissor: number
let status: boolean
let idParticipanteEmissor: string
let nomeCompletoEmissor: string
let emailAlterado: string

describe('Validar o setor de atividade para o setor de atividade para o emissor BDR', () => {
    const emissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()
            ativoUtilitario = new AtivoUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            codEmissor = emissorData.Emissor.CodigoEmissor
            razaoSocial = emissorData.Emissor.RazaoSocial
            inscricaoMunicipal = emissorData.Emissor.InscriçaoMunicipal
            representante = emissorData.Emissor.Representante
            idCargo = EnumCargo.diretorResponsavel
            instituicaoFinanceira = emissorData.Emissor.InstituicaoFinanceira
            instituicaoFinanceiraCNPJ = emissorData.Emissor.CNPJInstituicaoFinanceira
            idEspecieControleAcionario = 1
            email = emissorData.Emissor.Email
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            exercicioSocial = "9999-02-24T22:12:41.098Z"
            nomePregao = emissorData.Emissor.NomePregao
            idTipoEmissor = EnumTipoEmissor.emissorBDR
            status = true
            idParticipanteEmissor = "5874"
            nomeCompletoEmissor = "TESTE"

            cy.postCEM('issuer',
                {
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "financialYearEndDate": exercicioSocial,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    //"constitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "issuerParticipantCode": idParticipanteEmissor,
                    "emailName": email,
                    "financialInstitutionName": instituicaoFinanceira,
                    "financialInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    idEmissor = resp.body.id
                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('GET por idEmissor - Validar o setor de atividade para emissor BDR após o cadastro', () => {

            cy.getCEM('issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEmissor)
                //assert.isTrue(resp.body.consitutionDate.includes(dayjs(dataConstituicao).format('YYYY-MM-DD')), "Data Constituição")
                expect(resp.body).to.have.property('emailName', email)                
                assert.isTrue(resp.body.financialYearEndDate.includes(dayjs(exercicioSocial).format('YYYY-MM-DD')), "Data Exercicio Social")
                expect(resp.body).to.have.property('hasAddress', false)
                expect(resp.body).to.have.property('hasCapital', false)
                expect(resp.body).to.have.property("hasMarket", false)
                expect(resp.body).to.have.property('hasShare', false)
                expect(resp.body).to.have.property('isRegistrationComplete', false)
                expect(resp.body).to.have.property('issuerAcronym', codEmissor)
                expect(resp.body).to.have.property('issuerCompleteName', nomeCompletoEmissor)
                expect(resp.body).to.have.property("issuerName", razaoSocial)
                expect(resp.body).to.have.property('issuerStatusIndicator', status)
                expect(resp.body).to.have.property('issuerTypeCode', idTipoEmissor)
                expect(resp.body).to.have.property('issuerTypeDesc', "Emissor de Bdr")
                expect(resp.body).to.have.property("municiplaInsCriptionCode", inscricaoMunicipal)
                expect(resp.body).to.have.property('representativeName', representante)
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('tradingName', nomePregao)

                cy.log(resp.body)

            })
        })

        it('PUT - Alterar o registro do emissor', () => {

            emailAlterado = "testequalidade@teste.com.br"

            cy.putCEM('issuer',
                {
                    "id": idEmissor,
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "financialYearEndDate": exercicioSocial,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    //"consitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "issuerParticipantCode": idParticipanteEmissor,
                    "emailName": emailAlterado,
                    "financialInstitutionName": instituicaoFinanceira,
                    "financialInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    cy.log(resp.body)

                })
        })

        it('GET por idEmissor - Validar o setor de atividade para emissor BDR após alteração cadastro', () => {

            cy.getCEM('issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEmissor)
                //assert.isTrue(resp.body.consitutionDate.includes(dayjs(dataConstituicao).format('YYYY-MM-DD')), "Data Constituição")
                expect(resp.body).to.have.property('emailName', emailAlterado)
                assert.isTrue(resp.body.financialYearEndDate.includes(dayjs(exercicioSocial).format('YYYY-MM-DD')), "Data Exercicio Social")
                expect(resp.body).to.have.property('hasAddress', false)
                expect(resp.body).to.have.property('hasCapital', false)
                expect(resp.body).to.have.property("hasMarket", false)
                expect(resp.body).to.have.property('hasShare', false)
                expect(resp.body).to.have.property('isRegistrationComplete', false)
                expect(resp.body).to.have.property('issuerAcronym', codEmissor)
                expect(resp.body).to.have.property('issuerCompleteName', nomeCompletoEmissor)
                expect(resp.body).to.have.property("issuerName", razaoSocial)
                expect(resp.body).to.have.property('issuerStatusIndicator', status)
                expect(resp.body).to.have.property('issuerTypeCode', idTipoEmissor)
                expect(resp.body).to.have.property('issuerTypeDesc', "Emissor de Bdr")
                expect(resp.body).to.have.property("municiplaInsCriptionCode", inscricaoMunicipal)
                expect(resp.body).to.have.property('representativeName', representante)
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('tradingName', nomePregao)

                cy.log(resp.body)

            })
        })

        it('Cadastrar o mercado e o ativo do emissor', () => {

            mercadoUtilitario.cadastroMercadoSituacaoListado(emissorData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(emissorData.Emissor)

        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})