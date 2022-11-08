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

describe('Tipo emissor Cia Incentivada com capital tipo unitário com varios ativos cadastrado - Cadastrar o capital do emissor com tipo unitário e consultar esse registro na busca de emissores', () => {
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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaIncentivada(capitalData.Emissor)
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
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("2000")
            capitalPage.novoAtivoModal().tagAlong().clear().type("98")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().ativo().selectOption("Ordinária")
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PA")
            capitalPage.novoAtivoModal().incluir().click()
            cy.rowTableActive('PA', '[id="btn_delete"]')
            capitalPage.salvarIncluirCadastroCapital()
            capitalPage.salvarDesabilitadoCadastroCapital()
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Cadastrar o capital do emissor com tipo unitário com a data aprovação hoje e consultar esse registro na busca de emissores", function () {

            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.dataAprovacao().type(this.today_date)
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("1000")
            capitalPage.novoAtivoModal().tagAlong().clear().type("92")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().ativo().selectOption("Preferencial")
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PA")
            capitalPage.novoAtivoModal().incluir().click()
            cy.rowTableActive('PA', '[id="btn_delete"]')
            capitalPage.salvarIncluirCadastroCapital()
            capitalPage.salvarDesabilitadoCadastroCapital()
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')

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

        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})