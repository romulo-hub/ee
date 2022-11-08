/// <reference types="Cypress" />

import { CemModel } from "../model/cem.model";
import EmissorUtilitario from "../utilitarios/emissor.utilitario";
import SharedPage from "../pages/shared.page";
import EmissorPage from "../pages/emissor.page";

describe("Alterar emissores cadastrados", () => {
  const emissor = require("../../../fixtures/emissor/emissor.json");

  //Required step to test with more than one data in json.
  emissor.forEach((emissorData: CemModel) => {
    let emissorUtilitario: EmissorUtilitario;
    let sharedPage: SharedPage;
    let emissorPage: EmissorPage;

    before(() => {
      emissorUtilitario = new EmissorUtilitario();
      sharedPage = new SharedPage();
      emissorPage = new EmissorPage();

      cy.visit("");
    });

    beforeEach(() => {
      cy.viewport(1366, 768);
    });

    it("Alterar o emissor com tipo BDR NP", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorBDRNP(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoComTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.setor().should("not.be.enabled");
      emissorPage.emissorCNPJ().should("not.be.enabled");
      emissorPage.email().clear().type("qa@teste.com.br");

      emissorPage
        .cnpjBancoLiquidante()
        .should("be.enabled")
        .type(Cypress.env("CnpjLiquidante"));
      emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

      emissorPage
        .cnpjInstituiçaoDepositaria()
        .should("be.enabled")
        .type(Cypress.env("CnpjDepositaria"));
      emissorPage
        .descricaoInstituicaoDepositaria()
        .focus()
        .should("not.be.undefined");

      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    it("Alterar o emissor com tipo Cia Aberta", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorCiaAbertaApi(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.email().clear().type("qa@teste.com.br");

      emissorPage
        .cnpjBancoLiquidante()
        .should("be.enabled")
        .type(Cypress.env("CnpjLiquidante"));
      emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    it("Alterar o emissor com tipo Cia Estrangeira", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorCiaEstrangeiraApi(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.email().clear().type("qa@teste.com.br");

      emissorPage
        .cnpjBancoLiquidante()
        .should("be.enabled")
        .type(Cypress.env("CnpjLiquidante"));
      emissorPage.descricaoBancoLiquidante().focus().should("not.be.undefined");

      emissorPage
        .cnpjInstituiçaoDepositaria()
        .should("be.enabled")
        .type(Cypress.env("CnpjDepositaria"));
      emissorPage
        .descricaoInstituicaoDepositaria()
        .focus()
        .should("not.be.undefined");

      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    it("Alterar o emissor com tipo Cia Incentivada", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorCiaIncentivada(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.email().clear().type("qa@teste.com.br");
      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    it("Alterar o emissor com tipo Outros Emissores", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorOutrosEmissores(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.email().clear().type("qa@teste.com.br");
      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    it("Alterar o emissor com tipo Disp. Reg. CVM", () => {
      emissorUtilitario
        .emissorUtilitarioApiModal()
        .criarEmissorDispRegCVM(emissorData.Emissor);
      emissorUtilitario
        .consultarEmissorCadastradoSiteModal()
        .consultarCodigoEmissorJaCadastradoSemTeclaENTERBusca(
          sharedPage,
          emissorData
        );
      emissorPage.setor().should("not.be.enabled");
      emissorPage.email().clear().type("qa@teste.com.br");
      emissorPage.exercicioSocial().should("not.be.enabled");
      emissorPage.cargo().contains("Diretor Responsável");
      emissorPage.especieControleAcionario().contains("Outras Naturezas");
      emissorPage.alterarCadastroEmissor();
      emissorPage.msgAlterarCadastroEmissor();
    });

    afterEach("Delete Created issuer", () => {
      cy.url().then(cy.deleteIssuer);
    });
  });
});
