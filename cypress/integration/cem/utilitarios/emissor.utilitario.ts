import EmissorModel from "../model/emissor.model"
import SharedPage from '../pages/shared.page'
import { CemModel } from '../model/cem.model'
import EmissorPage from "../pages/emissor.page"
import { EnumCargo } from './enum.utilitario'
import { EnumTipoEmissor } from './enum.utilitario'

let emissorPage: EmissorPage
let sharedPage: SharedPage
let cemModel: CemModel
let emissor: EmissorModel

emissorPage = new EmissorPage()
sharedPage = new SharedPage()
cemModel = new CemModel()

export class EmissorUtilitarioSite {

    emissorUtilitarioApiModal() {

        return new EmissorUtilitarioApi()

    }

    consultarEmissorCadastradoSiteModal() {

        return new ConsultarEmissorCadastradoSite()

    }

    criarEmissorCiaAberta(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.setor().selectOption(emissor.Setor)        
        emissorPage.tipoEmissor().selectOption("Cia. Aberta")
        
        if (emissor.CNPJ)
            emissorPage.emissorCNPJ().type(emissor.CNPJ)
        emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.email().type(emissor.Email)
        emissorPage.exercicioSocial().type(emissor.ExercicioSocial)
        emissorPage.cargo().selectOption(emissor.Cargo)
        emissorPage.especieControleAcionario().selectOption(emissor.EspecieControleAcionario)

        emissorPage.cnpjBancoLiquidante().should("be.enabled").type(Cypress.env("CnpjLiquidante"));
        emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }

    criarEmissorCiaEstrangeira(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.setor().selectOption(emissor.Setor)
        emissorPage.tipoEmissor().selectOption("Cia. Estrangeira")
        if (emissor.CNPJ)
            emissorPage.emissorCNPJ().type(emissor.CNPJ)
        emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.email().type(emissor.Email)
        emissorPage.exercicioSocial().type(emissor.ExercicioSocial)
        emissorPage.cargo().selectOption(emissor.Cargo)
        //emissorPage.especieControleAcionario().selectOption(emissor.EspecieControleAcionario)
        
        emissorPage.cnpjBancoLiquidante().should("be.enabled").type(Cypress.env("CnpjLiquidante"));
        emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

        emissorPage.cnpjInstituiçaoDepositaria().should("be.enabled").type(Cypress.env("CnpjDepositaria"));
        emissorPage.descricaoInstituicaoDepositaria().focus().should("not.be.undefined");

        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }

    criarEmissorBDRNP(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.tipoEmissor().selectOption("Emissor de Bdr")
        emissorPage.setor().should('not.be.enabled')
        emissorPage.emissorCNPJ().should('not.be.enabled')
        //emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.email().type(emissor.Email)
        emissorPage.exercicioSocial().type(emissor.ExercicioSocial)
        emissorPage.cargo().selectOption(emissor.Cargo)
        //emissorPage.especieControleAcionario().selectOption(emissor.EspecieControleAcionario)

        emissorPage.cnpjBancoLiquidante().should("be.enabled").type(Cypress.env("CnpjLiquidante"));
        emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

        emissorPage.cnpjInstituiçaoDepositaria().should("be.enabled").type(Cypress.env("CnpjDepositaria"));
        emissorPage.descricaoInstituicaoDepositaria().focus().should("not.be.undefined");

        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }

    criarEmissorCiaIncentivada(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.setor().selectOption(emissor.Setor)
        emissorPage.tipoEmissor().selectOption("Cia. Incentivada")
        if (emissor.CNPJ)
            emissorPage.emissorCNPJ().type(emissor.CNPJ)
        //emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.email().type(emissor.Email)
        //emissorPage.exercicioSocial().type(emissor.ExercicioSocial)
        emissorPage.cargo().selectOption(emissor.Cargo)
        //emissorPage.especieControleAcionario().selectOption(emissor.EspecieControleAcionario)
        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }

    criarEmissorDispRegCVM(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.tipoEmissor().selectOption("Disp. Reg. Cvm")
        if (emissor.CNPJ)
            emissorPage.emissorCNPJ().type(emissor.CNPJ)
        //emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.setor().should('not.be.enabled')
        emissorPage.email().type(emissor.Email)
        emissorPage.exercicioSocial().should('not.be.enabled')
        emissorPage.cargo().contains('Diretor Responsável')
        emissorPage.especieControleAcionario().contains('Outras Naturezas')
        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }

    criarEmissorOutrosEmissores(emissor: EmissorModel) {

        emissorPage.status().selectOption(emissor.Status)
        emissorPage.codigoEmissor().type(emissor.CodigoEmissor)
        emissorPage.razaoSocial().type(emissor.RazaoSocial)
        if (emissor.InscriçaoMunicipal)
            emissorPage.inscriçaoMunicipal().type(emissor.InscriçaoMunicipal)
        else
            emissorPage.inscriçaoMunicipal().click()
        emissorPage.representante().type(emissor.Representante)
        emissorPage.nomePregao().type(emissor.NomePregao)
        emissorPage.setor().selectOption(emissor.Setor)
        emissorPage.tipoEmissor().selectOption("Outros Emissores")        
        if (emissor.CNPJ)
            emissorPage.emissorCNPJ().type(emissor.CNPJ)
        emissorPage.dataConstituiçao().type(emissor.DataConstituiçao)
        emissorPage.email().type(emissor.Email)
        emissorPage.exercicioSocial().type(emissor.ExercicioSocial)
        emissorPage.cargo().selectOption(emissor.Cargo)
        emissorPage.especieControleAcionario().selectOption(emissor.EspecieControleAcionario)
        emissorPage.salvarCadastroEmissor()
        emissorPage.msgCadastroNovoEmissor()

    }
}

