/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorPage from '../pages/emissor.page'
import SharedPage from '../pages/shared.page'
import EnderecoSedePage from '../pages/endereco.page'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import ConsultaEnderecoCadastrado from '../utilitarios/endereco.utilitario'
import { AtivoUtilitarioSite } from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

describe('Emissor Cia Aberta - Cadastrar endereço correspondência diferente do endereço sede e validar os endereços do emissor cadastrado', () => {
    const endereco = require('../../../fixtures/endereco/cadastrarEndCorresp.diferenteEndSede.json')

    //Required step to test with more than one data in json.
    endereco.forEach((enderecoData: CemModel) => {

        let issuerPage: EmissorPage
        let sharedPage: SharedPage
        let enderecoPage: EnderecoSedePage
        let emissorUtilitarioSite: EmissorUtilitario
        let consultarEndereco: ConsultaEnderecoCadastrado
        let ativoUtilitario: AtivoUtilitarioSite
        let mercadoUtilitario: MercadoUtilitarioApi

        before(() => {

            issuerPage = new EmissorPage()
            sharedPage = new SharedPage()
            enderecoPage = new EnderecoSedePage()
            emissorUtilitarioSite = new EmissorUtilitario()
            consultarEndereco = new ConsultaEnderecoCadastrado()
            ativoUtilitario = new AtivoUtilitarioSite()
            mercadoUtilitario = new MercadoUtilitarioApi()

            //cadastro emissor
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaAbertaApi(enderecoData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(enderecoData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(enderecoData.Emissor)

            cy.visit('')
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, enderecoData)
            sharedPage.subMenuEndereco().click()

        })

        beforeEach(() => {

            cy.viewport(1366, 768)

        })

        it("Cadastrar endereço correspondência diferente do endereço sede do emissor", () => {

            enderecoPage.enderecoSede().type(enderecoData.Endereco.EnderecoSede)
            enderecoPage.numeroSede().type(enderecoData.Endereco.NumeroSede)
            enderecoPage.complementoSede().type(enderecoData.Endereco.ComplementoSede)
            enderecoPage.cepSede().type(enderecoData.Endereco.CEPSede)
            enderecoPage.paisSede().type(enderecoData.Endereco.PaisSede)
            enderecoPage.estadoSede()
            enderecoPage.optionSelectEstadoSede(' SP ')
            enderecoPage.cidadeSede().type(enderecoData.Endereco.CidadeSede)
            enderecoPage.telefone1Sede().type(enderecoData.Endereco.Telefone1Sede)
            enderecoPage.telefone2Sede().type(enderecoData.Endereco.Telefone2Sede)
            enderecoPage.manterMesmoEndereco().click()

            enderecoPage.enderecoCorrespondencia().menuEndCor()
            enderecoPage.enderecoCorrespondencia().corEndereco().type(enderecoData.Endereco.EnderecoCorrespondencia.EnderecoCorresp)
            enderecoPage.enderecoCorrespondencia().corNumero().type(enderecoData.Endereco.EnderecoCorrespondencia.NumeroCorresp)
            enderecoPage.enderecoCorrespondencia().corComplemento().type(enderecoData.Endereco.EnderecoCorrespondencia.ComplementoCorresp)
            enderecoPage.enderecoCorrespondencia().corCep().type(enderecoData.Endereco.EnderecoCorrespondencia.CEPCorresp)
            enderecoPage.enderecoCorrespondencia().corPais().type(enderecoData.Endereco.EnderecoCorrespondencia.PaisCorresp)
            enderecoPage.enderecoCorrespondencia().corEstado()
            enderecoPage.enderecoCorrespondencia().optionSelectCorEstado(' BA ')
            enderecoPage.enderecoCorrespondencia().corCidade().type(enderecoData.Endereco.EnderecoCorrespondencia.CidadeCorresp)
            enderecoPage.enderecoCorrespondencia().corTelefone1().type(enderecoData.Endereco.EnderecoCorrespondencia.Telefone1Corresp)
            enderecoPage.enderecoCorrespondencia().corTelefone2().type(enderecoData.Endereco.EnderecoCorrespondencia.Telefone2Corresp)
            enderecoPage.menuEndSede()
            enderecoPage.incluirEndereco()
            consultarEndereco.consultarEndereçoJaCadastrado(sharedPage, enderecoData)

        })

        it("Validar endereço sede e endereço de correspondência do emissor cadastrado", () => {

            enderecoPage.enderecoSede().should('have.value', enderecoData.Endereco.EnderecoSede)
            enderecoPage.numeroSede().should('have.value', enderecoData.Endereco.NumeroSede)
            enderecoPage.complementoSede().should('have.value', enderecoData.Endereco.ComplementoSede)
            enderecoPage.cepSede().should('have.value', enderecoData.Endereco.CEPSede)
            enderecoPage.paisSede().should('have.value', enderecoData.Endereco.PaisSede)
            enderecoPage.validarOptionSelectEstadoSede('SP')
            enderecoPage.cidadeSede().should('have.value', enderecoData.Endereco.CidadeSede)
            enderecoPage.complementoSede().should('have.value', enderecoData.Endereco.ComplementoSede)
            enderecoPage.telefone1Sede().should('have.value', enderecoData.Endereco.Telefone1Sede)
            enderecoPage.telefone2Sede().should('have.value', enderecoData.Endereco.Telefone2Sede)
            enderecoPage.fax1Sede().should('have.value', '')
            enderecoPage.fax2Sede().should('have.value', '')

            enderecoPage.enderecoCorrespondencia().menuEndCor()
            enderecoPage.enderecoCorrespondencia().corEndereco().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.EnderecoCorresp)
            enderecoPage.enderecoCorrespondencia().corNumero().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.NumeroCorresp)
            enderecoPage.enderecoCorrespondencia().corComplemento().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.ComplementoCorresp)
            enderecoPage.enderecoCorrespondencia().corCep().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.CEPCorresp)
            enderecoPage.enderecoCorrespondencia().corPais().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.PaisCorresp)
            enderecoPage.enderecoCorrespondencia().validarOptionSelectCorEstado('BA')
            enderecoPage.enderecoCorrespondencia().corCidade().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.CidadeCorresp)
            enderecoPage.enderecoCorrespondencia().corTelefone1().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.Telefone1Corresp)
            enderecoPage.enderecoCorrespondencia().corTelefone2().should('have.value', enderecoData.Endereco.EnderecoCorrespondencia.Telefone2Corresp)
            enderecoPage.enderecoCorrespondencia().corFax1().should('have.value', '')
            enderecoPage.enderecoCorrespondencia().corFax2().should('have.value', '')

        })
    })

    after("Delete Created issuer", () => {
        cy.url().then(cy.deleteIssuer)
    })
})