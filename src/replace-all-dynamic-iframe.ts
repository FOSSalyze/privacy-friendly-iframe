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