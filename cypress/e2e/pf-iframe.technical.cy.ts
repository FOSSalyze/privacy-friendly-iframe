import { attributeMap, pfIFrameId, runConfigurations } from './run-configurations';
import { applyGlobalConfig } from './util/applyGlobalConfig';
import { TestWindow } from './util/types';

for (const config of runConfigurations) {
    describe(`technical specification for ${config.name} products`, () => {
        it('attributes are passed through', () => {
            cy.visit(config.baseUrl);

            // Inner iframe only exists after clicking the button
            cy.get('button').click();

            // Initial values
            for (const singleAttribute of attributeMap) {
                cy.get('pf-iframe')
                    .invoke('attr', singleAttribute.pfIFrameName)
                    .then((pfIframeAttribute) => {
                        cy.get('iframe')
                            .invoke('attr', singleAttribute.iFrameName)
                            .then((iFrameAttribute) => {
                                expect(pfIframeAttribute).to.equal(iFrameAttribute);
                            });
                    });
            }

            // Changed Values
            for (const singleAttribute of attributeMap) {
                cy.get('pf-iframe')
                    .invoke('attr', singleAttribute.pfIFrameName, singleAttribute.exampleValue)
                    .then(() => {
                        cy.get('iframe')
                            .invoke('attr', singleAttribute.iFrameName)
                            .then((iFrameAttribute) => {
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
                cy.get('pf-iframe')
                    .invoke('attr', singleAttribute.pfIFrameName, singleAttribute.exampleValue)
                    .then(() => {
                        cy.get('pf-iframe')
                            .invoke('attr', singleAttribute.pfIFrameName, null)
                            .then(() => {
                                cy.get('iframe')
                                    .invoke('attr', singleAttribute.iFrameName)
                                    .then((iFrameAttribute) => {
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

            it('only empty string and "true" lead to display', () => {
                cy.visit(config.baseUrl);

                cy.get('pf-iframe').invoke('attr', 'showiframe').should('not.exist');
                cy.get('iframe').should('not.exist');

                cy.get('pf-iframe').invoke('attr', 'showiframe', 'true');
                cy.get('iframe').should('exist');

                cy.get('pf-iframe').invoke('attr', 'showiframe', null);
                cy.get('iframe').should('not.exist');

                cy.get('pf-iframe').invoke('attr', 'showiframe', '');
                cy.get('iframe').should('exist');

                cy.get('pf-iframe').invoke('attr', 'showiframe', 'something-else');
                cy.get('iframe').should('not.exist');
            });

            for (const id of [null, pfIFrameId] as const) {
                describe(`reflection per global ${id ? 'id' : 'default'} of checkExistingConsent`, () => {
                    it('when checkExistingConsent results in true it reflects', () => {
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                applyGlobalConfig(
                                    win,
                                    {
                                        checkExistingConsent: () => true,
                                    },
                                    id
                                );
                            },
                        });

                        cy.get('pf-iframe').invoke('attr', 'showiframe').should('exist');
                    });

                    it('when checkExistingConsent results in false it reflects', () => {
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                applyGlobalConfig(
                                    win,
                                    {
                                        checkExistingConsent: () => false,
                                    },
                                    id
                                );
                            },
                        });

                        cy.get('pf-iframe').invoke('attr', 'showiframe').should('not.exist');
                    });
                });
            }
        });

        describe('global configurations', () => {
            for (const id of [null, pfIFrameId] as const) {
                describe(`per global ${id ? 'id' : 'default'} settings`, () => {
                    it('onConsent is executed on consenting', () => {
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                win.executed = false;
                                applyGlobalConfig(
                                    win,
                                    {
                                        onConsent: () => {
                                            win.executed = true;
                                        },
                                    },
                                    id
                                );
                            },
                        });

                        cy.window().its('executed').should('be.false');
                        cy.get('button').click();
                        cy.window().its('executed').should('be.true');
                    });

                    it('generateConsentTemplate is used', () => {
                        const newHtml = 'This is the new text.';
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                applyGlobalConfig(
                                    win,
                                    {
                                        generateConsentTemplate: () => newHtml,
                                    },
                                    id
                                );
                            },
                        });

                        cy.get('pf-iframe').invoke('html').should('equal', newHtml);
                    });

                    it('fetchConsentElement is used', () => {
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                applyGlobalConfig(
                                    win,
                                    {
                                        fetchConsentElement: (self) => self.querySelector('p'),
                                    },
                                    id
                                );
                            },
                        });

                        cy.get('iframe').should('not.exist');
                        cy.get('button').click();
                        cy.get('iframe').should('not.exist');
                        cy.get('p').click();
                        cy.get('iframe').should('exist');
                    });

                    it('checkExistingConsent is used', () => {
                        cy.visit(config.baseUrl, {
                            onBeforeLoad: (win: TestWindow) => {
                                applyGlobalConfig(
                                    win,
                                    {
                                        checkExistingConsent: () => true,
                                    },
                                    id
                                );
                            },
                        });

                        cy.get('iframe').should('exist');
                    });
                });
            }

            describe('id-specific settings take priority over default settings', () => {
                it('onConsent', () => {
                    cy.visit(config.baseUrl, {
                        onBeforeLoad: (win: TestWindow) => {
                            win.executed = false;
                            applyGlobalConfig(
                                win,
                                {
                                    onConsent: () => {
                                        win.executed = true;
                                    },
                                },
                                pfIFrameId
                            );

                            applyGlobalConfig(
                                win,
                                {
                                    onConsent: () => {
                                        win.executed = false;
                                    },
                                }
                            );
                        },
                    });

                    cy.window().its('executed').should('be.false');
                    cy.get('button').click();
                    cy.window().its('executed').should('be.true');
                });

                it('generateConsentTemplate', () => {
                    const newHtml = 'This is the new text.';
                    cy.visit(config.baseUrl, {
                        onBeforeLoad: (win: TestWindow) => {
                            applyGlobalConfig(
                                win,
                                {
                                    generateConsentTemplate: () => newHtml,
                                },
                                pfIFrameId
                            );

                            applyGlobalConfig(
                                win,
                                {
                                    generateConsentTemplate: () => 'Default applied.',
                                }
                            );
                        },
                    });

                    cy.get('pf-iframe').invoke('html').should('equal', newHtml);
                });

                it('fetchConsentElement', () => {
                    cy.visit(config.baseUrl, {
                        onBeforeLoad: (win: TestWindow) => {
                            applyGlobalConfig(
                                win,
                                {
                                    fetchConsentElement: (self) => self.querySelector('p'),
                                },
                                pfIFrameId
                            );

                            applyGlobalConfig(
                                win,
                                {
                                    fetchConsentElement: (self) => self.querySelector('button'),
                                }
                            );
                        },
                    });

                    cy.get('iframe').should('not.exist');
                    cy.get('button').click();
                    cy.get('iframe').should('not.exist');
                    cy.get('p').click();
                    cy.get('iframe').should('exist');
                });

                it('checkExistingConsent', () => {
                    cy.visit(config.baseUrl, {
                        onBeforeLoad: (win: TestWindow) => {
                            applyGlobalConfig(
                                win,
                                {
                                    checkExistingConsent: () => true,
                                },
                                pfIFrameId
                            );

                            applyGlobalConfig(
                                win,
                                {
                                    checkExistingConsent: () => false,
                                }
                            );
                        },
                    });

                    cy.get('iframe').should('exist');
                });
            });

        });
    });
}
