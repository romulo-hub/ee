export class EnderecoSedePage {

    menuEndSede() {

        return cy.get('mat-panel-title').contains('Endereço sede').click()

    }

    enderecoSede() {

        return cy.get('[id="headOffice-addressName"]')

    }

    numeroSede() {

        return cy.get('[id="headOffice-addressNumber"]')

    }

    complementoSede() {

        return cy.get('[id="headOffice-addressComplementName"]')

    }

    cepSede() {

        return cy.get('[id="headOffice-postalCode"]')

    }

    paisSede() {

        return cy.get('[id="headOffice-countryName"]')

    }

    estadoSede() {

        return cy.get('[id="headOffice-stateName"]').click()

    }

    optionSelectEstadoSede(text) {

        return cy.get('[id="select-headOffice-stateName"]').click()
            .get('[id="select-headOffice-stateName-panel"]').contains(text).click()

    }

    validarOptionSelectEstadoSede(text) {

        return cy.get('[id="select-headOffice-stateName"]').contains(text).should('be.visible')

    }

    cidadeSede() {

        return cy.get('[id="headOffice-cityName"]')

    }

    telefone1Sede() {

        return cy.get('[id="headOffice-phoneNumber"]')

    }

    telefone2Sede() {

        return cy.get('[id="headOffice-phoneComplementNumber"]')

    }

    fax1Sede() {

        return cy.get('[id="headOffice-faxNumber"]')

    }

    fax2Sede() {

        return cy.get('[id="headOffice-faxComplementNumber"]')

    }

    enderecoCorrespondencia() {

        return new enderecoCorrespondencia()

    }

    manterMesmoEndereco() {

        return cy.get('[id="mailingAddressInactive"]')

    }

    salvarEndereco() {

        return cy.get('app-address-detail').get('[type="submit"]').contains('Salvar')

    }

    botaoSalvarEndereco() {

        return cy.get('[id="btn_action"]').contains('INCLUIR')

    }

    incluirEndereco() {

        this.salvarEndereco().click()
        this.botaoSalvarEndereco().click()

    }
}

export class enderecoCorrespondencia {

    menuEndCor() {

        return cy.get('[formgroupname="mailingAddress"]').click()

    }

    corEndereco() {

        return cy.get('[id="mailingAddress-addressName"]')

    }

    corNumero() {

        return cy.get('[id="mailingAddress-addressNumber"]')

    }

    corComplemento() {

        return cy.get('[id="mailingAddress-addressComplementName"]')

    }

    corCep() {

        return cy.get('[id="mailingAddress-postalCode"]')

    }

    corPais() {

        return cy.get('[id="mailingAddress-countryName"]')

    }

    corEstado() {

        return cy.get('[id="mailingAddress-stateName"]').click()

    }

    optionSelectCorEstado(text) {

        return cy.get('[id="select-mailingAddress-stateName"]').click()
            .get('[id="select-mailingAddress-stateName-panel"]').contains(text).click()

    }

    validarOptionSelectCorEstado(text) {

        return cy.get('[id="mailingAddress-stateName"]').should('have.value', text).should('be.visible')

    }

    corCidade() {

        return cy.get('[id="mailingAddress-cityName"]')

    }

    corTelefone1() {

        return cy.get('[id="mailingAddress-phoneNumber"]')

    }

    corTelefone2() {

        return cy.get('[id="mailingAddress-phoneComplementNumber"]')

    }

    corFax1() {

        return cy.get('[id="mailingAddress-faxNumber"]')

    }

    corFax2() {

        return cy.get('[id="mailingAddress-faxComplementNumber"]')

    }
}

export default EnderecoSedePage