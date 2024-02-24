const attributeMap = [
    {pfIFrameName: 'width', iFrameName: 'width', exampleValue: '1920'},
    {pfIFrameName: 'height', iFrameName: 'height', exampleValue: '1080'},
    {pfIFrameName: 'src', iFrameName: 'src', exampleValue: 'https://www.youtube.com/embed/BQqzfHQkREo?si=0WhPPSRLnUoNyo7c'},
    {pfIFrameName: 'allowfullscreen', iFrameName: 'allowfullscreen', exampleValue: 'false'},
    {pfIFrameName: 'title', iFrameName: 'title', exampleValue: 'This is a changed title'},
    {pfIFrameName: 'frameborder', iFrameName: 'frameborder', exampleValue: '2px'},
    {pfIFrameName: 'allow', iFrameName: 'allow', exampleValue: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'},
    
    // Not 1:1 mappings
    {pfIFrameName: 'iframe-id', iFrameName: 'id', exampleValue: 'inner-iframe-id'},
    {pfIFrameName: 'iframe-class', iFrameName: 'class', exampleValue: 'inner-iframe-class'}
];

describe('technical specification', () => {
    it('attributes are reached through', () => {
        cy.visit('/');

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
                cy.get('pf-iframe').invoke('attr', singleAttribute.pfIFrameName).then((pfIframeAttribute) => {
                    cy.get('iframe').invoke('attr', singleAttribute.iFrameName).then((iFrameAttribute) => {
                        expect(pfIframeAttribute).to.equal(iFrameAttribute);
                    });
                });
            });
        }
    });
});
