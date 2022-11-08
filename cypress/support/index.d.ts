/// <reference types="cypress" />
declare namespace Cypress {
    
  interface Chainable<Subject> {
    /**
     * Custom command to select DOM element by option text.
     * @example cy.get('element').selectOption('Ativo')
    */
    selectOption(option: string): Chainable<Element>

     /**
     * Custom command to set a data field angular element by text.
     * @example cy.get('element').setDataField('12/10/2021')
    */
    setDataField(data: string): Chainable<Element>

    /**
      * Custom command to check list of elements in select
      * @example 
      * var elements_check = ['A','B','B']
      * cy.get('select').validateSelectOptions(elements_check)
     */
    validateSelectOptions(options: string[]): Chainable<Element>

    /**
      * Custom command to select button within table.
      * @example cy.rowButton('ATIVO','[id="delete"]')
     */
    rowButton(text: string, button: any): Chainable<Element>

    /**
       * Custom command to select button within table.
       * @example cy.rowButton('ATIVO','[id="delete"]')
      */
    rowTableActive(text: string, button: any): Chainable<Element>

    /**
       * Custom command used to get date, can receive parameters to addDays
       * Get Next Day
       * @example cy.getDate(1)
      */
    getNextWorkingDay(): Chainable<string>

    /**
       * Custom command used to get date, can receive parameters to addDays
       * Get Next Day
       * @example cy.getDate(1)
      */
    getNextWorkingDayApi(): Chainable<string>

    /**
      * Custom command used to get date, can receive parameters to addDays     
      * Get date
      * @example cy.getDate(0)
     */
    getDate(number?: Number): Chainable<string>

    getDateShort(number?: Number): Chainable<string>

    getDateShortMonth(number?: Number): Chainable<string>

    getYesterdayDate(): Chainable<string>

    /**
      * Delete an issuer using issuer api
      * url
      * @example http:<server>/issuer/<issuerId>
     */
    deleteIssuer(url: string): Chainable<string>

    matOptionDisabled(opt: JQuery<HTMLElement>)

    /**
      * Token using api Auth      
     */
    getTokenApiAuth()

    /**
      * Post service
     */
    postCEM(url: string, body): Chainable<any>

    /**
      * Put service
     */
    putCEM(url: string, body): Chainable<any>

    /**
      * Delete service
     */
    deleteCEM(url: string, id: number): Chainable<any>

    /**
      * Get service
     */
    getCEM(url: string): Chainable<any>

    tab(options?: any): Chainable<any>

    moment(options?: any): any
  }

}
declare function require(name: string);