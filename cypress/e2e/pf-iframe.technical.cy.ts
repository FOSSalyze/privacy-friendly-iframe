import { attributeMap, runConfigurations } from "./run-configurations";



for (const config of runConfigurations) {
    describe(`technical specification for ${config.name} products`, () => {
        it('attributes are passed through', () => {
            cy.visit(config.baseUrl);

            // Inner iframe only exists after clicking the button
            cy.get('button').click();

            // Initial values
            for (const singleAttribute of attributeMap) {
                cy.get('pf-iframe').invoke('attr', singleAttribute.pfIFrameName).then((pfIframeAttribute) => {
                    cy.get('iframe').invoke('attr', singleAttribute.iFrameName).then((iFrameAttribute) => {
                        expect(pfIframeAttribute).to.equal(iFrameAttribute);
                    });
                });
            }

            // Changed Values
            for (const singleAttribute of attributeMap) {
                cy.get('pf-iframe').invoke('attr', singleAttribute.pfIFrameName, singleAttribute.exampleValue).then(() => {
                    cy.get('iframe').invoke('attr', singleAttribute.iFrameName).then((iFrameAttribute) => {
                        expect(iFrameAttribute).to.equal(singleAttribute.exampleValue);
                    });
                });
            }
        });

        it('removed attributes are also removed on iframe', () => {
            cy.visit(config.baseUrl);

            // Inner iframe only exists after clicking the button
            cy.get('button').click();

            // Changed Values
            for (const singleAttribute of attributeMap) {
                // First set, then unset attribute to verify that it is removed
                cy.get('pf-iframe').invoke('attr', singleAttribute.pfIFrameName, singleAttribute.exampleValue).then(() => {
                    cy.get('pf-iframe').invoke('attr', singleAttribute.pfIFrameName, null).then(() => {
                        cy.get('iframe').invoke('attr', singleAttribute.iFrameName).then((iFrameAttribute) => {
                            expect(iFrameAttribute).to.not.exist;
                        });
                    });
                });
            }
        });

        describe('special attribute showIFrame', () => {
            it('showIFrame is reflected', () => {
                cy.visit(config.baseUrl);
                cy.get('pf-iframe').invoke('attr', 'showiframe').should('not.exist');

                cy.get('button').click();
                cy.get('pf-iframe').invoke('attr', 'showiframe').should('exist');
            });

            it('changing the showIFrame attribute shows/hides the iframe', () => {
                cy.visit(config.baseUrl);
                
                cy.get('pf-iframe').invoke('attr', 'showiframe').should('not.exist');
                cy.get('iframe').should('not.exist');
                
                cy.get('pf-iframe').invoke('attr', 'showiframe', 'true');
                cy.get('iframe').should('exist');

                cy.get('pf-iframe').invoke('attr', 'showiframe', null);
                cy.get('iframe').should('not.exist');
            });
        });

        describe('global configurations', () => {

        });
    });
};