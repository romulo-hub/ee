const dayjs = require('dayjs');
const weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday)

export class DataUtilitario {
    /**
      * Retorna a data de hoje como string no formato yyyy-MM-ddT00:00:00
     */
    static hoje(): string {
        return this.formatarData(new Date())
    }

    /**
      * Retorna a string 9999-12-31T00:00:00
     */
    static fimDosTempos(): string {
        return this.formatarData(new Date(9999, 11, 31))
    }

    /**
      * Retorna a data informada como string no formato yyyy-MM-ddT00:00:00
     */
    // static formatarData(data: Date): string {
    //     //O mês começa no índice 0, por isso tem aquele + 1
    //     return `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}T00:00:00`
    // }

    static formatarData(data: Date): string {
        //O mês começa no índice 0, por isso tem aquele + 1
        return `${dayjs(data).format('YYYY-MM-DD')}T00:00:00`
    }

    static formatarDataHojeApi(): string {

        // formatar a data hoje no formato 'YYYY-MM-DD'
        return dayjs().format('YYYY-MM-DD')

    }
    static formatarDataHojePortal(): string {

        // formatar a data hoje no formato 'DD/MM/YYYY'
        return dayjs().format('DD/MM/YYYY')

    }

    static proximoDiaNaoUtilApi(): string { 

        var dataNaoUtil = dayjs().weekday(7)
        return dayjs(dataNaoUtil).format('YYYY-MM-DD')

    }

    static formatarDataAmanhaApi(): string { 
        // retorna a data do próximo dia
        return dayjs().add(1, 'day').format('YYYY-MM-DD')
    }
}