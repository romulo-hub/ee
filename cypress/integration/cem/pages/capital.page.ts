import { NovoAtivoCapital, CapitalModel } from '../model/capital.model'

export class CapitalPage {

    dataAprovacao() {

        return cy.get('[id="approvalDateCapital"]', {timeout: 10000})

    }

    capitalSocial() {

        return cy.get('[id="capitalPrice"]', {timeout:10000})

    }

    valorUnitAcao() {

        return cy.get('[id="sharePriceValue"]',{timeout:10000})

    }

    nominalUnitario() {

        return cy.get('[id="sharePriceTypeCode"]',{timeout:10000})

    }

    inicioVigencia() {

        return cy.get('[id="startDate"]')

    }

    eventosAHomologar() {

        return cy.get('[id="btn_Homolog"]')

    }

    novoEvento() {

        return cy.get('[id="btn_addNewEvent"]', {timeout: 10000})

    }

    historicoCapital() {

        return cy.get('[id="btn_ShowHistory"]')

    }

    validaDataAprovacaoPosterior() {

        return cy.get('mat-error').should('contain.text', 'Data não pode ser superior a data atual')
            .should('be.visible')

    }

    valorInvalidoUnitAcaoNominal() {

        this.salvarCadastroCapital()
        this.incluirCadastroCapital().click()
        return cy.contains("'Valor Unitário/Nominal' deve ser informado.", { timeout: 5000 })
            .should('be.visible')

    }

    tipoAtivoJáCadastrado() {

        return cy.contains('Ativo OR já existe para este Capital', { timeout: 3000 })
            .should('be.visible')

    }

    quantidadeAtivosOrdinaria() {

        return cy.get('[id="shareTypeDescription"]').get('[placeholder="ON"]',{timeout:10000})

    }

    quantidadeAtivosTotal() {

        return cy.get('[id="shareTypeDescription"]').get('[placeholder="Quantidade Total"]')

    }

    quantidadeAtivosPreferencial() {

        return cy.get('[id="shareTypeDescription"]').get('[placeholder="PN"]',{timeout:10000})

    }

    quantidadeAtivosBDR() {

        return cy.get('[id="shareTypeDescription"]').get('[placeholder="BDR"]',{timeout:10000})

    }

    addNovoAtivoCapital() {

        return cy.get('app-capital-detail',{ timeout: 10000 }).within(() => {
            cy.get('[id="bt_add"]').click()
        })
    }

    cancelarCadastroAtivo() {

        this.addNovoAtivoCapital()
        this.novoAtivoModal().cancelarNovoAtivo().click()
    }

    novoAtivoModal() {

        return new NovoAtivoCapitalPage()
    }

    incluirCadastroCapital() {

        return cy.get('[class="message-confirm"]').get('[id="btn_action"]').contains('INCLUIR ')

    }

    alterarCadastroCapital() {

        return cy.get('[class="message-confirm"]').get('[id="btn_action"]').contains('Alterar ')

    }

    cancelarCadastroCapital() {

        return cy.get('[class="message-confirm"]').get('[id="btn_dismiss"]').contains(' Cancelar ')

    }

    salvarDesabilitadoCadastroCapital() {

        cy.get('app-capital-detail',{timeout:10000}).get('[id="btn_submit"]').should('not.be.enabled')

    }

    salvarCadastroCapital() {

        cy.get('app-capital-detail', { timeout: 15000 }).within(() => {
            cy.get('[id="btn_submit"]').contains('Salvar').click()
        })
    }

    salvarAlterarCadastroCapital() {

        this.salvarCadastroCapital()
        this.alterarCadastroCapital().click()
        this.msgAlterarCadastroCapitalEmissor()

    }

    salvarIncluirCadastroCapital() {

        this.salvarCadastroCapital()
        this.incluirCadastroCapital().click()

    }

    salvarCadastro() {

        return cy.get('app-capital-detail',{ timeout: 10000 }).get('[id="btn_submit"]').contains('Salvar', { timeout: 10000 })

    }

    salvarCancelarCadastroCapital() {

        this.salvarCadastro().click()
        this.cancelarCadastroCapital().click()

    }

    msgAlterarCadastroCapitalEmissor() {

        return cy.contains('Dados do Capital alterado com sucesso', { timeout: 4000 }).should('be.visible')

    }

    msgCadastroNovoCapitalEmissor() {

        return cy.contains('Dados do Capital criado com sucesso', { timeout: 15000 }).should('be.visible')

    }

    historicoCapitalModal() {

        return new HistoricoCapitalPage()
    }

    addNovoAtivo(novoAtivo: NovoAtivoCapital[]) {

        novoAtivo.forEach((ativo: NovoAtivoCapital) => {
            this.addNovoAtivoCapital()
            this.novoAtivoModal().quantidade().clear().type(ativo.QuantidadeCapital)
            this.novoAtivoModal().tagAlong().clear().type(ativo.TagAlongCapital)
            if (ativo.ResgatavelCapital) {
                this.novoAtivoModal().flagResgatavel().click()
            }
            this.novoAtivoModal().tipoAtivo().selectOption(ativo.TipoAtivoCapital)
            this.novoAtivoModal().ativo().selectOption(ativo.AtivoCapital)
            this.novoAtivoModal().incluir().click().should('not.exist')
        })
    }
}

export class NovoAtivoCapitalPage {

    ativo() {
        return cy.get('[id="modal_shareTypeCode"]').focus()
    }

