/// <reference types="Cypress" />

import { CemModel } from '../../model/cem.model'
import { EmissorUtilitarioApi } from '../../utilitarios/emissor.utilitario'
import { EnumApi, EnumCargo, EnumTipoEmissor } from '../../utilitarios/enum.utilitario'

const dayjs = require('dayjs');


let idEmissor: number
let emissorUtilitarioApi: EmissorUtilitarioApi
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
let emissorCNPJ: string
let nomePregao: string
let idTipoEmissor: number
let status: boolean
let nomeCompletoEmissor: string
let emailAlterado: string
let exercicioSocial: string
let idSetorAtividade: number

describe('Cadastrar emissor Cia Aberta', () => {
    const emissor = require('../../../../fixtures/emissor/emissor.json')

    //Required step to test with more than one data in json.
    emissor.forEach((emissorData: CemModel) => {

        before(() => {

            emissorUtilitarioApi = new EmissorUtilitarioApi()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it('POST - Cadastrar o emissor Cia Aberta', () => {

            codEmissor = emissorData.Emissor.CodigoEmissor
            razaoSocial = emissorData.Emissor.RazaoSocial
            inscricaoMunicipal = emissorData.Emissor.InscriçaoMunicipal
            representante = emissorData.Emissor.Representante
            idSetorAtividade = 66
            idCargo = EnumCargo.diretorResponsavel
            instituicaoFinanceira = emissorData.Emissor.InstituicaoFinanceira
            instituicaoFinanceiraCNPJ = emissorData.Emissor.CNPJInstituicaoFinanceira
            idEspecieControleAcionario = 2
            email = emissorData.Emissor.Email
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            emissorCNPJ = "55692268000123"
            nomePregao = emissorData.Emissor.NomePregao
            idTipoEmissor = EnumTipoEmissor.ciaAberta
            status = true
            nomeCompletoEmissor = "TESTE001"
            exercicioSocial = "9999-02-24T22:12:41.098Z"

            
            cy.postCEM('issuer',
                {
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "sectorClassificationCode": idSetorAtividade,
                    "issuerDocument": emissorCNPJ,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    "financialYearEndDate": exercicioSocial,
                    "constitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "emailName": email,
                    "settlingInstitutionName": instituicaoFinanceira,
                    "settlingInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    idEmissor = resp.body.id
                    expect(resp.status).to.have.equal(EnumApi.created)

                    cy.log(resp.body)

                })
        })

        it('GET por idEmissor - Consultar emissor cadastrado', () => {

            cy.getCEM('issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEmissor)
                assert.isTrue(resp.body.constitutionDate.includes(dayjs(dataConstituicao).format('YYYY-MM-DD')), "Data Constituição")
                expect(resp.body).to.have.property('emailName', email)
                expect(resp.body).to.have.property('settlingInstitutionDocument', instituicaoFinanceiraCNPJ)
                expect(resp.body).to.have.property("settlingInstitutionName", instituicaoFinanceira)
                assert.isTrue(resp.body.financialYearEndDate.includes(dayjs(exercicioSocial).format('YYYY-MM-DD')), "Data Exercicio Social")
                expect(resp.body).to.have.property('hasAddress', false)
                expect(resp.body).to.have.property('hasCapital', false)
                expect(resp.body).to.have.property("hasMarket", false)
                expect(resp.body).to.have.property('hasShare', false)
                expect(resp.body).to.have.property('isRegistrationComplete', false)
                expect(resp.body).to.have.property('issuerDocument', emissorCNPJ)
                expect(resp.body).to.have.property('issuerAcronym', codEmissor)
                expect(resp.body).to.have.property('issuerCompleteName', nomeCompletoEmissor)
                expect(resp.body).to.have.property("issuerName", razaoSocial)
                expect(resp.body).to.have.property('issuerStatusIndicator', status)
                expect(resp.body).to.have.property('issuerTypeCode', idTipoEmissor)
                expect(resp.body).to.have.property('issuerTypeDesc', "Cia. Aberta")
                expect(resp.body).to.have.property("municiplaInsCriptionCode", inscricaoMunicipal)
                expect(resp.body).to.have.property('representativeName', representante)
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property("sectorClassificationCode", idSetorAtividade)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('tradingName', nomePregao)

                cy.log(resp.body)

            })
        })

        it('PUT - Alterar o registro do emissor cadastrado', () => {

            emailAlterado = "qualidade@teste.com.br"

            cy.putCEM('issuer',
                {
                    "id": idEmissor,
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "financialYearEndDate": exercicioSocial,
                    "sectorClassificationCode": idSetorAtividade,
                    "issuerDocument": emissorCNPJ,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    "constitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "emailName": emailAlterado,
                    "settlingInstitutionName": instituicaoFinanceira,
                    "settlingInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.accepted)
                    cy.log(resp.body)

                })
        })

        it('GET por idEmissor - Consultar as alterações realizadas no emissor cadastrado', () => {

            cy.getCEM('issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)
                expect(resp.body).to.have.property('id', idEmissor)
                assert.isTrue(resp.body.constitutionDate.includes(dayjs(dataConstituicao).format('YYYY-MM-DD')), "Data Constituição")
                expect(resp.body).to.have.property('emailName', emailAlterado)
                expect(resp.body).to.have.property('settlingInstitutionDocument', instituicaoFinanceiraCNPJ)
                expect(resp.body).to.have.property("settlingInstitutionName", instituicaoFinanceira)
                assert.isTrue(resp.body.financialYearEndDate.includes(dayjs(exercicioSocial).format('YYYY-MM-DD')), "Data Exercicio Social")
                expect(resp.body).to.have.property('hasAddress', false)
                expect(resp.body).to.have.property('hasCapital', false)
                expect(resp.body).to.have.property("hasMarket", false)
                expect(resp.body).to.have.property('hasShare', false)
                expect(resp.body).to.have.property('isRegistrationComplete', false)
                expect(resp.body).to.have.property('issuerDocument', emissorCNPJ)
                expect(resp.body).to.have.property('issuerAcronym', codEmissor)
                expect(resp.body).to.have.property('issuerCompleteName', nomeCompletoEmissor)
                expect(resp.body).to.have.property("issuerName", razaoSocial)
                expect(resp.body).to.have.property('issuerStatusIndicator', status)
                expect(resp.body).to.have.property('issuerTypeCode', idTipoEmissor)
                expect(resp.body).to.have.property('issuerTypeDesc', "Cia. Aberta")
                expect(resp.body).to.have.property("municiplaInsCriptionCode", inscricaoMunicipal)
                expect(resp.body).to.have.property('representativeName', representante)
                expect(resp.body).to.have.property('representativePositionCode', idCargo)
                expect(resp.body).to.have.property("sectorClassificationCode", idSetorAtividade)
                expect(resp.body).to.have.property('shareControlTypeCode', idEspecieControleAcionario)
                expect(resp.body).to.have.property('tradingName', nomePregao)

                cy.log(resp.body)

            })
        })

        it('Consultar emissor por código emissor', () => {

            cy.getCEM('issuer/getIssuerByAcronymAsync?acronym=' + codEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('Consultar emissor por nome pregão', () => {

            cy.getCEM('issuer/getIssuerByTradingNameAsync?tradingName=' + nomePregao).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('Consultar emissor por nome razão social', () => {

            cy.getCEM('issuer/getIssuerByNameAsync?issuerName=' + razaoSocial).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('Consultar emissor por status do emissor', () => {

            cy.getCEM('issuer/getAllIssuerStatusIndicator').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('GET ALL - Consultar emissores cadastrados', () => {

            cy.getCEM('issuer').then(resp => {

                expect(resp.status).to.have.equal(EnumApi.success)

                cy.log(resp.body)

            })
        })

        it('POST - Validar a mensagem de erro ao tentar cadastrar emissor com código emissor já cadastrado', () => {

            codEmissor = emissorData.Emissor.CodigoEmissor
            razaoSocial = emissorData.Emissor.RazaoSocial
            inscricaoMunicipal = emissorData.Emissor.InscriçaoMunicipal
            representante = emissorData.Emissor.Representante
            idSetorAtividade = 66
            idCargo = EnumCargo.diretorResponsavel
            instituicaoFinanceira = emissorData.Emissor.InstituicaoFinanceira
            instituicaoFinanceiraCNPJ = emissorData.Emissor.CNPJInstituicaoFinanceira
            idEspecieControleAcionario = 2
            email = emissorData.Emissor.Email
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            emissorCNPJ = "06414138000113"
            nomePregao = emissorData.Emissor.NomePregao
            idTipoEmissor = EnumTipoEmissor.ciaAberta
            status = true
            nomeCompletoEmissor = "QATESTE"
            exercicioSocial = "9999-02-24T22:12:41.098Z"

            cy.postCEM('issuer',
                {
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "sectorClassificationCode": idSetorAtividade,
                    "issuerDocument": emissorCNPJ,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    "financialYearEndDate": exercicioSocial,
                    "constitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "emailName": email,
                    "settlingInstitutionName": instituicaoFinanceira,
                    "settlingInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.badRequest)                    
                    assert.isTrue(resp.body.description.includes("Código de Emissor já existe :"), "Código de Emissor já existe")

                    cy.log(resp.body)

                })
        })

        /*it('POST - Validar a mensagem de erro ao tentar cadastrar emissor com CNPJ já cadastrado', () => {

            codEmissor = "BG70"
            razaoSocial = emissorData.Emissor.RazaoSocial
            inscricaoMunicipal = emissorData.Emissor.InscriçaoMunicipal
            representante = emissorData.Emissor.Representante
            idSetorAtividade = 66
            idCargo = EnumCargo.diretorResponsavel
            instituicaoFinanceira = emissorData.Emissor.InstituicaoFinanceira
            instituicaoFinanceiraCNPJ = emissorData.Emissor.CNPJInstituicaoFinanceira
            idEspecieControleAcionario = 2
            email = emissorData.Emissor.Email
            dataConstituicao = "2020-06-27T13:27:02.827Z"
            emissorCNPJ = "33113309000147"
            nomePregao = emissorData.Emissor.NomePregao
            idTipoEmissor = EnumTipoEmissor.ciaAberta
            status = true
            nomeCompletoEmissor = "QATESTE"
            exercicioSocial = "9999-02-24T22:12:41.098Z"

            cy.postCEM('issuer',
                {
                    "issuerAcronym": codEmissor,
                    "issuerTypeCode": idTipoEmissor,
                    "shareControlTypeCode": idEspecieControleAcionario,
                    "representativePositionCode": idCargo,
                    "sectorClassificationCode": idSetorAtividade,
                    "issuerDocument": emissorCNPJ,
                    "tradingName": nomePregao,
                    "issuerName": razaoSocial,
                    "representativeName": representante,
                    "financialYearEndDate": exercicioSocial,
                    "constitutionDate": dataConstituicao,
                    "issuerStatusIndicator": status,
                    "issuerCompleteName": nomeCompletoEmissor,
                    "municiplaInsCriptionCode": inscricaoMunicipal,
                    "emailName": email,
                    "settlingInstitutionName": instituicaoFinanceira,
                    "settlingInstitutionDocument": instituicaoFinanceiraCNPJ

                }).then(resp => {

                    expect(resp.status).to.have.equal(EnumApi.badRequest)                    
                    assert.isTrue(resp.body.description.includes("CNPJ já existe :"), "CNPJ já existe")

                    cy.log(resp.body)

                })
        })*/

        it('DELETE - Deletar o emissor cadastrado', () => {

            cy.deleteCEM('issuer', idEmissor).then(resp => {

                expect(resp.status).to.be.eq(EnumApi.noContent)

                cy.log(resp)

            })
        })

        it('GET por idEmissor - Consultar o emissor excluído', function () {

            cy.getCEM('issuer/' + idEmissor).then(resp => {

                expect(resp.status).to.have.equal(EnumApi.notFound)
                assert.isTrue(resp.body.detail.includes("Issuer_GetById"), "Emissor foi excluído, por isso lista vazio.")

                cy.log(resp.body)

            })
        })

        it('DELETE - Deletar emissor que não existe', () => {

            let idEmissorNaoExiste = 32767
            cy.deleteCEM('issuer', idEmissorNaoExiste).then(resp => {

                expect(resp.status).to.be.eq(EnumApi.notFound)
                assert.isTrue(resp.body.description.includes("Emissor não encontrado : " + idEmissorNaoExiste), "Emissor informado não existe")

                cy.log(resp)

            })
        })

        after("Delete Created issuer", () => {
            cy.deleteCEM('issuer', idEmissor)
        })
    })
})