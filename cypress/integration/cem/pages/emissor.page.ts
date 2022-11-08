export class EmissorPage {

    status() {

        return cy.get('[id="optIssuerStatusIndicator"]')

    }

    codigoEmissor() {

        return cy.get('[id="txtIssuerAcronym"]')

    }

    razaoSocial() {

        return cy.get('[id="txtIssuerName"]')

    }

    inscriçaoMunicipal() {

        return cy.get('[id="txtMunicipalRegistration"]')

    }

    representante() {

        return cy.get('[id="txtRepresentativeName"]')

    }

    cargo() {

        return cy.get('[id="optPosition"]')

    }

    setor() {

        return cy.get('[id="sectorClassificationCode"]')

    }

    tipoEmissor() {

        return cy.get('[id="optIssuerTypeCode"]')

    }

    botaoOkMensagemSetor(){
        return cy.get('#btn_action',{timeout:10000})
    }

    nomePregao() {

        return cy.get('[placeholder="Nome de Pregão"]')

    }

    emissorCNPJ() {

        return cy.get('[id="txtIssuerDocument"]')

    }

    dataConstituiçao() {

        return cy.get('[id="txtConstitutionDate"]')

    }

    exercicioSocial() {

        return cy.get('[id="financialYearEndDate"]')

    }

    instituicaoFinanceira() {

        return cy.get('[id="txtFinancialInstitutionName"]')

    }

    instituicaoFinanceiraCNPJ() {

        return cy.get('[id="txtFinancialInstitutionDocument"]')

    }

    email() {

        return cy.get('[id="txtEmail"]')

    }

    especieControleAcionario() {

        return cy.get('[id="optShareControlTypeCode"]')

    }

    salvarCadastro() {

        return cy.get('[id="btn_submit"]').contains('Salvar').click()

    }

    salvarCadastroEmissor() {

        this.salvarCadastro()
        cy.get('[id="btn_action"]').contains('INCLUIR').click()

    }

    cancelarCadastroEmissor() {

        this.salvarCadastro()
        cy.get('[id="btn_dismiss"]').contains(' Cancelar ').click()

    }

    alterarCadastroEmissor() {

        this.salvarCadastro()
        cy.get('[id="btn_action"]').contains('Alterar ').click()
        this.msgAlterarCadastroEmissor()

    }

    msgAlterarCadastroEmissor() {

        return cy.contains('Emissor alterado com sucesso', { timeout: 13000 }).should('be.visible')

    }

    msgCadastroNovoEmissor() {

        return cy.contains('Emissor criado com sucesso', { timeout: 13000 }).should('be.visible')

    }

    cnpjBancoLiquidante(){
        return cy.get('#txtSettlingInstitutionDocument',{timeout:10000})
    }

    descricaoBancoLiquidante(){
        return cy.get('#txtSettlingInstitutionName', {timeout:10000})
    }

    cnpjInstituiçaoDepositaria(){
        return cy.get('#txtCustodianInstitutionDocument',{timeout:10000})
    }

    descricaoInstituicaoDepositaria(){
        return cy.get('#txtCustodianInstitutionName',{timeout:10000})
    }

}

export default EmissorPage