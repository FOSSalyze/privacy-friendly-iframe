// Maps attributes from the PrivacyFriendlyIFrame to the iFrame element
// Usually it remains 1:1
interface PFIFrameConfig {
    onConsent?: () => any;
    generateConsentTemplate?: (width: string, height: string, src: string, self: HTMLElement) => string;
    fetchConsentElement?: (self: HTMLElement) => HTMLElement | null;
    checkExistingConsent?: (self: HTMLElement) => boolean;
}


interface Window {
    _pfiFrameConfig?: {
        default?: PFIFrameConfig;
        byId?: {
            [id: string]: PFIFrameConfig;
        };
    }
}

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

const fallbackDefaultConfig: Required<PFIFrameConfig> = {
    onConsent: () => {},
    generateConsentTemplate: (width: string, height: string, src: string, self: HTMLElement) => `
    <div class="pf-iframe--consent-container" style="width: ${width}px; height: ${height}px">
        <div class="pf-iframe--consent-content-container">
            <p class="pf-iframe--consent-message">Do you want to view this content? It will transmit data to ${src}.</p>
            <button class="pf-iframe--consent-button">Yes</button>
        </div>
    </div>`,
    fetchConsentElement: (self) => self.querySelector('button'),
    checkExistingConsent: (self) => false

}

const getConfig: (id?: string | null) => Required<PFIFrameConfig> = (id?: string | null) => {
    if (id != null && window._pfiFrameConfig?.byId != null) {
        return {...fallbackDefaultConfig, ...window._pfiFrameConfig?.default, ...(window._pfiFrameConfig?.byId[id] ?? {})};
    }
    return {...fallbackDefaultConfig, ...(window._pfiFrameConfig?.default ?? {})};
};

class PrivacyFriendlyIFrame extends HTMLElement {
    iFrameElement = document.createElement('iframe') as HTMLIFrameElement;
    private _mounted = false;
    constructor() {
        super();
    }

    config = getConfig(this.getAttribute('id'));

    // should default to 300x150 pixels when no size is specified per convention
    generateConsentTemplate = this.config.generateConsentTemplate

    fetchConsentElement = this.config.fetchConsentElement;
    checkExistingConsent = this.config.checkExistingConsent;
    onConsent = this.config?.onConsent;

    connectedCallback() {
        if(this.checkExistingConsent(this)) {
            this.mountIFrame();
        } else {
            const width = this.getAttribute('width') ?? '300';
            const height = this.getAttribute('height') ?? '150';
            const src = this.getAttribute('src') ?? 'ERROR';
            
            this.innerHTML = this.generateConsentTemplate(width, height, src, this); 
            this.fetchConsentElement(this)?.addEventListener('click', () => {
                this.onConsent(); 
                this.accept()
            });
        }
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
