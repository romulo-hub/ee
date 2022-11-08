import { should } from "chai"

export class CapitalEventoPage {

    tipoEvento() {

        return cy.get('[id="capitalEventType"]')

    }

    dataAprovacao() {

        return cy.get('[id="approvalDateShare"]',{timeout:10000})

    }

    valorCapital() {

        return cy.get('[id="capitalPriceValue"]')

    }

    flagHomologado() {

        return cy.get('#capitalEventStatus').contains('Homologado').click()
 
    }

    tipoAtivoJáCadastrado() {

        return cy.contains('Ativo OR já existe para este Evento', { timeout: 3000 })
            .should('be.visible')

    }

    addNovoAtivo() {

        return cy.get('app-capital-event-detail').within(() => {
            cy.get('#btn_add').contains('add').click()
        })
    }

    btnNovoAtivo() {

        return cy.get('app-capital-event-detail').within(() => {
            cy.get('#btn_add').contains('add')
        })
    }

    modalDataSource() {

        return cy.get('[id="modal-capitalEventDataSource"]')

    }

    novoAtivoEventoCapitalModal() {

        return new NovoAtivoEventoCapitalPage()
    }

    gridEventosAHomologarModal() {

        return new GridEventosAHomologarPage()
    }

    incluirCadastroEvento() {

        return cy.get('app-confirm').get('[id="btn_action"]').contains('Incluir ')

    }

    incluirDesabilitadoCadastroEvento() {

        return cy.get('[id="btn_submit"]').contains('Incluir').should('not.be.enabled')

    }

    cancelarCadastroEventoCapital() {

        return cy.get('app-confirm').get('[id="btn_dismiss"]').contains(' Cancelar ')

    }

    salvarIncluirEventoCapital() {

        cy.get('[class="mat-grid-list"]').within(() => {
            cy.get('[id="btn_submit"]').contains('Incluir').should('be.enabled').click()
        })
        this.incluirCadastroEvento().click().should('not.exist')
    }

    salvarCancelarCadastroEventoCapital() {

        cy.get('app-button-flat-fw-b3').get('[id="btn_submit"]').contains('Incluir').click()
        this.cancelarCadastroEventoCapital().click()

    }

    msgCadastroNovoEventoCapitalEmissor() {

        return cy.contains('Evento criado com sucesso', { timeout: 4000 }).should('be.visible')

    }

    cancelarCadastroNovoEvento() {

        return cy.get("app-capital-event-detail").within(()=>{
            cy.get('[id="btn_back"]').contains('Cancelar').should('be.enabled').click()
        })

    }

    nomeValorEventoCapital(text, text2, text3) {

        return cy.get(text).get(text2).should('be.visible').should(text3)
    }

    nomeQuantidadeEventoCapital(text, text2) {

        return cy.get(text).should('contain.text', text2)

    }
}

export class NovoAtivoEventoCapitalPage {

    ativo() {

        return cy.get('[class="mat-cell cdk-cell cdk-column-shareTypeCode mat-column-shareTypeCode ng-star-inserted"]')
                               
    }

    tipoAtivo() {

        return cy.get('[class="mat-cell cdk-cell cdk-column-shareClassTypeAcronym mat-column-shareClassTypeAcronym ng-star-inserted"]')
                               
    }

    quantidade() {

        return cy.get('[class="mat-cell cdk-cell table-column cdk-column-shareClassQuantity mat-column-shareClassQuantity ng-star-inserted"]')
                        
    }

    tagAlong() {

        return cy.get('[class="mat-cell cdk-cell table-column cdk-column-tagAlong mat-column-tagAlong ng-star-inserted"]')

    }

    flagResgatavel() {

        return cy.get('[class="mat-cell cdk-cell cdk-column-capitalShareRedemptionIndicator mat-column-capitalShareRedemptionIndicator ng-star-inserted"]')

    }

    removerAtivo() {

        return cy.get('app-capitalevent-detail').get('[class="table-body-cell"]').within(() => {
            cy.get('[id="btn_delete"]')

        })
    }
}

export class EditarEventosSemHomologarPage {

    editarEventosSemHomologarModal() {

        return new GridEventosAHomologarPage()

    }

    novoAtivoEventoCapitalModal() {

        return new NovoAtivoEventoCapitalPage()

    }

    tituloTipoEventoEditarEventoSemHomologar(text) {

        return cy.get('[id="capitalEvent"]').contains(text).should('be.visible')

    }

    msgAtualizarEventoCapitalSemHomologarEmissor() {

        return cy.contains('Dados do Evento alterados com sucesso', { timeout: 4000 }).should('be.visible')

    }

    valorCapitalEvento() {

        return cy.get('[id="capitalPriceValue"]').click().blur()

    }

    capitalEventoValor() {

        return cy.get('[id="capitalPriceValue"]')

    }

    atualizarEventoSemHomologar() {

        this.btnAtualizarEventoSemHomologar().click()
        this.incluirEventoEditado()

    }

    btnAtualizarEventoSemHomologar() {

        return cy.get('[id="btn_submit"]').contains('Atualizar')

    }

    cancelarEditarEventoSemHomologar() {

        return cy.get('app-capital-event-detail').within(()=>{
            return cy.get('[id="btn_back"]').contains('Cancelar').click()
        })

    }

    incluirEventoEditado() {

        return cy.get('[class="message-confirm"]').get('[id="btn_action"]').contains('Atualizar ').click()

    }

    cancelarAtualizarEvento() {

        this.btnAtualizarEventoSemHomologar().click()
        return cy.get('[class="message-confirm"]').get('[id="btn_dismiss"]').contains(' Cancelar ').click()

    }
}

