/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import CapitalUtilitario from '../utilitarios/capital.utilitario'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let capitalUtilitario: CapitalUtilitario
let ativoUtilitario: AtivoUtilitarioSite
let emissorUtilitario: EmissorUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Estrangeira com capital tipo nominal com varios ativos cadastrado - Cadastrar o capital do emissor com tipo nominal, validações especificas de campos no cadastro desse emissor e consultar esse registro na busca de emissores', () => {
    const capitalEmissor = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

    //Required step to test with more than one data in json.
    capitalEmissor.forEach((capitalData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            capitalPage = new CapitalPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
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
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaEstrangeiraApi(capitalData.Emissor)
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
                capitalPage.novoAtivoModal().tagAlong().should('be.enabled').clear().click()
                capitalPage.novoAtivoModal().flagResgatavel().click()
                capitalPage.novoAtivoModal().incluirDesabilitado()
                capitalPage.novoAtivoModal().cancelarNovoAtivo().click()
                
            }
            cancelarCadastroAtivoSemPreenchimento()
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.dataAprovacao().should('be.enabled').type(this.today_date)
            capitalPage.capitalSocial().should('be.enabled')
            capitalPage.nominalUnitario().selectOption('Nominal')
            capitalPage.valorUnitAcao().should('be.enabled')
            capitalPage.valorUnitAcao().type("2.852,22")
            capitalPage.capitalSocial().type(capitalData.Capital.CapitalSocial).clear()
            capitalPage.salvarDesabilitadoCadastroCapital()

        })

        it("Validações especificas no cadastro do capital do emissor", function () {

            capitalPage.dataAprovacao().type(this.next_wdate)
            capitalPage.capitalSocial().type("30.176,70")
            capitalPage.validaDataAprovacaoPosterior()
            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.dataAprovacao().clear().type(this.today_date)
            capitalPage.valorUnitAcao().should('be.enabled').type("2.848,82")
            capitalPage.capitalSocial().should('have.value', 'R$ 30.176,70')
            capitalPage.cancelarCadastroAtivo()
            capitalPage.valorUnitAcao().should('be.enabled').should('have.value', "R$ 2.848,82").should('be.visible')
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            function cadastroTipoAtivojaCadastrado() {
                capitalPage.addNovoAtivoCapital()
                capitalPage.novoAtivoModal().quantidade().clear().type("1550")
                capitalPage.novoAtivoModal().tagAlong().clear().type("84")
                capitalPage.novoAtivoModal().flagResgatavel().click()
                capitalPage.novoAtivoModal().tipoAtivo().selectOption("OR")
                capitalPage.novoAtivoModal().ativo().selectOption("Preferencial")
                capitalPage.novoAtivoModal().incluir().click()
                capitalPage.tipoAtivoJáCadastrado()
            }
            cadastroTipoAtivojaCadastrado()
            capitalPage.valorUnitAcao().should('be.enabled').should('have.value', "R$ 2.848,82").should('be.visible')
            capitalPage.addNovoAtivoCapital()
            capitalPage.novoAtivoModal().quantidade().clear().type("1560")
            capitalPage.novoAtivoModal().tagAlong().clear().type("84")
            capitalPage.novoAtivoModal().flagResgatavel().click()
            capitalPage.novoAtivoModal().tipoAtivo().selectOption("PA")
            capitalPage.novoAtivoModal().ativo().selectOption("Ordinária")
            capitalPage.novoAtivoModal().tagAlong().should('have.value', '84%')
            capitalPage.novoAtivoModal().quantidade().should('have.value', '1.560')
            capitalPage.novoAtivoModal().incluir().click().should('not.exist')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.560').should('not.be.enabled')

                capitalUtilitario.validarTagAlongGridAtivos(' OR ', '92%')
                capitalUtilitario.validarTagAlongGridAtivos(' PR ', '82%')

                cy.contains('OR').should('be.visible')
                cy.contains('PR').should('be.visible')
                cy.contains('PA').should('be.visible')

            })

            //capitalPage.valorUnitAcao().clear().type("R$0,00")
            //capitalPage.valorInvalidoUnitAcaoNominal()
            //capitalPage.valorUnitAcao().should('be.enabled').type("2.848,82")
            capitalPage.capitalSocial().should('have.value', 'R$ 30.176,70')
            capitalPage.salvarCancelarCadastroCapital()
            capitalPage.valorUnitAcao().should('be.enabled').should('have.value', "R$ 2.848,82").should('be.visible')

        })

        it("Cadastrar o capital do emissor com tipo nominal com a data aprovação retroativa e consultar esse registro na busca de emissores", () => {

            capitalPage.dataAprovacao().type(capitalData.Capital.dataAprovacaoCapital)
            capitalPage.capitalSocial().type(capitalData.Capital.CapitalSocial)
            capitalPage.nominalUnitario().selectOption(capitalData.Capital.NominalUnitario)
            capitalPage.valorUnitAcao().should('be.enabled').type("2.800")
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.salvarIncluirCadastroCapital()
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()

        })

        it("Cadastrar o capital do emissor com tipo nominal com a data aprovação hoje e consultar esse registro na busca de emissores", function () {

            capitalPage.dataAprovacao().type(this.today_date)
            capitalPage.capitalSocial().type("32.176,72")
            capitalPage.nominalUnitario().selectOption("Nominal")
            capitalPage.valorUnitAcao().should('be.enabled').type("3.252,65")
            capitalPage.addNovoAtivo(capitalData.Capital.NovoAtivoCapital)
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')
            capitalPage.capitalSocial().should('have.value', 'R$ 32.176,72').should('be.visible')
            capitalPage.salvarIncluirCadastroCapital()
            sharedPage.subMenuCapital().click()
            capitalPage.capitalSocial().should('have.value', 'R$ 32.176,72').should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')
            emissorUtilitario.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, capitalData)
            sharedPage.subMenuCapital().click()
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
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
            capitalPage.capitalSocial().should('have.value', 'R$ 32.176,72').should('be.visible')

        })

        it("Validar a exibição dos valores nos campos após o cadastro do capital sem consultar na busca emissores esse registro já cadastrado", () => {

            capitalUtilitario.cadastroCapitalTipoNominal(capitalData.Capital)
            sharedPage.subMenuEndereco().click()
            sharedPage.subMenuCapital().click()
            capitalPage.dataAprovacao().should('not.be.enabled').should('be.visible')
            capitalPage.inicioVigencia().should('be.visible')
            capitalPage.capitalSocial().should('not.be.focused').should('be.visible')
            capitalPage.quantidadeAtivosOrdinaria()
                .should('not.be.focused')
                .should('have.value', '1.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosTotal()
                .should('not.be.focused')
                .should('have.value', '3.000')
                .should('be.visible')
            capitalPage.quantidadeAtivosPreferencial()
                .should('not.be.focused')
                .should('have.value', '2.000')
                .should('be.visible')
            capitalPage.valorUnitAcao().should('have.value', "R$ 3.200,00").should('be.visible')
            capitalPage.nominalUnitario().contains(capitalData.Capital.NominalUnitario).should('be.visible')
            cy.get('#resp-table-body').within(() => {

                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('1.000').should('not.be.enabled').should('be.visible')
                capitalPage.novoAtivoModal().quantidadeAlterarCapital().contains('2.000').should('not.be.enabled').should('be.visible')

                cy.contains('PR').should('be.visible').should('not.be.enabled')
                cy.contains('OR').should('be.visible').should('not.be.enabled')
            })
        })

        afterEach("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})