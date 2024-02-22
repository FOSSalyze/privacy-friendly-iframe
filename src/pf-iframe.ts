// Maps attributes from the PrivacyFriendlyIFrame to the iFrame element
// Usually it remains 1:1
const attributeMap = new Map<string, string>([
    ['width', 'width'],
    ['height', 'height'],
    ['src', 'src'],
    ['allowfullscreen', 'allowfullscreen'],
    ['title', 'title'],
    ['frameborder', 'frameborder'],
    ['allow', 'allow'],
    ['iframe-id', 'id'],
]);

const observedAttributes = Array.from(Object.keys(attributeMap));

class PrivacyFriendlyIFrame extends HTMLElement {
    iFrameElement = document.createElement('iframe') as HTMLIFrameElement;
    private _mounted = false;
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div style="width: ${this.getAttribute('width')}px; height: ${this.getAttribute('height')}px"><p>Do you want to view this content? It will transmit data to ${this.getAttribute('src')}.<p><button>Yes</button></div>`
        this.querySelector('button')?.addEventListener('click', () => {
            this.accept();
        })
    }

    accept() {
        this.innerHTML = '';
        this.mountIFrame();
    }

    private mountIFrame() {
        if (!this._mounted) {
            this._mounted = true;
            for (const singleAttribute of Object.values(this.attributes)) {
                const mappedAttributeName = attributeMap.get(singleAttribute.name);
                if (mappedAttributeName != null) {
                    this.iFrameElement.setAttribute(mappedAttributeName, singleAttribute.value);
                }
            }
            this.appendChild(this.iFrameElement);
        } else {
            throw new Error('IFrame attempted to be mounted twice.');
        }
    }

    static observedAttributes: string[] = observedAttributes;

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {
        const mappedAttributeName = attributeMap.get(attributeName);
        if (mappedAttributeName != null) {
            this.iFrameElement.setAttribute(mappedAttributeName, newValue);
        }
    }
}

customElements.define('pf-iframe', PrivacyFriendlyIFrame);
