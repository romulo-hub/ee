import { EmissorUtilitarioApi } from "../../utilitarios/emissor.utilitario"
import { AtivoUtilitarioSite } from "../../utilitarios/ativo.utilitario"
import { MercadoUtilitarioApi } from "../../utilitarios/mercado.utilitario"
import { EnumApi, EnumTipoPrecoCapital } from "../../utilitarios/enum.utilitario"
import { DataUtilitario } from "../../utilitarios/data.utilitario"

describe('Teste de api do Capital no legado', () => {
    const capitalEmissor = require('../../../../fixtures/emissor/emissor.json')
    let _idEmissor: number
    let _idCapital: number
    let _idAtivo: number
    let _idEvento: number

    before(() => {
        const emissorUtilitarioApi = new EmissorUtilitarioApi()
        const ativoUtilitario = new AtivoUtilitarioSite()
        const mercadoUtilitario = new MercadoUtilitarioApi()

        emissorUtilitarioApi.criarEmissorCiaAbertaApi(capitalEmissor[0].Emissor);

        cy.getCEM('issuer?searchQuery=' + capitalEmissor[0].Emissor.CodigoEmissor).then(resp => {
            _idEmissor = resp.body[0].id

            cy.getCEM('issuerLegacy/' + _idEmissor).then(resp => {
                cy.log(resp.body)

                if (resp.status == EnumApi.success)
                    cy.deleteCEM('issuerLegacy', _idEmissor)
            })
        })

        mercadoUtilitario.cadastroMercadoSituacaoListado(capitalEmissor[0].Emissor)
        ativoUtilitario.ativoUtilitarioApiModal().criarTipoAtivoOrdinariaApi(capitalEmissor[0].Emissor)
    })

    it('GET - Emissor legado', () => {
        cy.getCEM('issuerLegacy/' + _idEmissor).then(resp => {
            cy.log(resp.body)
            expect(resp.status).to.be.eq(EnumApi.success)
        })
    })

    it('POST - Cadastrar capital tipo nominal com ativo ordinário', () => {
        cy.postCEM('Capital',
            {
                "issuerCode": _idEmissor,
                "sharePriceValue": 3200,
                "sharePriceTypeCode": EnumTipoPrecoCapital.nominal,
                "capitalPriceValue": 24872,
                "approvalDate": DataUtilitario.formatarDataHojeApi(),
                "capitalShares": [
                    {
                        "shareClassTypeCode": 1,
                        "capitalShareRedemptionIndicator": true,
                        "shareClassQuantity": 1600,
                        "shareControlPercentage": 0,
                        "tagAlongPercentage": 96
                    }
                ]
            }).then(resp => {
                _idCapital = resp.body.id
                _idAtivo = resp.body.capitalShares[0].id
                _idEvento = resp.body.capitalEventCode

                cy.log(resp.body)
            })
    })

    it('GET - Validar Capital legado', () => {
        cy.getCEM('issuerLegacy/' + _idEmissor).then(resp => {
            cy.log(resp.body.capitals)
            expect(resp.status).to.be.eq(EnumApi.success)
            expect(resp.body.capitals[0]).to.have.property('priceValue', 24872)
        })
    })

    after("Deletar Emissor", () => {
        cy.deleteCEM('issuer', _idEmissor)
    })
})