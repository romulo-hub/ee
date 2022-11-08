export class CapitalModel {

    dataAprovacaoCapital: string
    NominalUnitario: string
    CapitalSocial: string
    ValorUnitAcao: string
    InicioVigenciaCapital: string
    QuantidadeTotalAtivosCapital: string
    QuantidadePreferencialAtivosCapital: string
    QuantidadeOrdinariaAtivosCapital: string
    NovoAtivoCapital: NovoAtivoCapital[]
    HistoricoCapital: HistoricoCapital

}

export class NovoAtivoCapital {

    AtivoCapital: string
    TipoAtivoCapital: string
    QuantidadeCapital: string
    ResgatavelCapital: boolean
    TagAlongCapital: string

}

export class HistoricoCapital {

    Aprovacao: string
    InicioVigencia: string
    TipoEvento: string
    QuantidadeCapital: string
    CapitalSocial: string
    Capital: CapitalModel
    NovoAtivoCapital: NovoAtivoCapital[]

}

export default CapitalModel