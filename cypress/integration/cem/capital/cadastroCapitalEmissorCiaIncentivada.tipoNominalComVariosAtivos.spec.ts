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

describe('Tipo emissor Cia Incentivada com capital tipo nominal com varios ativos cadastrado - Cadastrar o capital do emissor com tipo nominal e consultar esse registro na busca de emissores', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

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

            //Armazenar datas necessarios para validações em testes 
            cy.getNextWorkingDay().as('next_wdate')
            cy.getDate().as('today_date')

        })

        beforeEach(() => {

            //cadastro emissor
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(capitalData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(capitalData.Emissor)

            cy.visit('')
            cy.viewport(1366, 768)
            sharedPage.menuCadastro()
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Validar os campos obrigatórios no cadastro do capital do emissor", function () {

            capitalPage.nominalUnitario().contains('Unitário')
            capitalPage.valorUnitAcao().should('not.be.enabled')
            function cancelarCadastroAtivoSemPreenchimento() {
                capitalPage.addNovoAtivoCapital()
                capitalPage.novoAtivoModal().ativo().should('have.focus').selectOption("")
                capitalPage.novoAtivoModal().tipoAtivo().should('have.focus').selectOption("")
                capitalPage.novoAtivoModal().quantidade().should('be.enabled').click()
                capitalPage.novoAtivoModal().tagAlong().should('be.enabled').click()
                capitalPage.novoAtivoModal().flagResgatavel().click()
                capitalPage.novoAtivoModal().incluirDesabilitado()
                capitalPage.novoAtivoModal().cancelarNovoAtivo().click()
            }
            cancelarCadastroAtivoSemPreenchimento()
            capitalPage.nominalUnitario().selectOption('Nominal')
            capitalPage.valorUnitAcao().should('be.enabled').type("3.848,82")
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.dataAprovacao().should('be.enabled').type(this.today_date)
            capitalPage.capitalSocial().should('not.be.enabled').should('have.value', '').should('be.visible')
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("1.560")
            capitalPage.novoAtivoModal().tagAlong().clear().type("84")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().ativo().selectOption("Ordinária")
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PA")
            capitalPage.novoAtivoModal().tagAlong().should('have.value', '84%')
            capitalPage.novoAtivoModal().quantidade().should('have.value', '1.560')
            capitalPage.novoAtivoModal().incluir().click().should('not.exist')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.000 ').should('not.be.enabled').should('be.visible')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 2.000 ').should('not.be.enabled').should('be.visible')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains(' 1.560 ').should('not.be.enabled')

                cy.contains(' PA ').should('be.visible')
                cy.contains(' PR ').should('be.visible')
                cy.contains(' OR ').should('be.visible')

            })
            capitalPage.valorUnitAcao().should('be.enabled').should('have.value', "R$ 3.848,82").should('be.visible')
            capitalPage.valorUnitAcao().clear()
            capitalPage.salvarDesabilitadoCadastroCapital()

        })

        it("Cadastrar o capital do emissor com tipo nominal com a data aprovação retroativa e consultar esse registro na busca de emissores", () => {

            capitalPage.dataAprovacao().type(capitalData.Capital.dataAprovacaoCapital)
            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.valorUnitAcao().should('be.enabled').type("2.800")
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.salvarIncluirCadastroCapital()
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Cadastrar o capital do emissor com tipo nominal com a data aprovação hoje e consultar esse registro na busca de emissores", function () {

            capitalPage.dataAprovacao().type(this.today_date)
            capitalPage.nominalUnitario().selectOption("Nominal")
            capitalPage.valorUnitAcao().should('be.enabled').type("3.252,65")
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')
            capitalPage.salvarIncluirCadastroCapital()
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            cy.get('#resp-table-body').within(() => {

                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')

                cy.contains('PR').should('be.visible').should('not.be.enabled')
                cy.contains('OR').should('be.visible').should('not.be.enabled')
            })

            capitalPage.quantidadeAtivosTotal()
                .should('not.be.focused')
                .should('have.value', '3.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosPreferencial()
                .should('not.be.focused')
                .should('have.value', '2.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosOrdinaria()
                .should('not.be.focused')
                .should('have.value', '1.000')
                .should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')

        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})