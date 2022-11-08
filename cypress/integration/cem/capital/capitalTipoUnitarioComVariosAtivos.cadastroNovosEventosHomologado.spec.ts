/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalEventoPage from '../pages/eventoCapital.page'
import CapitalEventoUtilitario from '../utilitarios/eventoCapital.utilitario'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'
import { each } from '../../../../node_modules/cypress/types/jquery/index'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalEventoPage: CapitalEventoPage
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Aberta com capital tipo unitario com varios ativos cadastrado - Cadastrar novos eventos capital já homologado, validações especificas no cadastro do evento do capital e validações dos valores capital conforme o evento cadastrado', () => {
  const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoUnitario.json')

  //Required step to test with more than one data in json.
  capitalEmissor.forEach((capitalData: CemModel) => {

    before(() => {

      sharedPage = new SharedPage()
      capitalPage = new CapitalPage()
      emissorUtilitarioSite = new EmissorUtilitarioSite()
      capitalEventoPage = new CapitalEventoPage()
      capitalNovoEventoUtilitario = new CapitalEventoUtilitario()
      capitalUtilitario = new CapitalUtilitario()
      ativoUtilitario = new AtivoUtilitarioSite()
      mercadoUtilitario = new MercadoUtilitarioApi()

      //Armazenar datas necessarios para validações em testes.
      cy.getDate().as('today_date')
      cy.getNextWorkingDay().as('next_wdate')

      //cadastro emissor
      emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
      mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
      ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

      //cadastro capital emissor com tipo unitário
      capitalUtilitario.capitalUtilitarioApi().cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(capitalData.Emissor)

      cy.visit('')
      capitalUtilitario.consultarEmissorComCapitalJaCadastrado(sharedPage, capitalData)

    })

    beforeEach(() => {

      cy.viewport(1366, 768)

    })

    it("Cadastrar o evento aumento de capital sem emissão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoAumentoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 32.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 6,49').should('be.visible')      
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.000')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '5.000')
        .should('be.visible')        
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.000')
        .should('be.visible')

    })

    it("Cadastrar o evento redução capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoReducaoCapitalJaHomologado(capitalData.EventoCapital)      
      capitalPage.capitalSocial().should('have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 4,0232974').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.860').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.860').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.860').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '1.860')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '5.580')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '3.720')
        .should('be.visible')

    })

    it("Cadastrar o evento Conversão de ações já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoConversaoAcoesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 22.450,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 3,4645061').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.160').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.160').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.160').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '2.160')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '6.480')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '4.320')
        .should('be.visible')

    })

    it("Cadastrar o evento conversão debêntures já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoConversaoDebenturesCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 25.272,00', {timeout:10000}).should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 2,6145251').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','3.222').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','3.222').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','3.222').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '9.666')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '6.444')
        .should('be.visible')

     })

    it("Cadastrar o evento sobrescrever valor capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoSobrescreverValorCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 40.510,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 4,1909786').should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '6.444')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '9.666')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '3.222')
        .should('be.visible')

    })

    it("Cadastrar o evento somar quantidade dos ativos informados no capital já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoBonificacaoCapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 40.510,00').should('be.visible')
      capitalPage.valorUnitAcao().should('have.value', 'R$ 2,9252656').should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','4.768').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','4.768').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','4.768').should('not.be.enabled').should('be.visible')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PB').should('be.visible').should('not.be.enabled')

      })

      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '9.536')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '14.304')
        .should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '4.768')
        .should('be.visible')

    })

    it("Cadastrar o evento cisão II já homologado e validar as alterações no capital cadastrado", () => {

      capitalNovoEventoUtilitario.capitalNovoEventoJaHomologado().criarEventoCisaoIICapitalJaHomologado(capitalData.EventoCapital)
      capitalPage.capitalSocial().should('have.value', 'R$ 28.450,00',{timeout:10000}).should('be.visible')
      cy.get('#resp-table-body').within(() => {

        capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.200').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.200').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PB ', '90%')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text','2.200').should('not.be.enabled').should('be.visible')
        cy.contains(' PB ').should('be.visible').should('not.be.enabled')
        capitalPage.novoAtivoModal().quantidadeAlterarCapital().should('include.text',' 2.345 ').should('not.be.enabled').should('be.visible')
        capitalUtilitario.validarTagAlongGridAtivos(' PA ', '93%')

        cy.contains('PR').should('be.visible').should('not.be.enabled')
        cy.contains('OR').should('be.visible').should('not.be.enabled')
        cy.contains('PA').should('be.visible').should('not.be.enabled')

      })

      capitalPage.valorUnitAcao().should('have.value', 'R$ 3,18').should('be.visible')
      capitalPage.quantidadeAtivosOrdinaria()
        .should('not.be.focused')
        .should('have.value', '2.200')
        .should('be.visible')
      capitalPage.quantidadeAtivosTotal()
        .should('not.be.focused')
        .should('have.value', '8.945')
        .should('be.visible')
      capitalPage.quantidadeAtivosPreferencial()
        .should('not.be.focused')
        .should('have.value', '6.745')
        .should('be.visible')

    })

    it("Validações especificas no cadastro do evento do capital do emissor", function () {

      capitalPage.novoEvento().click()
      capitalEventoPage.valorCapital().type('28450')
      capitalEventoPage.dataAprovacao().should('be.enabled')
      capitalEventoPage.tipoEvento().selectOption("")
      capitalEventoPage.dataAprovacao().click()
      capitalEventoPage.dataAprovacao().type(this.next_wdate)
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).should('not.be.enabled').should('be.visible')
      })
      capitalEventoPage.valorCapital().should('have.value', 'R$ 28.450,00')
      capitalEventoPage.tipoEvento().selectOption("Conversão de ações")
      capitalPage.validaDataAprovacaoPosterior()
      capitalNovoEventoUtilitario.validarValorCapitalNaoHabilitado('R$ 30.000,00')
      capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('OR')
      capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PR')
      capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PB')
      capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().each(($element, index, $list) => {
        cy.wrap($element).get('app-capital-event-detail').get('[class="mat-row cdk-row row-table ng-star-inserted"]').within(() => {

          //clicar na grid de ativos               
          cy.get('[class="mat-cell cdk-cell table-column cdk-column-tagAlong mat-column-tagAlong ng-star-inserted"]').within(() => {
            cy.get('input')
              .eq(0)
              .should('have.value', '92').should('be.visible')
            cy.get('input')
              .eq(1)
              .should('have.value', '82').should('be.visible')
            cy.get('input')
              .eq(2)
              .should('have.value', '90').should('be.visible')
          }) 
        })
      })
      capitalEventoPage.incluirDesabilitadoCadastroEvento()
      capitalEventoPage.dataAprovacao().clear().type(this.today_date)
      capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        cy.wrap($element).last().click().type("1.760")
      })
      capitalEventoPage.salvarCancelarCadastroEventoCapital()
      capitalEventoPage.tipoEvento().selectOption("Aumento de Capital")
      capitalEventoPage.valorCapital().clear().type("20.452,68")
      capitalEventoPage.btnNovoAtivo().should('not.be.enabled')
      capitalEventoPage.modalDataSource().within(() => {
        cy.get('tbody').within(() => {
          cy.get('mat-row').within(() => {
            cy.get('mat-cell').each(($element, index, $list) =>{
              cy.wrap($element).should('not.be.enabled')
            })
          })
        })
      })
      //capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('PC')
      //capitalNovoEventoUtilitario.alterarFlagResgatavel()
      //capitalEventoPage.novoAtivoEventoCapitalModal().quantidade().each(($element, index, $list) => {
        //cy.wrap($element).should('not.be.enabled').should('be.visible')
      //})
      //capitalEventoPage.novoAtivoEventoCapitalModal().tagAlong().last().type("97").focused()
      capitalEventoPage.flagHomologado()
      //capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().contains('PC')
      //capitalNovoEventoUtilitario.removerUltimoNovoAtivoCadastradoNovoEventoCapital('PC', '[id="btn_delete"]')
      //capitalEventoPage.addNovoAtivo()
      //capitalEventoPage.novoAtivoEventoCapitalModal().tipoAtivo().last().selectOption('OR')
      //capitalEventoPage.tipoAtivoJáCadastrado()
      //capitalNovoEventoUtilitario.removerUltimoRegistroCadastradoNovoEventoCapital('[id="btn_delete"]')
      capitalEventoPage.valorCapital().should('have.value', 'R$ 20.452,68').should('be.visible')
      capitalEventoPage.cancelarCadastroNovoEvento()
      //capitalEventoPage.salvarIncluirEventoCapital()

    })

    after("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer)
    })
  })
})