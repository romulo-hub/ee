import CapitalPage from '../pages/capital.page'
import { CapitalModel } from '../model/capital.model'
import SharedPage from '../pages/shared.page'
import { CemModel } from '../model/cem.model'
import EmissorModel from "../model/emissor.model"
import { EnumTipoClasseAtivo, EnumTipoPrecoCapital } from './enum.utilitario'
import { DataUtilitario } from './data.utilitario'
import { EmissorUtilitarioApi } from './emissor.utilitario'

let capitalPage: CapitalPage
let sharedPage: SharedPage
let cemModel: CemModel
let dataHoje = DataUtilitario.formatarDataHojeApi()
let dataHojePortal = DataUtilitario.formatarDataHojePortal()
let dataSeguinte: string
let idEmissor: number
let idTipoCalculoCapitalNominal: number = EnumTipoPrecoCapital.nominal
let idTipoCalculoCapitalUnitario: number = EnumTipoPrecoCapital.unitario
let resgatavelAtivoOrdinarioCapital: boolean
let resgatavelAtivoPreferencialCapital: boolean
let resgatavelAtivoBdrCapital: boolean
let qtdeAtivoOrdinarioCapital: number
let qtdeAtivoPreferencialCapital: number
let qtdeAtivoBdrCapital: number
let tagAlongAtivoOrdinarioCapital: number
let tagAlongAtivoPreferencialCapital: number
let tagAlongAtivoBdrCapital: number
let tagAlongAtivoBdrCapitalOR: number
let tagAlongAtivoBdrCapitalPR: number
let controleAcionarioAtivoOrdinarioCapital: number = 0
let controleAcionarioAtivoPreferencialCapital: number = 0
let controleAcionarioAtivoBdrCapital: number = 0
let resgatavelAtivoNovoAtivoCapital: boolean
let qtdeAtivoNovoAtivoCapital: number
let tagAlongAtivoNovoAtivoCapital: number
let controleAcionarioNovoAtivoCapital: number = 0
let idTipoAtivoOrdinarioCapital: number = EnumTipoClasseAtivo.ordinarioOR
let idTipoAtivoPreferencialCapital: number = EnumTipoClasseAtivo.preferencialPR
let idTipoAtivoBdrCapitalPA: number = EnumTipoClasseAtivo.bdrPA
let idTipoAtivoBdrCapitalOR: number = EnumTipoClasseAtivo.bdrOR
let idTipoAtivoBdrCapitalPR: number = EnumTipoClasseAtivo.bdrPR
let valorUnitAcaoCapital: number
let valorPrecoCapital: number
let idNovoTipoAtivo: number
let emissorUtilitarioApi: EmissorUtilitarioApi

cemModel = new CemModel()
sharedPage = new SharedPage()
capitalPage = new CapitalPage()
emissorUtilitarioApi = new EmissorUtilitarioApi()


export class CapitalUtilitario {

    capitalUtilitarioApi() {

        return new CapitalUtilitarioApi()

    }

    alterarTagAlongGridAtivos(text, text2) {

        cy.get('[class="resp-table-row ng-star-inserted"]').within(() => {
            cy.contains(text)
                .should("be.visible")

                .parent().within(() => {

                    //clicar na grid de ativos
                    cy.get('[class="mat-input-element mat-form-field-autofill-control input-editable ng-untouched ng-pristine cdk-text-field-autofill-monitored ng-valid"]').click().clear().type(text2).should('be.visible')
                })
        })
    }

    validarTagAlongGridAtivos(text, text2) {

        cy.get('[class="resp-table-row ng-star-inserted"]').within(() => {
            cy.contains(text)
                .should("be.visible")
                
                .parent().within(() => {
                    //clicar na grid de ativos
                    cy.get('[class="mat-input-element mat-form-field-autofill-control input-editable ng-untouched ng-pristine cdk-text-field-autofill-monitored ng-valid"]').should('have.value', text2).should('be.visible')
                })
        })   
    }

