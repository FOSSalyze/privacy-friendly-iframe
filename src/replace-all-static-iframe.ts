// Copyright (c) 2024 FOSSalyze GmbH
// Copyright (c) 2024 Timothy Gillespie
// SPDX-License-Identifier: MIT


// This approach will replace all iframes with a custom element pf-iframe when the page is loaded
// This has similar issues if not the same issues as the dynamic replacement, but has also always worked in the test page
// Best approach is to modify the source code of the website or have server performe the replacement
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
