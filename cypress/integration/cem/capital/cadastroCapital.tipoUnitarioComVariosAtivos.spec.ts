/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalEventoUtilitario from '../utilitarios/eventoCapital.utilitario'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalNovoEventoUtilitario: CapitalEventoUtilitario
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let emissorUtilitario: EmissorUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Aberta com capital tipo unitário com varios ativos cadastrado - Cadastrar o capital do emissor com tipo unitário e consultar esse registro na busca de emissores', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoUnitario.json')

    //Required step to test with more than one data in json.
    capitalEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            capitalPage = new CapitalPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
            capitalNovoEventoUtilitario = new CapitalEventoUtilitario()
            capitalUtilitario = new CapitalUtilitario()
            ativoUtilitario = new AtivoUtilitarioSite()
            emissorUtilitario = new EmissorUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            //Armazenar datas necessarios para validações em testes.
            cy.getDate().as('today_date')
            cy.getNextWorkingDay().as('next_wdate')

        })

        beforeEach(() => {

            //cadastro emissor
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

            cy.visit('')
            cy.viewport(1366, 768)
            sharedPage.menuCadastro()
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Cadastrar o capital do emissor com tipo unitário com a data aprovação retroativa e consultar esse registro na busca de emissores", () => {

            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.dataAprovacao().type(capitalData.Capital.dataAprovacaoCapital)
            capitalPage.capitalSocial().type(capitalData.Capital.CapitalSocial)
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("2000")
            capitalPage.novoAtivoModal().tagAlong().type("98")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PD")
            capitalPage.novoAtivoModal().ativo().selectOption("Preferencial")
            capitalPage.novoAtivoModal().incluir().click()
            capitalPage.capitalSocial().clear().type("30.000").focus()
            capitalPage.valorUnitAcao().should('have.value', 'R$ 4,2857142').should('be.visible')
            cy.rowTableActive('PD', '[id="btn_delete"]')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 6,00').should('be.visible')
            capitalPage.salvarIncluirCadastroCapital()
            capitalPage.salvarDesabilitadoCadastroCapital()
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Cadastrar o capital do emissor com tipo unitário com a data aprovação hoje e consultar esse registro na busca de emissores", function () {

            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.dataAprovacao().type(this.today_date)
            capitalPage.capitalSocial().type("30.176,72")
            capitalPage.valorUnitAcao().should('have.value', 'R$ 0,0000001').should('not.be.enabled').should('be.visible')
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("1000")
            capitalPage.novoAtivoModal().tagAlong().type("92")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PD")
            capitalPage.novoAtivoModal().ativo().selectOption("Preferencial")
            capitalPage.novoAtivoModal().incluir().click()
            capitalPage.valorUnitAcao().should('have.value', 'R$ 5,0294533').should('be.visible')
            cy.rowTableActive('PD', '[id="btn_delete"]')
            capitalPage.capitalSocial().should('have.value', 'R$ 30.176,72').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 6,035344').should('be.visible')
            capitalPage.salvarIncluirCadastroCapital()
            capitalPage.salvarDesabilitadoCadastroCapital()
            sharedPage.subMenuCapital().click()
            capitalPage.capitalSocial().should('have.value', 'R$ 30.176,72').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 6,035344').should('be.visible')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PA ', '90%')
                cy.contains('PR').should('be.visible')
                cy.contains('PA').should('be.visible')
                cy.contains('OR').should('be.visible')
            })

            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PA ', '90%')

                cy.contains('PR').should('be.visible').should('not.be.enabled')
                cy.contains('PA').should('be.visible').should('not.be.enabled')
                cy.contains('OR').should('be.visible').should('not.be.enabled')
            })
            capitalPage.quantidadeAtivosTotal()
                .should('not.be.focused')
                .should('have.value', '5.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosPreferencial()
                .should('not.be.focused')
                .should('have.value', '4.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosOrdinaria()
                .should('not.be.focused')
                .should('have.value', '1.000')
                .should('be.visible')
            capitalPage.capitalSocial().should('have.value', 'R$ 30.176,72').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 6,035344').should('be.visible')

        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})