    cadastroCapitalTipoNominal(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.capitalSocial().type(capital.CapitalSocial)
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.valorUnitAcao().should('be.enabled').type("3.200")
        capitalPage.addNovoAtivo(capital.NovoAtivoCapital)
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoNominalComUmAtivoCadastrado(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.capitalSocial().type(capital.CapitalSocial)
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.addNovoAtivoCapital()
        capitalPage.novoAtivoModal().flagResgatavel()
        capitalPage.novoAtivoModal().quantidade().clear().type("1300")
        capitalPage.novoAtivoModal().tagAlong().type("96")
        capitalPage.novoAtivoModal().tipoAtivo().selectOption("PR")
        capitalPage.novoAtivoModal().incluir().click()
        capitalPage.valorUnitAcao().should('be.enabled').type("3.200")
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoNominalComVariosAtivosCadastradoEmissorSemCapitalSocial(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.valorUnitAcao().should('be.enabled').type("3.200")
        capitalPage.addNovoAtivo(capital.NovoAtivoCapital)
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoNominalComUmAtivoCadastradoEmissorSemCapitalSocial(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.addNovoAtivoCapital()
        capitalPage.novoAtivoModal().flagResgatavel()
        capitalPage.novoAtivoModal().quantidade().clear().type("1300")
        capitalPage.novoAtivoModal().tagAlong().type("96")
        capitalPage.novoAtivoModal().tipoAtivo().selectOption("OR")
        capitalPage.novoAtivoModal().incluir().click()
        capitalPage.valorUnitAcao().should('be.enabled').type("3.200")
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoUnitarioComVariosAtivosCadastradoEmissorSemCapitalSocial(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.addNovoAtivo(capital.NovoAtivoCapital)
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoUnitarioComUmAtivoCadastradoEmissorSemCapitalSocial(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.addNovoAtivoCapital()
        capitalPage.novoAtivoModal().flagResgatavel().click()
        capitalPage.novoAtivoModal().quantidade().type("1200")
        capitalPage.novoAtivoModal().tagAlong().type("98")
        capitalPage.novoAtivoModal().tipoAtivo().selectOption("OR")
        capitalPage.novoAtivoModal().incluir().click()
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoUnitario(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.capitalSocial().type("30.000")
        capitalPage.addNovoAtivo(capital.NovoAtivoCapital)
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    cadastroCapitalTipoUnitarioComUmAtivoCadastrado(capital: CapitalModel) {

        sharedPage.subMenuCapital().click()
        capitalPage.nominalUnitario().selectOption(capital.NominalUnitario)
        capitalPage.dataAprovacao().type(dataHojePortal)
        capitalPage.capitalSocial().type("30.000")
        capitalPage.addNovoAtivoCapital()
        capitalPage.novoAtivoModal().flagResgatavel().click()
        capitalPage.novoAtivoModal().quantidade().type("1200")
        capitalPage.novoAtivoModal().tagAlong().type("98")
        capitalPage.novoAtivoModal().tipoAtivo().selectOption("OR")
        capitalPage.novoAtivoModal().incluir().click()
        capitalPage.salvarIncluirCadastroCapital()
        capitalPage.msgCadastroNovoCapitalEmissor()

    }

    consultarEmissorComCapitalJaCadastrado(sharedPage, cemModel) {

        sharedPage.menuCadastro()
        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.CodigoEmissor)
        sharedPage.lupaPesquisaEmissores().click()
        sharedPage.editarCadastroEmissor().click()
        sharedPage.subMenuCapital().click()
    }
}

export class CapitalUtilitarioApi {

    cadastroCapitalTipoNominalComUmAtivoCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)
        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoPreferencialCapital = 96
            resgatavelAtivoPreferencialCapital = true
            qtdeAtivoPreferencialCapital = 1300
            valorPrecoCapital = 28500
            valorUnitAcaoCapital = 3200

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapitalNominal,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    cadastroCapitalTipoNominalComVariosAtivosCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoPreferencialCapital = 82
            resgatavelAtivoPreferencialCapital = false
            qtdeAtivoPreferencialCapital = 2000
            tagAlongAtivoOrdinarioCapital = 92
            resgatavelAtivoOrdinarioCapital = true
            qtdeAtivoOrdinarioCapital = 1300
            valorPrecoCapital = 28500
            valorUnitAcaoCapital = 3200

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapitalNominal,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioCapital,
                            "shareControlPercentage": controleAcionarioAtivoOrdinarioCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    cadastroCapitalTipoUnitarioComUmAtivoCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoOrdinarioCapital = 98
            resgatavelAtivoOrdinarioCapital = true
            qtdeAtivoOrdinarioCapital = 1200
            valorPrecoCapital = 30000

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapitalUnitario,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioCapital,
                            "shareControlPercentage": controleAcionarioAtivoOrdinarioCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    cadastroCapitalTipoUnitarioComVariosAtivosCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoPreferencialCapital = 82
            resgatavelAtivoPreferencialCapital = false
            qtdeAtivoPreferencialCapital = 2000
            tagAlongAtivoOrdinarioCapital = 92
            resgatavelAtivoOrdinarioCapital = true
            qtdeAtivoOrdinarioCapital = 1000
            valorPrecoCapital = 30000
            tagAlongAtivoNovoAtivoCapital = 90
            resgatavelAtivoNovoAtivoCapital = true
            qtdeAtivoNovoAtivoCapital = 2000
            idNovoTipoAtivo = 4

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapitalUnitario,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioCapital,
                            "shareControlPercentage": controleAcionarioAtivoOrdinarioCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital
                        },
                        {
                            "shareClassTypeCode": idNovoTipoAtivo,
                            "capitalShareRedemptionIndicator": resgatavelAtivoNovoAtivoCapital,
                            "tagAlongPercentage": tagAlongAtivoNovoAtivoCapital,
                            "shareClassQuantity": qtdeAtivoNovoAtivoCapital,
                            "shareControlPercentage": controleAcionarioNovoAtivoCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    cadastroCapitalTipoUnitarioComDoisAtivosCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoPreferencialCapital = 30
            resgatavelAtivoPreferencialCapital = false
            qtdeAtivoPreferencialCapital = 199
            tagAlongAtivoOrdinarioCapital = 30
            resgatavelAtivoOrdinarioCapital = false
            qtdeAtivoOrdinarioCapital = 230
            valorPrecoCapital = 30000

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapitalUnitario,
                    "capitalPriceValue": valorPrecoCapital,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoOrdinarioCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoOrdinarioCapital,
                            "tagAlongPercentage": tagAlongAtivoOrdinarioCapital,
                            "shareClassQuantity": qtdeAtivoOrdinarioCapital,
                            "shareControlPercentage": controleAcionarioAtivoOrdinarioCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoPreferencialCapital,
                            "capitalShareRedemptionIndicator": resgatavelAtivoPreferencialCapital,
                            "tagAlongPercentage": tagAlongAtivoPreferencialCapital,
                            "shareClassQuantity": qtdeAtivoPreferencialCapital,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital
                        }
                    ]
                })
        }).then(resp => {

            cy.log(resp.body)

        })
    }

    emissorSemCapitalSocialCadastroCapitalTipoUnitarioComVariosAtivosCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoBdrCapital = 82
            resgatavelAtivoBdrCapital = false
            qtdeAtivoBdrCapital = 2000
            let tagAlongAtivoBdrCapital2 = 92
            let resgatavelAtivoBdrCapital2 = true
            let qtdeAtivoBdrCapital2 = 2480
            tagAlongAtivoNovoAtivoCapital = 90
            resgatavelAtivoNovoAtivoCapital = true
            qtdeAtivoNovoAtivoCapital = 2000
            idNovoTipoAtivo = 77

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapitalUnitario,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalOR,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital,
                            "tagAlongPercentage": tagAlongAtivoBdrCapital,
                            "shareClassQuantity": qtdeAtivoBdrCapital,
                            "shareControlPercentage": controleAcionarioAtivoBdrCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalPR,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital2,
                            "tagAlongPercentage": tagAlongAtivoBdrCapital2,
                            "shareClassQuantity": qtdeAtivoBdrCapital2,
                            "shareControlPercentage": controleAcionarioAtivoPreferencialCapital
                        },
                        {
                            "shareClassTypeCode": idNovoTipoAtivo,
                            "capitalShareRedemptionIndicator": resgatavelAtivoNovoAtivoCapital,
                            "tagAlongPercentage": tagAlongAtivoNovoAtivoCapital,
                            "shareClassQuantity": qtdeAtivoNovoAtivoCapital,
                            "shareControlPercentage": controleAcionarioNovoAtivoCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    emissorSemCapitalSocialCadastroCapitalTipoNominalComUmAtivoCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoBdrCapital = 96
            resgatavelAtivoBdrCapital = false
            qtdeAtivoBdrCapital = 1300
            valorUnitAcaoCapital = 3200

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapitalNominal,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalPA,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital,
                            "tagAlongPercentage": tagAlongAtivoBdrCapital,
                            "shareClassQuantity": qtdeAtivoBdrCapital,
                            "shareControlPercentage": controleAcionarioAtivoBdrCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    emissorSemCapitalSocialCadastroCapitalTipoNominalComVariosAtivosCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoBdrCapitalOR = 82
            resgatavelAtivoBdrCapital = false
            qtdeAtivoBdrCapital = 2000
            tagAlongAtivoBdrCapitalPR = 92
            resgatavelAtivoBdrCapital = true
            qtdeAtivoBdrCapital = 1000
            valorUnitAcaoCapital = 3200

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceValue": valorUnitAcaoCapital,
                    "sharePriceTypeCode": idTipoCalculoCapitalNominal,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalOR,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital,
                            "tagAlongPercentage": tagAlongAtivoBdrCapitalOR,
                            "shareClassQuantity": qtdeAtivoBdrCapital,
                            "shareControlPercentage": controleAcionarioAtivoBdrCapital
                        },
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalPR,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital,
                            "tagAlongPercentage": tagAlongAtivoBdrCapitalPR,
                            "shareClassQuantity": qtdeAtivoBdrCapital,
                            "shareControlPercentage": controleAcionarioAtivoBdrCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }

    emissorSemCapitalSocialCadastroCapitalTipoUnitarioComUmAtivoCadastrado(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            tagAlongAtivoBdrCapital = 98
            resgatavelAtivoBdrCapital = true
            qtdeAtivoBdrCapital = 1200

            cy.postCEM('Capital',
                {
                    "issuerCode": idEmissor,
                    "sharePriceTypeCode": idTipoCalculoCapitalUnitario,
                    "approvalDate": dataHoje,
                    "startDate": dataSeguinte,
                    "capitalShares": [
                        {
                            "shareClassTypeCode": idTipoAtivoBdrCapitalOR,
                            "capitalShareRedemptionIndicator": resgatavelAtivoBdrCapital,
                            "tagAlongPercentage": tagAlongAtivoBdrCapital,
                            "shareClassQuantity": qtdeAtivoBdrCapital,
                            "shareControlPercentage": controleAcionarioAtivoBdrCapital
                        }
                    ]
                }).then(resp => {

                    cy.log(resp.body)

                })
        })
    }
}

export default CapitalUtilitario