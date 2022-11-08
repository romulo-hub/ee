import SharedPage from '../pages/shared.page'
import { CemModel } from '../model/cem.model'

let sharedPage: SharedPage
let cemModel: CemModel

cemModel = new CemModel()
sharedPage = new SharedPage()

export class ConsultaEnderecoCadastrado {

    consultarEndereçoJaCadastrado(sharedPage, cemModel) {
        
        sharedPage.menuCadastroEmissor()
        sharedPage.buscaEmissores().type(cemModel.Emissor.CodigoEmissor)
        sharedPage.lupaPesquisaEmissores().click()
        sharedPage.editarCadastroEmissor().click()
        sharedPage.subMenuEndereco().click()

    }
}

export default ConsultaEnderecoCadastrado