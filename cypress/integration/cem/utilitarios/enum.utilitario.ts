
export enum EnumTipoPrecoCapital {

    nominal = 1,
    unitario = 0,

}

export enum EnumTipoEventoCapital {

    cisaoI = 4,
    subscricao = 15,
    somarQtdesAtivos = 28,
    aumentoCapital = 1,
    ajuste = 2,
    bonificacao = 3,
    cisaoII = 16,
    conversaoAcoes = 5,
    conversaoDebentures = 6,
    desdobramento = 8,
    exercSubscricao = 9,
    grupamento = 10,
    incorporacao = 11,
    planoOpcao = 12,
    QtdeBDRNP = 13,
    reducaoCapital = 14,

}

export enum EnumTipoAtivo {

    ordinario = 1,
    preferencial = 2,
    bdr = 3,
    cepac = 4,
    fundo = 5

}

export enum EnumTipoClasseAtivo {

    ordinarioOR = 2,
    preferencialPR = 11,
    preferencialPH = 10,
    bdrPA = 76,
    bdrOR = 75,
    bdrPR = 84

}

export enum EnumFormaEmissaoAtivo {

    escritural = 1,
    nominativa = 2,

}

export enum EnumTipoEmissor {

    ciaAberta = 1,
    ciaIncentivada = 6,
    dispRegCVM = 7,
    emissorBDR = 4,
    fundoInvestimento = 5,
    outrosEmissores = 99,
    ciaEstrangeira = 2,

}

export enum EnumCargo {

    diretorRelacoesInvestidores = 1,
    diretorResponsavel = 2,
    naoAplicavel = 99,

}

export enum EnumTipoMercado {

    bolsa = 1,
    balcaoExBVMF = 2,
    basicoBalcao = 287,
    balcaoExCetip = 20,
    outros = 99,
    depositoExclusivo = 10,

}

export enum EnumSituacaoEmissor {

    listado = 1,
    apenasAdmitidoNegociacao = 2,
    listadoAdmitidoNegociacao = 3,
    listadoCetipTrader = 4,
    admitidoNegociacao = 5,
    depositoExclusivo = 6,
    outros = 99,

}

export enum EnumNegociacaoSeparado {

    admEspRaet = 5,
    intervencao = 6,
    nao = 1,
    outrasCondicoes = 2,
    recupExtrajudic = 3,
    recupJudicial = 4,

}

export enum EnumCategoriaB3 {

    a = 1,
    b = 2,
    categoriaB3BDR1 = 3,
    categoriaB3BDR2 = 4,
    categoriaB3BDR3 = 5,
    categoriaB3BDRN = 6,
    categoriaB3FII = 7,
    categoriaB3FIA = 8,
    categoriaB3FIP = 9,
    categoriaB3FIDC = 10,
    leiloes = 13,
    categoriaB3FINAM = 14,
    categoriaB3FINOR = 15,
    categoriaB3FUNDES = 16,
    categoriaB3FISET = 17,
    categoriaB3CEPAC = 18,
    categoriaB3ETFRFIXA = 19,
    categoriaB3ETFRVARIAVEL = 20,
    categoriaB3FIPEE = 21,
    categoriaB3FIPIE = 22,
    categoriaB3FIPPDI = 23,
    categoriaB3FIPCS = 24,
    categoriaB3FIPMT = 25,
    categoriaB3FIAMERCACESSO = 26,
    outros = 99,

}

export enum EnumSegmentoNegociacao {

    bolsa = 4,
    balcao = 5,
    novoMercado = 3,
    nivel1 = 1,
    nivel2 = 2,
    mais = 6,
    maisNivel2 = 7,

}

export enum EnumCategoriaCVM {

    a = 1,
    b = 2,
    outros = 99,

}

export enum EnumMercadoNegociacao {

    bolsaRendaVariavel = 1,
    balcaoRendaVariavel = 2,
    bolsaRendaFixa = 3,
    balcaoRendaFixa = 4,
    cetipTrader = 8,
    naoAplicavel = 99,

}

export enum EnumLotePadrao {

    lote1 = 1,
    lote2 = 10,
    lote3 = 100,
    lote4 = 1000,
    lote5 = 10000,
    lote6 = 100000,
    lote7 = 1000000,

}

export enum EnumFatorCotacao {

    fator10 = 1,
    fator100 = 2,
    fator1 = 3,

}

export enum EnumNivelEmissaoBDR {

    zero = 0,
    nivel1 = 1,
    nivel2 = 2,
    nivel3 = 3,
    nivelEmissao144A = 4,
    regulations144A = 5,
    nivelEmissaoGDR = 6,

}

export enum EnumTipoTransferencia {

    eletronico = 1,
    papel = 0

}

export enum EnumApi {

    continue = 100,
    switchingProtocols = 101,
    processing = 102,
    success = 200,
    created = 201,
    accepted = 202,
    nonAuthoritativeInformation = 203,
    noContent = 204,
    resetContent = 205,
    partialContent = 206,
    multipleChoices = 300,
    movedPermanently = 301,
    found = 302,
    seeOther = 303,
    notModified = 304,
    useProxy = 305,
    proxySwitch = 306,
    badRequest = 400,
    unauthorized = 401,
    paymentRequired = 402,
    forbidden = 403,
    notFound = 404,
    methodNotAllowed = 405,
    notAcceptable = 406,
    proxyAuthenticationRequired = 407,
    requestTimeOut = 408,
    conflict = 409,
    gone = 410,
    lenghtRequired = 411,
    preconditionFailed = 412,
    requestEntityTooLarge = 413,
    requestURLTooLarge = 414,
    unsupportedMediaType = 415,
    requestRangeNotSatisfiable = 416,
    expectationFailed = 417,
    internalServerError = 500,
    notImplemented = 501,
    badGateway = 502,
    serviceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,

}