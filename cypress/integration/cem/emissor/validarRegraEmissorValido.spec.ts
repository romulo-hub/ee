/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import { EmissorUtilitarioSite } from '../utilitarios/emissor.utilitario'
import SharedPage from '../pages/shared.page'
import CapitalPage from '../pages/capital.page'
import AtivoUtilitarioSite from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

let emissorUtilitarioSite: EmissorUtilitarioSite
let capitalPage: CapitalPage
let sharedPage: SharedPage
let ativoUtilitario: AtivoUtilitarioSite
let emissorUtilitario: EmissorUtilitarioSite
let mercadoUtilitario: MercadoUtilitarioApi

describe('Tipo emissor Cia Estrangeira - Validar que aba capital e a aba endereço aparece desabilitado se não tiver cadastro das abas anteriores', () => {
    const regraEmissorValido = require('../../../fixtures/capital/cadastroCapital.tipoNominal.json')

    //Required step to test with more than one data in json.
    regraEmissorValido.forEach((regraEmissorValidoData: CemModel) => {

        before(() => {

            sharedPage = new SharedPage()
            capitalPage = new CapitalPage()
            emissorUtilitarioSite = new EmissorUtilitarioSite()
            ativoUtilitario = new AtivoUtilitarioSite()
            emissorUtilitario = new EmissorUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            //Armazenar datas necessarios para validações em testes 
            cy.getNextWorkingDay().as('next_wdate')
            cy.getDate().as('today_date')

            //cadastro emissor
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaEstrangeiraApi(regraEmissorValidoData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTiposAtivosPreferencialOrdinariaApi(regraEmissorValidoData.Emissor)

            cy.visit('')
            sharedPage.menuCadastro()
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, regraEmissorValidoData)

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Validar a aba capital desabilitado sem preenchimento das abas ativo e mercado", () => {

            sharedPage.subMenuCapital(false).should('not.be.enabled')

        })

        it("Validar a aba endereço desabilitado sem preenchimento das abas ativo e mercado", () => {

            sharedPage.subMenuEndereco().should('not.be.enabled')

        })

        it("Cadastrar o mercado com emissor situação listado", () => {

            mercadoUtilitario.cadastroMercadoSituacaoListado(regraEmissorValidoData.Emissor)

        })

        it("Cadastrar o capital do emissor com tipo nominal com a data aprovação hoje e consultar esse registro na busca de emissores", function () {

            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(sharedPage, regraEmissorValidoData)
            sharedPage.subMenuAtivo().click()
            sharedPage.subMenuMercado().click()
            sharedPage.subMenuCapital().click()
            capitalPage.dataAprovacao().type(this.today_date)
            capitalPage.capitalSocial().type("32.176,72")
            capitalPage.nominalUnitario().selectOption("Nominal")
            capitalPage.valorUnitAcao().should('be.enabled').type("3.252,65")
            capitalPage.addNovoAtivo(regraEmissorValidoData.Capital.NovoAtivoCapital)
            capitalPage.valorUnitAcao().should('have.value', 'R$ 3.252,65').should('be.visible')
            capitalPage.capitalSocial().should('have.value', 'R$ 32.176,72').should('be.visible')
            capitalPage.salvarIncluirCadastroCapital()

        })

        it("Validar a aba endereço habilitado após preenchimento das abas ativo e mercado", () => {

            sharedPage.subMenuEndereco().click()

        })

        after("Delete Created issuer", () => {
            cy.url().then(cy.deleteIssuer)
        })
    })
})