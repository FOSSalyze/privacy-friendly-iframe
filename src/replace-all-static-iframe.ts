document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('iframe').forEach((iFrame) => {
        const pfIframe = document.createElement('pf-iframe');
        if ((iFrame.parentNode as HTMLElement).tagName.toLowerCase() !== 'pf-iframe') {
            Array.from(iFrame.attributes).forEach((attr) => {
                pfIframe.setAttribute(attr.name, attr.value);
            });
            iFrame.parentNode!.replaceChild(pfIframe, iFrame);
        }
    });
});
