export class EventoCapitalModel {

    TipoEvento: string
    ValorCapitalEvento: string
    DataAprovacao: string
    EventoHomologadoEventoAHomologar: boolean
    NovoAtivo: NovoAtivoEventosCapital[]
    EditarEventoSemHomologarCapital: EditarEventoSemHomologarCapital[]
    HomologarEventosPendenteCapital: HomologarEventosPendenteCapital[]
    GridEventosAHomologarCapital: GridEventosAHomologarCapital

}

export class NovoAtivoEventosCapital {

    TipoAtivoEventoCapital: string
    QuantidadeEventoCapital: string
    ResgatavelEventoCapital: boolean
    TagAlongEventoCapital: string

}

export class EditarEventoSemHomologarCapital {

    ValorCapitalEvento: string
    NovoAtivo: NovoAtivoEventosCapital[]

}

export class HomologarEventosPendenteCapital {

    DataAprovacaoEventoCapital: string
    DataHomologacaoEventoCapital: string
    ValorCapitalEvento: string
    MontanteHomologadoEventoCapital: string
    MontanteRestanteEventoCapital: string
    manterEventoAtivoCapital: boolean
    TipoAtivoEventoCapital: string
    QuantidadeEventoCapital: string
    QuantidadeEventoRestanteCapital: string
    QuantidadeEventoHomologadoCapital: string

}

export class GridEventosAHomologarCapital {

    TipoAtivoEventoCapital: string
    QuantidadeEventoCapital: string
    ValorCapitalEvento: string
    TipoEventoCapital: string
    DataAprovacaoEventoCapital: string

}

export default EventoCapitalModel