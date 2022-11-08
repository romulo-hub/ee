import SharedPage from '../pages/shared.page'
import { CemModel } from '../model/cem.model'
import EmissorModel from "../model/emissor.model"
import AtivoPage from '../pages/ativo.page'
import { EnumTipoAtivo, EnumTipoTransferencia } from './enum.utilitario'
import { EnumFormaEmissaoAtivo } from './enum.utilitario'
import { EmissorUtilitarioApi } from './emissor.utilitario'
import { DataUtilitario } from './data.utilitario'

let sharedPage: SharedPage
let cemModel: CemModel
let dataHoje = DataUtilitario.formatarDataHojeApi()
let ativoPage: AtivoPage
let emissorUtilitarioApi: EmissorUtilitarioApi
let dataSeguinte: string
let idTipoAtivoOrdinario: number = EnumTipoAtivo.ordinario
let idTipoAtivoPreferencial: number = EnumTipoAtivo.preferencial
let idFormaEmissaoEscritural: number = EnumFormaEmissaoAtivo.escritural
let idFormaEmissaoNominativa: number = EnumFormaEmissaoAtivo.nominativa
let idTipoTransferenciaEletronico: number = EnumTipoTransferencia.eletronico
let idTipoTransferenciaPapel: number = EnumTipoTransferencia.papel
let idEscrituradorOrdinario: number = 189
let idEscrituradorPreferencial: number = 190
let bloqueioProcuracaoOrdinario: boolean = false
let bloqueioProcuracaoPreferencial: boolean = true
let bloqueioProcuracaoBDR: boolean = false
let idEmissor: number
let idTipoAtivoBDR: number = EnumTipoAtivo.bdr
let qtdeBDR: number
let idNivelEmissaoBDR: number
let idEscrituradorBDR: number = 193

sharedPage = new SharedPage()
cemModel = new CemModel()
ativoPage = new AtivoPage()
emissorUtilitarioApi = new EmissorUtilitarioApi()

export class AtivoUtilitarioSite {

    ativoUtilitarioApiModal() {

        return new AtivoUtilitarioApi()

    }
}

export class AtivoUtilitarioApi {

    criarTipoAtivoOrdinariaApi(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.putCEM('issuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivoOrdinario,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissaoEscritural,
                            "transferTypeCode": idTipoTransferenciaEletronico,
                            "shareAdministratorCode": idEscrituradorOrdinario,
                            "procurationBlockIndicator": bloqueioProcuracaoOrdinario
                        }
                    ]
                })
        }).then(resp => {

            cy.log(resp.body)

        })
    }

    criarTipoAtivoBDRApi(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.putCEM('issuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivoBDR,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissaoEscritural,
                            "transferTypeCode": idTipoTransferenciaEletronico,
                            "shareAdministratorCode": idEscrituradorBDR,
                            "procurationBlockIndicator": bloqueioProcuracaoBDR,
                            "bdrParity": qtdeBDR,
                            "bdrLevelNumber": idNivelEmissaoBDR
                        }
                    ]
                })
        }).then(resp => {

            cy.log(resp.body)

        })
    }

    criarTipoAtivoPreferencialApi(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.putCEM('issuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivoPreferencial,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissaoNominativa,
                            "transferTypeCode": idTipoTransferenciaPapel,
                            "shareAdministratorCode": idEscrituradorPreferencial,
                            "procurationBlockIndicator": bloqueioProcuracaoPreferencial
                        }
                    ]
                })
        }).then(resp => {

            cy.log(resp.body)

        })
    }

    criarTiposAtivosPreferencialOrdinariaApi(emissor: EmissorModel) {

        cy.getCEM('Calendar/get-next-workingday').then(resp => {

            dataSeguinte = resp.body

            cy.log(resp.body)

        })

        cy.getCEM('issuer?searchQuery=' + emissor.CodigoEmissor).then(resp => {

            idEmissor = resp.body[0].id

            cy.log(resp.body)

        }).then(resp => {

            cy.putCEM('issuerShare',
                {
                    "issuerCode": idEmissor,
                    "issuerShares": [
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivoPreferencial,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissaoNominativa,
                            "transferTypeCode": idTipoTransferenciaPapel,
                            "shareAdministratorCode": idEscrituradorPreferencial,
                            "procurationBlockIndicator": bloqueioProcuracaoPreferencial
                        },
                        {
                            "id": 0,
                            "shareTypeCode": idTipoAtivoOrdinario,
                            "startDate": dataSeguinte,
                            "issuingTypeCode": idFormaEmissaoEscritural,
                            "transferTypeCode": idTipoTransferenciaEletronico,
                            "shareAdministratorCode": idEscrituradorOrdinario,
                            "procurationBlockIndicator": bloqueioProcuracaoOrdinario
                        }
                    ]
                })
        }).then(resp => {

            cy.log(resp.body)

        })
    }
}

export default AtivoUtilitarioSite