export class HomologarEventosPendentesPage {

    msgHomologarParcialNaoPermitidaEmissorSemCapitalSocial() {

        return cy.contains("Não é permitida homologação parcial para esse tipo de emissor.", { timeout: 10000 })
            .should('be.visible')

    }

    msgHomologarCompletaNaoPermitidaManterRestanteAtivadoSemRestantes() {

        return cy.contains("O evento que deve ser mantido não possui quantidade ou montante remanecentes.", { timeout: 10000 })
            .should('be.visible')

    }

    tituloTipoEventoHomologar(text) {

        return cy.get('[id="modal_capitalEventTypeDescription"]',{timeout:10000}).contains(text).should('be.visible')

    }

    dataAprovacaoHomologar() {

        return cy.get('[id="approvalDateHomologed"]')

    }

    dataHomologacao() {

        return cy.get('[id="homologateDate"]')

    }

    valorCapitalEventoHomologar() {

        return cy.get('[id="capitalPriceValueAapproved"]')

    }

    montanteHomologado() {

        return cy.get('[id="capitalPriceValueHomologated"]')

    }

    montanteRestante() {

        return cy.get('[id="getCapitalRemainder"]')

    }

    flagManterEventoAtivoCapital() {

        return cy.get('[id="capitalPriceValuekeepPending"]')

    }

    tipoAtivoHomologar() {

        return cy.get('[id="shareClassTypeAcronym"]')

    }

    quantidadeAtivoHomologar() {

        return cy.get('[id="shareClassQuantityApproved"]')

    }

    quantidadeHomologadaAtivo(text) {

        return cy.get('[id="shareClassQuantityHomologated"]').get(text)

    }

    quantidadeRestanteAtivoHomologar() {

        return cy.get('[id="shareClassQuantityRemainder"]')

    }

    confirmarHomologacaoEvento() {

        return cy.get('app-confirm').get('[id="btn_action"]').contains('Homologar ')

    }

    homologarEventoDesabilitado() {

        this.homologarEventoCapital().should('not.be.enabled')

    }

    cancelarConfirmarHomologacaoEventoCapital() {

        return cy.get('app-confirm').get('[id="btn_dismiss"]').contains(' Cancelar ')

    }

    homologarEventoCapital() {

        return cy.get('app-button-flat-b3').get('[id="btn_submit"]').contains('Homologar')

    }

    salvarHomologarEventoCapital() {

        this.homologarEventoCapital().click()
        this.confirmarHomologacaoEvento().click({ timeout: 50000 })
    }

    salvarCancelarEventoCapitalSemHomologar() {

        this.homologarEventoCapital().click()
        this.cancelarConfirmarHomologacaoEventoCapital().click()
        this.cancelarEventoSemHomologar().click()

    }

    msgEventoCapitalHomologado() {

        return cy.get('div:contains(Evento Homologado com sucesso)').should('be.visible')

    }

    cancelarEventoSemHomologar() {
        return cy.get('#btn_back > div > button').contains('Cancelar')
        //return cy.get("app-capital-homolog").within(()=> {
            //return cy.get('[id="btn_back"]').contains('Cancelar')
        //})       
    }
}

export class ExcluirEventosPendentesPage {

    gridEventosSemHomologarModal() {

        return new GridEventosAHomologarPage()

    }

    excluirEventoSemHomologar() {

        return cy.get('[class="message-confirm"]').get('[id="btn_action"]').contains('Excluir ').click()

    }

    cancelarExcluirEventoSemHomologar() {

        return cy.get('[class="message-confirm"]').get('[id="btn_dismiss"]').contains(' Cancelar ').click()

    }

    msgEventoPendenteHomologarExcluido() {

        return cy.contains("Evento excluído com sucesso", { timeout: 4000 })
            .should('be.visible')

    }
}

export class GridEventosAHomologarPage {

    excluirEventosSemHomologarModal() {

        return new ExcluirEventosPendentesPage()

    }

    editarEventosSemHomologarModal() {

        return new EditarEventosSemHomologarPage()

    }

    homologarEventosPendentesModal() {

        return new HomologarEventosPendentesPage()

    }

    excluirEventoPendenteHomologar() {

        return cy.get('[id="btn_delete"]').contains(' delete ').click()

    }

    editarEventosSemHomologarParcialCompleta() {

        return cy.get('[id="btn_edit"]').contains('edit_outline').click({ timeout: 10000 })

    }

    homologarParcialCompletaEventos() {

        return cy.get('[id="btn_check"]').contains('check_circle_outline').click()

    }

    msgNenhumEventosPendentesGridEventosAHomologar() {

        return cy.get('[id="notFoundEvent"]').contains('Não há eventos pendentes de homologação.')

    }

    dataAprovacaoEvento(text) {

        return cy.get('[id="approvalDateHomolog"]').contains(text).should('be.visible')

    }

    dataAprovacaoEventoEditar() {

        return cy.get('[id="approvalDateShare"]').should('be.visible')

    }

    valorCapitalEvento(text) {

        return cy.get('[id="formattedCapitalPriceValue"]').get(text)

    }

    detalhesEventosAhomologar() {

        return cy.get('mat-expansion-panel-header').get('[role="button"]').click()

    }

    tipoEventoGridEventosAHomologar(text) {

        return cy.get('[id="capitalEventTypeDescription"]').contains(text).should('be.visible')

    }

    fecharGridEventosAHomologar() {

        cy.get('app-button-outlined-fw-b3').get('[id="btn_close"]').contains('Fechar').click()

    }
}

export default CapitalEventoPage