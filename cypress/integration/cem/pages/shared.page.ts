export class SharedPage {

    menuCadastro() {

        cy.get('[id="menuItemWithChild"]',{timeout:40000}).contains('Cadastro').click()

    }

    menuCadastroEmissor() {

        return cy.get('[id="register_issuer"]',{timeout:20000}).click()

    }

    menuManutencao() {

        return cy.get('[id="menuItemWithChild"]',{timeout:20000}).get('[id="menu_maintenance"]').contains('Manutenção')

    }

    menuRelatorio() {

        return cy.get('[id="menuItemWithChild"]',{timeout:20000}).get('[id="menu_reports"]').contains('Relatório')

    }

    buscaEmissores() {

        return cy.get('[id="searchIssuer"]')

    }

    lupaPesquisaEmissores() {

        return cy.get('[id="btn_submit"]')

    }

    novoEmissor() {

        return cy.get('[id="newIssuer"]').contains('Novo Emissor')

    }

    tituloNomePregaoAposCadastro(text) {

        return cy.get('[id="tradingName"]',{timeout:10000}).should('contain', text)

    }

    tituloNomePregaoAposAlteracaoCadastro(text) {

        return cy.get('[id="tradingName"]').should('contain', text)

    }

    tituloNomePregaoAntesCadastro() {

        return cy.get('[id="tradingName"]').should('contain.value', '')

    }

    deleteBtnBuscaEmissores() {

        return cy.get('[id="btn_clear"]')

    }

    editarCadastroEmissor() {

        return cy.get('[id="btn_edit"]')

    }

    razaoSocialEmissorBuscaEmissores() {

        return cy.get('[id="cell_razao"]')

    }

    tipoEmissorBuscaEmissores() {

        return cy.get('[id="cell_tipoEmissor"]')

    }

    codigoEmissorBuscaEmissores() {

        return cy.get('[id="cell_sigla"]',{timeout:10000})

    }

    nomePregaoEmissorBuscaEmissores() {

        return cy.get('[id="cell_nomePregao"]')

    }

    emissorCNPJBuscaEmissores() {

        return cy.get('[id="cell_cnpj"]')

    }

    subMenuEmissor() {

        return cy.get('[class="mat-tab-label-content"]').get('mat-icon').get('[id="issuer"]')

    }

    subMenuMercado() {

        return cy.get('[class="mat-tab-label-content"]').get('mat-icon').get('[id="market"]')

    }

    subMenuAtivo() {

        return cy.get('[class="mat-tab-label-content"]').get('mat-icon').get('[id="share"]')

    }

    subMenuCapital(shouldBeEnabled:boolean=true) {
        if(shouldBeEnabled)
            return cy.get('[class="mat-tab-label-content"]').parent().should('not.have.class','mat-tab-disabled',{timeout:10000}).get('mat-icon').get('[id="capital"]')
        else
        return cy.get('[class="mat-tab-label-content"]').parent().get('mat-icon').get('[id="capital"]')

    }

    subMenuEndereco() {

        return cy.get('[class="mat-tab-label-content"]').get('mat-icon').get('[id="address"]')

    }
}

export default SharedPage