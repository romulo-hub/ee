import { MercadoNegociaçao, MercadoModel } from '../model/mercado.model'
import CapitalPage from './capital.page'
export class MercadoPage {

    getTipoMercado() {
        return cy.get('[placeholder="Tipo de Mercado"]')
    }
    getSituaçaoEmissor() {
        return cy.get('[id="marketIssuerStatusCode"]')
    }
    getNegociaçaoSeparado() {
        return cy.get('[id="conditionTypeCode"]')
    }
    getCategoriaB3() {
        return cy.get('[id="categoryB3Code"]')
    }
    getSegmentoNegociaçao() {
        return cy.get('[id="tradingSegmentCode"]')
    }
    getCodigoCVM() {
        return cy.get('[id="cvmCode"]')
    }
    getCategoriaCVM() {
        return cy.get('[id="categoryCvmCode"]', {timeout:10000})
    }
    getIsençaoFiscal() {
        return cy.get('[placeholder="Isenção Fiscal (Lei 13.043/14)"]')
    }
    getDataInicioSituaçao() {
        return cy.get('[id="startDateMarketIssuerStatus"]')
    }
    getDataFimSituaçao() {
        return cy.get('[id="endDateMarketIssuerStatus"]')
    }
    getDataNegociaçaoSeparado() {
        return cy.get('#conditionDate')
    }
    getDataCagoriaB3() {
        return cy.get('[id="categoryB3Date"]')
    }
    getDataSegmentoNegociaçao() {
        return cy.get('[placeholder="Data do Segmento de Negociação"]')
    }
    getDataRegistroCVM() {
        return cy.get('[id="cvmRegistryDate"]')
    }
    getDataCategoriaCVM() {
        return cy.get('[id="categoryCvmDate"]')
    }
    getInicioIsençaoFiscal() {
        return cy.get('[placeholder="Ínicio da Isenção Fiscal"]')
    }
    getFimIsençaoFiscal() {
        return cy.get('[placeholder="Fim da Isenção Fiscal"]')
    }
    addMercadoNegociaçao() {
        return cy.get('app-market-detail').within(() => {
            return cy.get('[id="bt_add"]').contains('add')
        })
    }
    cancelarMercadoNegociaçao(){
        return cy.get('app-trademarket-detail').within(() => {
            return cy.contains('Cancelar')
        })        
    }

    getMercadoNegociaçaoModal() {
        return new MercadoNegociaçaoPage();
    }

    //Utilities
    salvar() {
        cy.get('app-market-detail').within(() => {
            cy.get('[caption="Salvar"]',{timeout:10000}).click()
        })
        cy.contains('INCLUIR').click()
    }

    setMercadoNegociaçao(mercadoNegociaçao: MercadoNegociaçao[]) {
        
        mercadoNegociaçao.forEach((negociaçao: MercadoNegociaçao) => {
            this.addMercadoNegociaçao().click()
            this.getMercadoNegociaçaoModal().getMercadoNegociaçao().selectOption(negociaçao.MercadoNegociaçao)
            this.getMercadoNegociaçaoModal().getLotePadrao().selectOption(negociaçao.LotePadrao)
            this.getMercadoNegociaçaoModal().getFatorCotaçao().selectOption(negociaçao.FatorCotacao)
            //this.getMercadoNegociaçaoModal().getInicioMercado().type(negociaçao.inicioMercado)
            //this.getMercadoNegociaçaoModal().getFimMercado().type(negociaçao.FimMercado)
            //this.getMercadoNegociaçaoModal().getDataInicioLotePadrao().type(negociaçao.DataInicioLotePadrao)
            //this.getMercadoNegociaçaoModal().getDataInicioFatorCotaçao().type(negociaçao.DataInicioFatorCotaçao)
            this.getMercadoNegociaçaoModal().getIncluir().click()
        })
              
    }

    criarMercado(mercado:MercadoModel){
        this.getTipoMercado().selectOption(mercado.TipoMercado)
        this.getSituaçaoEmissor().selectOption(mercado.SituaçaoEmissor)
        this.getNegociaçaoSeparado().selectOption(mercado.NegociaçaoSeparado)
        this.getCategoriaB3().selectOption(mercado.CategoriaB3)
        this.getSegmentoNegociaçao().selectOption(mercado.SegmentoNegociaçao)
        this.getCodigoCVM().type(mercado.CodigoCVM)
        this.getCategoriaCVM().selectOption(mercado.CategoriaCVM)
        this.getIsençaoFiscal().selectOption(mercado.IsençaoFiscal)
        this.getDataInicioSituaçao().type(mercado.InicioSituaçao)
        this.getDataFimSituaçao().type(mercado.FimSituaçao)
        this.getDataNegociaçaoSeparado().type(mercado.DataNegociaçaoSeparado)
        this.getDataCagoriaB3().type(mercado.DataCategoriaB3)
        this.getSegmentoNegociaçao().type(mercado.DataSegmentoNegociaçao)
        this.getDataRegistroCVM().type(mercado.DataRegistroCVM)
        this.getDataCategoriaCVM().type(mercado.DataCategoriaCVM)
        this.getInicioIsençaoFiscal().type(mercado.InicioIsençaoFiscal)
        this.getFimIsençaoFiscal().type(mercado.FimIsençaoFiscal)
        this.setMercadoNegociaçao(mercado.MercadoNegociaçao)
        this.salvar()
    }

}

export class MercadoNegociaçaoPage {

    getMercadoNegociaçao() {
        return cy.get('[placeholder="Mercado de Negociação"]')
    }
    getLotePadrao() {
        return cy.get('[placeholder="Lote Padrão"]')
    }
    getFatorCotaçao() {
        return cy.get('[placeholder="Fator de Cotação"]')
    }
    getInicioMercado() {
        return cy.get('[id="input_startDate"]')
    }
    getFimMercado() {
        return cy.get('[placeholder="Fim do Mercado"]')
    }
    getDataInicioLotePadrao() {
        return cy.get('[id="input_roundLotStartDate"]')
    }
    getDataInicioFatorCotaçao() {
        return cy.get('[id="input_factorStartDate"]')
    }

    flagIniciarNegociacao(){
        return cy.get('[id="btStartNegotiation"]')
    }

    getIncluir() {
        return cy.get('[id="btn_flat-fix"]').contains(locator.includeButton)
    }
    getCancelar() {
        return cy.contains(locator.backButton)
    }
}

export default MercadoPage;

interface TradingMarketLocator {
    includeButton: string;
    backButton: string;
    cvmCode: string;
    conditionTypeCode: string;
}

const locator : TradingMarketLocator = {
    includeButton: 'Incluir',
    backButton: 'Voltar',
    cvmCode: '#cvmCode',
    conditionTypeCode: '#conditionTypeCode'
}