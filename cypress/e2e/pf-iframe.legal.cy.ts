import { runConfigurations } from './run-configurations';

for (const config of runConfigurations) {
    describe(`legal specification for ${config.name} products`, () => {
        it('no data transfer by default', () => {
            cy.intercept('https://www.youtube.com/*').as('anyRequest');

            cy.visit(config.baseUrl);

            // Not ideal, but the best I could think of - instantly quickly @anyRequest might hide a potential issue
            cy.wait(2000);

            // No requests made before button click
            cy.get('@anyRequest.all').should('be.empty');

            cy.get('button').click();

            // Requests made after button click
            cy.get('@anyRequest.all').should('not.be.empty');
        });
    });
}
