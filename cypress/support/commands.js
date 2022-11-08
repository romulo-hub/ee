/// <reference types="Cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
''

const dayjs = require('dayjs');

Cypress.Commands.add('selectOption', { prevSubject: 'element' }, function (subject, data) {

    if (!data)
        return;

    cy.wait(2000).get(subject, {timeout:10000}).scrollIntoView().should('be.visible').click()

    cy.wait(1000).get('.mat-option-text', {timeout:10000}).contains(data).scrollIntoView()
        .should('be.visible').click()
        .then($el => { expect($el).to.not.be.visible })

})


Cypress.Commands.add('setDataField', { prevSubject: 'element' }, function (subject, option) {

    if (!option)
        return;

    cy.get(subject, {timeout:10000})
    .scrollIntoView()
    .should('be.visible')
    .click()

    cy.get(subject, {timeout:10000})
    .should('be.focused')
    .type(option)
    .then($el => {
        if($el.val() == option){
         expect($el).to.have.value(option)
        }
        else
        {
            cy.get($el)
            .clear()
            .type(option)
        }
    })
    .should('have.value', option)
    

})

Cypress.Commands.add('validateSelectOptions', { prevSubject: 'element' }, function (subject, options) {

    if (!options)
        return;

    cy.get(subject).should('be.visible').click()

    options.forEach(option => {
        cy.wait(500).get('.mat-option-text').contains(option)
            .scrollIntoView().should('be.visible')
    });

})

Cypress.Commands.add('rowButton', function (text, button) {

    cy.get('mat-table').within(() => {
        cy.get('mat-cell').contains(text)
            .should("be.visible")
            .parent().within(() => {
                cy.get(button)
                    .click()
            })

    })

});

Cypress.Commands.add('rowTableActive', function (text, button) {

    cy.get('#resp-table-body').within(() => {
        cy.contains(text)
            .should("be.visible")
            .parent().within(() => {
                cy.get(button)
                    .click()
            })

    })

});

Cypress.Commands.add('getNextWorkingDay', () => {

    cy.getCEM("Calendar/get-next-workingday").then((response) => {

        if (response.status == 200) {

            return cy.wrap(dayjs(response.body).format('DD/MM/YYYY'))
        }
    })
});

Cypress.Commands.add('getNextWorkingDayApi', () => {

    cy.getCEM("Calendar/get-next-workingday").then((response) => {

        if (response.status == 200) {

            return cy.wrap(dayjs(response.body).format('YYYY-MM-DD'))
        }
    })
});

Cypress.Commands.add('getDate', () => {

    return cy.wrap(dayjs().format('DD/MM/YYYY'))

});

Cypress.Commands.add('getDateShort', () => {

    return cy.wrap(dayjs().format('D/M/YYYY'))

});

Cypress.Commands.add('getDateShortMonth', () => {

    return cy.wrap(dayjs().format('DD/M/YYYY'))

});

Cypress.Commands.add('getYesterdayDate', _ => {
    
    let date = new Date()
    date.setDate(date.getDate() - 1)

    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()

    return cy.wrap(day+'/'+month+'/'+year)

});

Cypress.Commands.add('deleteIssuer', url => {

    const reg = new RegExp('(?:issuer\/)([0-9]{1,})', 'gi')
    const result = reg.exec(url);
    if (result) {
        const issuerId = Number(result[result.length - 1]);
        cy.getTokenApiAuth()
            .then(resp => {
                if (issuerId !== 0)
                    cy.request({
                        headers: { Authorization: `bearer ${resp.body.token}` },
                        method: 'DELETE',
                        url: Cypress.env('cemApi') + '/api/v1/issuer/' + issuerId
                    })
                cy.log(resp.body)

            })
    }
})

Cypress.Commands.add('getTokenApiAuth', () => {

    return cy.request({
        method: 'POST',
        url: Cypress.env('cemApi') + '/api/v1/auth',
        body:
        {
            "username": "",
            "roles": [
                Cypress.env('authRole')
            ]
        }
    })
})

Cypress.Commands.add('matOptionDisabled', ($opt) => {

    expect($opt).to.have.attr('aria-disabled');
})

Cypress.Commands.add('postCEM', postCEM);

function postCEM(url, body) {

    cy.getTokenApiAuth()
        .then(resp => {
            let token = resp.body.token
            cy.request({
                headers: { Authorization: `bearer ${token}` },
                method: 'POST',
                url: Cypress.env('cemApi') + `/api/v1/${url}`,
                failOnStatusCode: false,
                body: body
            })
        })
}

Cypress.Commands.add('putCEM', putCEM);

function putCEM(url, body) {

    cy.getTokenApiAuth()
        .then(resp => {
            let token = resp.body.token
            cy.request({
                headers: { Authorization: `bearer ${token}` },
                method: 'PUT',
                url: Cypress.env('cemApi') + `/api/v1/${url}`,
                failOnStatusCode: false,
                body: body
            })
        })
}

Cypress.Commands.add('getCEM', getCEM);

function getCEM(url) {

    cy.getTokenApiAuth()
        .then(resp => {
            let token = resp.body.token
            cy.request({
                headers: { Authorization: `bearer ${token}` },
                method: 'GET',
                url: Cypress.env('cemApi') + `/api/v1/${url}`,
                failOnStatusCode: false

            })
        })
}

Cypress.Commands.add('deleteCEM', deleteCEM);


function deleteCEM(url, id) {

    cy.getTokenApiAuth()
        .then(resp => {
            let token = resp.body.token
            cy.request({
                headers: { Authorization: `bearer ${token}` },
                method: 'DELETE',
                url: Cypress.env('cemApi') + `/api/v1/${url}/${id}`,
                failOnStatusCode: false

            })
        })
}