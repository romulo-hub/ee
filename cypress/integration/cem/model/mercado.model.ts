export class MercadoModel{
    TipoMercado:string;
    SituaçaoEmissor:string;
    NegociaçaoSeparado:string;
    CategoriaB3:string;
    SegmentoNegociaçao:string;
    CodigoCVM:string;
    CategoriaCVM:string;
    IsençaoFiscal:string;
    InicioSituaçao:string;
    FimSituaçao:string;
    DataNegociaçaoSeparado:string;
    DataCategoriaB3:string;
    DataSegmentoNegociaçao:string;
    DataRegistroCVM:string;
    DataCategoriaCVM:string;
    InicioIsençaoFiscal:string;
    FimIsençaoFiscal:string;
    MercadoNegociaçao:MercadoNegociaçao[];
}
export class MercadoNegociaçao{
    MercadoNegociaçao:string;
    LotePadrao:string;
    FatorCotacao:string;
    inicioMercado:string;
    FimMercado:string;
    DataInicioLotePadrao:string;
    DataInicioFatorCotaçao:string;
}
export default MercadoModel;