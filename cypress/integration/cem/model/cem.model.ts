import EmissorModel from './emissor.model'
import MercadoModel from './mercado.model'
import AtivoModel from './ativo.model'
import CapitalModel from './capital.model'
import EventoCapitalModel from './eventoCapital.model'
import EnderecoModel from './endereco.model'

export class CemModel {

    Emissor: EmissorModel
    Mercado: MercadoModel
    Ativos: AtivoModel[]
    Capital: CapitalModel
    EventoCapital: EventoCapitalModel
    Endereco: EnderecoModel

}

export default CemModel