export class EmissorUtilitarioApi {

    criarEmissorCiaAbertaApi(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.ciaAberta,
                "sectorClassificationCode": 6,
                "shareControlTypeCode": 1,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "issuerDocument": emissor.CNPJ,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
                "financialYearEndDate": "9999-12-31T22:12:41.098Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)

            })
    }

    criarEmissorCiaEstrangeiraApi(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.ciaEstrangeira,
                "sectorClassificationCode": 135,
                "shareControlTypeCode": 1,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "issuerDocument": emissor.CNPJ,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
                "financialYearEndDate": "9999-02-24T22:12:41.098Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)

            })
    }

    criarEmissorBDRNP(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.emissorBDR,
                "shareControlTypeCode": 1,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
                "financialYearEndDate": "9999-02-24T22:12:41.098Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)
            })
    }

    criarEmissorCiaIncentivada(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.ciaIncentivada,
                "sectorClassificationCode": 135,
                "shareControlTypeCode": 1,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "issuerDocument": emissor.CNPJ,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
             // "financialYearEndDate": "2021-02-24T22:12:41.098Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)

            })
    }

    criarEmissorDispRegCVM(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.dispRegCVM,
                "shareControlTypeCode": 8,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "issuerDocument": emissor.CNPJ,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)

            })
    }

    criarEmissorOutrosEmissores(emissor: EmissorModel) {

        cy.postCEM('issuer',
            {
                "issuerAcronym": emissor.CodigoEmissor,
                "issuerTypeCode": EnumTipoEmissor.outrosEmissores,
                "sectorClassificationCode": 135,
                "shareControlTypeCode": 1,
                "representativePositionCode": EnumCargo.diretorResponsavel,
                "issuerDocument": emissor.CNPJ,
                "tradingName": emissor.NomePregao,
                "issuerName": emissor.RazaoSocial,
                "representativeName": emissor.Representante,
                "consitutionDate": "2020-06-27T13:27:02.827Z",
                "financialYearEndDate": "9999-02-24T22:12:41.098Z",
                "issuerStatusIndicator": true,
                "issuerCompleteName": "A",
                "municiplaInsCriptionCode": emissor.InscriçaoMunicipal,
                "issuerParticipantCode": "string",
                "emailName": emissor.Email,
                "financialInstitutionName": emissor.InstituicaoFinanceira,
                "financialInstitutionDocument": emissor.CNPJInstituicaoFinanceira

            }).then(resp => {

                cy.log(resp.body)

            })
    }
}

export class ConsultarEmissorCadastradoSite {

    consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, cemModel) {

        sharedPage.menuCadastro()
        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.CodigoEmissor + '{Enter}')
        sharedPage.codigoEmissorBuscaEmissores().contains(cemModel.Emissor.CodigoEmissor).should('be.visible')
        sharedPage.editarCadastroEmissor().click()
        sharedPage.subMenuEmissor().click()

    }

    consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, cemModel) {

        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.CodigoEmissor)
        sharedPage.lupaPesquisaEmissores().click()
        sharedPage.codigoEmissorBuscaEmissores().contains(cemModel.Emissor.CodigoEmissor).should('be.visible')
        sharedPage.editarCadastroEmissor().first().click()
        sharedPage.subMenuEmissor().click()

    }

    consultarNomePregaoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, cemModel) {

        //nomePregaoPesquisa vai receber o nome pregão do JSON Emissor
        let nomePregaoPesquisa = cemModel.Emissor.NomePregao

        //alterar o nome pregão para letra maiúsculo
        nomePregaoPesquisa = nomePregaoPesquisa.toUpperCase()

        sharedPage.menuCadastro()
        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.NomePregao)
        sharedPage.lupaPesquisaEmissores().click()
        sharedPage.nomePregaoEmissorBuscaEmissores().contains(nomePregaoPesquisa).should('be.visible')
        sharedPage.editarCadastroEmissor().first().click()
        sharedPage.subMenuEmissor().click()

    }

    consultarCNPJEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, cemModel) {

        //cnpjPesquisa vai receber o CNPJ do emissor do JSON Emissor
        let cnpjPesquisa = cemModel.Emissor.CNPJ

        //colocar mascara CNPJ
        cnpjPesquisa = cnpjPesquisa.replace(/\D/g, '')
            .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

        //tirar a mascara CNPJ
        /*cnpjPesquisa = cnpjPesquisa.replace(/\D/g, '')
            .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1$2$3$4$5") */

        sharedPage.menuCadastro()
        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.CNPJ)
        sharedPage.lupaPesquisaEmissores().click()
        sharedPage.emissorCNPJBuscaEmissores().contains(cnpjPesquisa).should('be.visible')
        sharedPage.editarCadastroEmissor().click()
        sharedPage.subMenuEmissor().click()

    }
}

export default EmissorUtilitarioSite