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
    
    // Not 1:1 mappings
    ['iframe-id', 'id'],
    ['iframe-class', 'class']
]);

const observedAttributes = Array.from(Object.keys(attributeMap));

class PrivacyFriendlyIFrame extends HTMLElement {
    iFrameElement = document.createElement('iframe') as HTMLIFrameElement;
    private _mounted = false;
    constructor() {
        super();
    }

    generateConsentTemplate = (width: string | null, height: string | null) => `
    <div class="pf-iframe--consent-container" style="width: ${width ?? '300'}px; height: ${height ?? '150'}px">
        <div class="pf-iframe--consent-content-container">
            <p class="pf-iframe--consent-message">Do you want to view this content? It will transmit data to ${this.getAttribute('src')}.</p>
            <button class="pf-iframe--consent-button">Yes</button>
        </div>
    </div>`;

    onConsent = (listener: () => any) => this.querySelector('button')?.addEventListener('click', listener);
    
    connectedCallback() {
        // should default to 300x150 pixels when no size is specified per convention
        this.innerHTML = this.generateConsentTemplate(this.getAttribute('width'), this.getAttribute('height')); 
        this.onConsent(this.accept.bind(this));
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
