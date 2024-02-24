// This approach will replace all iframes with a custom element pf-iframe when they are being injected by JS or any other source of modification
// This is not reliable, because the initial iframe is injected and then quickly replaced by the custom element
// This will abort the connection the iframe would make, it's better than nothing - but does not guarantee no data being transferred
// However, when used in the test page it will usually work and prevent any data from being transferred
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node as HTMLElement).tagName.toLowerCase() === 'iframe') {
                const iFrame = node as HTMLIFrameElement;
                // Prevent recursive case
                if((iFrame.parentNode as HTMLElement).tagName.toLowerCase() !== 'pf-iframe') {
                    const pfIframe = document.createElement('pf-iframe');
                    Array.from(iFrame.attributes).forEach(attr => {
                        pfIframe.setAttribute(attr.name, attr.value);
                    });
                    node.parentNode!.replaceChild(pfIframe, node);
                }
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });