import AtivoModel from '../model/ativo.model'

export class AtivoPage {

    addAtivo() {
        return cy.get('app-issuer-share-list').within(() => {
            cy.get('button').get('[id="bt_add"]').contains('add').click()
        })
    }

    tipoAtivo() {

        return cy.get('[formcontrolname="shareTypeCode"]')

    }

    escriturador() {

        return cy.get('[formcontrolname="shareAdministratorName"]')

    }

    formaEmissao() {

        return cy.get('[placeholder="Forma de Emissão"]')

    }

    escrituradorDesde() {

        return cy.get('[placeholder="Escriturador Desde"]')

    }

    incluirDesabilitadoCadastroNovoAtivo() {

        return cy.get('app-button-flat-fw-b3').within(() => {
            cy.get('[id="btn_flat-fix"]').contains('Incluir').should('not.be.enabled')
        })
    }

    cancelarCadastroNovoAtivo() {

        return cy.get('app-button-outlined-fw-b3').get('button').contains('Cancelar')

    }

    msgCadastroNovoEventoCapitalEmissor() {

        return cy.contains('Dados do Ativo criado com sucesso', { timeout: 4000 }).should('be.visible')

    }

    //Utilities
    salvarCadastroAtivo() {

        cy.get('app-issuershare-list').within(() => {
            cy.get('[caption="Salvar"]').click()
        })
        cy.contains("Incluir").click()
    }

    addAtivosEmissor(mercadoNegociacaoAtivo: AtivoModel[]) {

        //this.addAtivo()

        mercadoNegociacaoAtivo.forEach((ativo: AtivoModel) => {
            this.tipoAtivo().selectOption(ativo.TipoAtivo)
            this.escriturador().selectOption(ativo.Escriturador)
            this.formaEmissao().selectOption(ativo.FormaEmissao)
            this.escrituradorDesde().type(ativo.EscrituradorDesde)
            this.salvarCadastroAtivo()
        })

        // cy.contains('Cancelar').click()
    }

    gridListarNovosAtivosModal() {

        return new NovoAtivoEmissorPage()
    }
}

export class NovoAtivoEmissorPage {

    nomeTipoAtivo(text) {

        return cy.get('[id="cell_shareTypeDescription"]').contains(text).should('be.visible')

    }

    formaEmissao(text) {

        return cy.get('[id="cell_issuingTypeDescription"]').contains(text).should('be.visible')

    }

    escrituradorDesde(text) {

        return cy.get('[id="cell_startDate"]').contains(text).should('be.visible')

    }

    escriturador(text) {

        return cy.get('[id="cell_shareAdministratorName"]').contains(text).should('be.visible')

    }

    btnEditarNovoAtivoEmissor() {

        return cy.get('app-issuer-share-list').within(() => {
            cy.get('[class="mat-icon notranslate material-icons mat-icon-no-color"]').contains('edit')

        })

    }

    btnSalvarCadastrtoNovoAtivo() {

        return cy.get('app-button-flat-b3').within(() => {

            cy.get('[id="btn_submit"]').contains('Salvar').click()

        })
    }
}

export default AtivoPage