    tipoAtivo() {

        return cy.get('[id="modal_shareClassType"]',{timeout:10000}).focus()

    }

    quantidade() {

        return cy.get('[id="modal_shareClassQuantity"]')

    }

    tagAlong() {

        return cy.get('[id="modal_tagAlongPercentage"]')

    }

    flagResgatavel() {

        return cy.get('[id="modal_capitalShareRedemptionIndicator"]')

    }

    tagAlongAlterarCapital() {

        return cy.get('[class="table-body-cell ng-star-inserted"]')

    }

    flagResgatavelAlterarCapital() {

        return cy.get('[class="mat-slide-toggle-bar mat-slide-toggle-bar-no-side-margin"]')

    }

    quantidadeAlterarCapital() {

        return cy.get('[class="table-body-cell ng-star-inserted"]',{timeout:10000})

    }

    tipoAtivoAlterarCapital() {

        return cy.get('div')

    }

    incluirDesabilitado() {

        return cy.get('[id="btn_submit"]').contains('Incluir').should('not.be.enabled')

    }

    incluir() {

        return cy.get('[id="btn_submit"]').contains('Incluir')

    }

    cancelarNovoAtivo() {

        return cy.get('#btn_back > div > button').contains('Cancelar')
        /*return cy.get("mat-dialog-container").within(()=>{
            return cy.get('[id="btn_back"]').contains('Cancelar')
        })*/
    }

    removerAtivoCapital() {

        return cy.get('app-capital-detail', { timeout: 10000 }).get('[class="table-body-cell"]').within(() => {
            cy.get('[id="btn_delete"]')

        })
    }
}

export class DetalhesHistoricoCapitalPage {

    btnVoltarHistoricoCapital() {

        cy.get('app-history').within(() => {

            cy.get('app-button-outlined-b3').get('[id="btn-modal-back"]').contains('Voltar').click()
        })

    }

    tituloTipoEventoHomologado(text) {

        return cy.get('[id="modal-eventName"]').should('contain', text)

    }

    tipoAtivoHistoricoCapital(text) {

        return cy.get('[id="modal-table-history-shareClassTypeAcronym"]').contains(text)

    }

    quantidadeHistoricoCapital() {

        return cy.get('[id="modal-table-history-shareClassQuantity"]')

    }

    tagAlongHistoricoCapital(text) {

        return cy.get('[id="modal-table-history-tagAlongPercentage"]').contains(text)

    }

    flagResgatavelHistoricoCapital() {

        return cy.get('[id="modal-table-history-capitalShareRedemptionIndicator"]')

    }

    dataAprovacaoHistoricoCapital() {

        return cy.get('[id="modal-history-approvalDate"]')

    }

    capitalSocialHistoricoCapital() {

        return cy.get('[id="modal-history-capital"]')

    }

    valorUnitAcaoHistoricoCapital() {

        return cy.get('[id="modal-history-sharePriceValue"]')

    }

    nominalUnitarioHistoricoCapital() {

        return cy.get('[id="modal-history-nominal"]', {timeout:10000})

    }

    dataHomologacaoHistoricoCapital() {

        return cy.get('[id="modal-history-homologateDate"]')

    }

    quantidadeAtivosOrdinariaHistoricoCapital() {

        return cy.get('[id="modal-history-quantity"]').get('[placeholder="ON"]')

    }

    quantidadeAtivosTotalHistoricoCapital() {

        return cy.get('[id="modal-history-quantity"]').get('[placeholder="Quantidade Total"]')

    }

    quantidadeAtivosPreferencialHistoricoCapital() {

        return cy.get('[id="modal-history-quantity"]').get('[placeholder="PN"]')

    }

    quantidadeAtivosBDRHistoricoCapital() {

        return cy.get('[id="modal-history-quantity"]').get('[placeholder="BDR"]')

    }
}

export class HistoricoCapitalPage {

    contadorRegistroPagina(text) {

        return cy.get('[class="mat-paginator-range-label"]').should('contain', text)

    }

    btnPrimeiraPagina() {

        return cy.get('[aria-label="First page"]')

    }

    btnPaginaAnterior() {

        return cy.get('[class="mat-focus-indicator mat-tooltip-trigger mat-paginator-navigation-previous mat-icon-button mat-button-base"]')

    }

    btnProximaPagina() {

        return cy.get('[aria-label="Next page"]')

    }

    btnUltimaPagina() {

        return cy.get('[class="mat-focus-indicator mat-tooltip-trigger mat-paginator-navigation-last mat-icon-button mat-button-base ng-star-inserted"]')

    }

    detalhesHistoricoCapitalModal() {

        return new DetalhesHistoricoCapitalPage()
    }

    btnFecharHistoricoCapital() {

        return cy.get('app-history').within(() => {

            cy.get('app-button-outlined-b3').get('[id="btn_back"]').contains('Fechar')
        })
    }

    btnDetalhesHistoricoCapital() {

        return cy.get('[id="btn_details_capital"]').contains('info_outlined')

    }

    dataAprovacaoHistoricoCapital() {

        return cy.get('[id="row-approvalDate"]')

    }

    capitalSocialHistoricoCapital() {

        return cy.get('[id="cell-capital"]')

    }

    inicioVigenciaHistoricoCapital() {

        return cy.get('[id="row-startDate"]')

    }

    tipoEventoHistoricoCapital() {

        return cy.get('[id="row-eventType"]')

    }

    quantidadeHistoricoCapital() {

        return cy.get('[id="cell-quantity"]')

    }
}

export default CapitalPage