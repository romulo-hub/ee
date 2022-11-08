export class EnderecoModel {

    EnderecoSede: string
    NumeroSede: string
    ComplementoSede: string
    CEPSede: string
    PaisSede: string
    EstadoSede: string
    CidadeSede: string
    Telefone1Sede: string
    Telefone2Sede: string
    Fax1Sede: string
    Fax2Sede: string
    EnderecoCorrespondencia: EnderecoCorrespondencia

}

export class EnderecoCorrespondencia {

    EnderecoCorresp: string
    NumeroCorresp: string
    ComplementoCorresp: string
    CEPCorresp: string
    PaisCorresp: string
    EstadoCorresp: string
    CidadeCorresp: string
    Telefone1Corresp: string
    Telefone2Corresp: string
    Fax1Corresp: string
    Fax2Corresp: string

}

export default EnderecoModel