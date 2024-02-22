"use strict";
// Maps attributes from the PrivacyFriendlyIFrame to the iFrame element
// Usually it remains 1:1
const attributeMap = new Map([
    ['width', 'width'],
    ['height', 'height'],
    ['src', 'src'],
    ['allowfullscreen', 'allowfullscreen'],
    ['title', 'title'],
    ['frameborder', 'frameborder'],
    ['allow', 'allow'],
    ['iframe-id', 'id'],
    ['iframe-class', 'class']
]);
const observedAttributes = Array.from(Object.keys(attributeMap));
class PrivacyFriendlyIFrame extends HTMLElement {
    constructor() {
        super();
        this.iFrameElement = document.createElement('iframe');
        this._mounted = false;
    }
    connectedCallback() {
        var _a;
        this.innerHTML = `<div style="width: ${this.getAttribute('width')}px; height: ${this.getAttribute('height')}px"><p>Do you want to view this content? It will transmit data to ${this.getAttribute('src')}.<p><button>Yes</button></div>`;
        (_a = this.querySelector('button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            this.accept();
        });
    }
    accept() {
        this.innerHTML = '';
        this.mountIFrame();
    }
    mountIFrame() {
        if (!this._mounted) {
            this._mounted = true;
            for (const singleAttribute of Object.values(this.attributes)) {
                const mappedAttributeName = attributeMap.get(singleAttribute.name);
                if (mappedAttributeName != null) {
                    this.iFrameElement.setAttribute(mappedAttributeName, singleAttribute.value);
                }
            }
            this.appendChild(this.iFrameElement);
        }
        else {
            throw new Error('IFrame attempted to be mounted twice.');
        }
    }
    attributeChangedCallback(attributeName, oldValue, newValue) {
        const mappedAttributeName = attributeMap.get(attributeName);
        if (mappedAttributeName != null) {
            this.iFrameElement.setAttribute(mappedAttributeName, newValue);
        }
    }
}
PrivacyFriendlyIFrame.observedAttributes = observedAttributes;
customElements.define('pf-iframe', PrivacyFriendlyIFrame);
