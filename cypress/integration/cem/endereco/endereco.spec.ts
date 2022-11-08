/// <reference types="Cypress" />

import { CemModel } from '../model/cem.model'
import EmissorPage from '../pages/emissor.page'
import SharedPage from '../pages/shared.page'
import EnderecoSedePage from '../pages/endereco.page'
import EmissorUtilitario from '../utilitarios/emissor.utilitario'
import ConsultaEnderecoCadastrado from '../utilitarios/endereco.utilitario'
import { AtivoUtilitarioSite } from '../utilitarios/ativo.utilitario'
import { MercadoUtilitarioApi } from '../utilitarios/mercado.utilitario'

describe('Criar endereço para emissor', () => {
    const endereco = require('../../../fixtures/endereco/endereco.json')

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

        })

        beforeEach(() => {

            //cadastro emissor
            emissorUtilitarioSite.emissorUtilitarioApiModal().criarEmissorCiaEstrangeiraApi(enderecoData.Emissor)
            mercadoUtilitario.cadastroMercadoSituacaoListado(enderecoData.Emissor)
            ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoPreferencialApi(enderecoData.Emissor)
           
            cy.viewport(1366, 768)
            visitarEmissor()
            sharedPage.subMenuEndereco().click()

        })

        it("Informar o endereço", () => {

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

            enderecoPage.fax1Sede().type(enderecoData.Endereco.Fax1Sede)

            enderecoPage.fax2Sede().type(enderecoData.Endereco.Fax2Sede)

            enderecoPage.incluirEndereco()
            
            visitarEmissor()

            sharedPage.subMenuEndereco().click()

            enderecoPage.enderecoSede().should('include.value', enderecoData.Endereco.EnderecoSede)
            
        })

        let visitarEmissor = () =>{
    
            cy.visit('')
        
            emissorUtilitarioSite.consultarEmissorCadastradoSiteModal().consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(sharedPage, enderecoData)
        
        }
        
    })

    after("Delete Created issuer", () => {
        cy.url().then(cy.deleteIssuer)
    })

    
})

