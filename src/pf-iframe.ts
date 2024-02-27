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
    ['srcdoc', 'srcdoc'],
    ['allow', 'allow'],
    ['allowfullscreen', 'allowfullscreen'],
    ['allowpaymentrequest', 'allowpaymentrequest'],
    ['title', 'title'],
    ['frameborder', 'frameborder'],
    ['sandbox', 'sandbox'],
    ['referrerpolicy', 'referrerpolicy'],
    ['loading', 'loading'],
    
    // Not 1:1 mappings
    ['iframe-id', 'id'],
    ['iframe-class', 'class'],
    ['iframe-name', 'name'],
]);

const observedAttributes = [
    'id', 
    'showiframe', 
    ...Array.from(attributeMap.keys())];

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

const isAttributeTrue = (attribute: string | null) => attribute === '' || attribute === 'true';

class PrivacyFriendlyIFrame extends HTMLElement {
    iFrameElement = document.createElement('iframe') as HTMLIFrameElement;
    get showIFrame(): boolean {
        return isAttributeTrue(this.getAttribute('showiframe'));
    }

    set showIFrame(value: boolean) {
        if (value) {
            this.setAttribute('showiframe', '');
        } else {
            this.removeAttribute('showiframe');
        }
    }
    
    constructor() {
        super();
    }

    private config = getConfig(this.getAttribute('id'));

    generateConsentTemplate = this.config.generateConsentTemplate
    fetchConsentElement = this.config.fetchConsentElement;
    checkExistingConsent = this.config.checkExistingConsent;
    onConsent = this.config?.onConsent;

    connectedCallback() {
        if(this.checkExistingConsent(this)) {
            this.showIFrame = true;
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

    accept = () => {this.showIFrame = true};

    private mountIFrame() {
        this.innerHTML = '';
        for (const singleAttribute of Object.values(this.attributes)) {
            const mappedAttributeName = attributeMap.get(singleAttribute.name);
            if (mappedAttributeName != null) {
                this.iFrameElement.setAttribute(mappedAttributeName, singleAttribute.value);
            }
        }
        this.appendChild(this.iFrameElement);
    }

    private unmountIFrame() {
        this.innerHTML = this.generateConsentTemplate(this.getAttribute('width') ?? '300', this.getAttribute('height') ?? '150', this.getAttribute('src') ?? 'ERROR', this);
    }

    static observedAttributes: string[] = observedAttributes;

    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null) {
        if(attributeName === 'id') {
            this.reloadConfig();
        }

        if(attributeName === 'showiframe') {
            if(isAttributeTrue(newValue) !== isAttributeTrue(oldValue)) {
                if(isAttributeTrue(newValue)) {
                    this.mountIFrame();
                } else {
                    this.unmountIFrame();
                }
            }
        }

        const mappedAttributeName = attributeMap.get(attributeName);
        if (mappedAttributeName != null) {
            if(newValue == null) {
                this.iFrameElement.removeAttribute(mappedAttributeName);
            } else {
                this.iFrameElement.setAttribute(mappedAttributeName, newValue);
            }
        }
    }

    reloadConfig() {
        this.config = getConfig(this.getAttribute('id'));
        this.generateConsentTemplate = this.config.generateConsentTemplate;
        this.fetchConsentElement = this.config.fetchConsentElement;
        this.checkExistingConsent = this.config.checkExistingConsent;
        this.onConsent = this.config?.onConsent;
    }
}

customElements.define('pf-iframe', PrivacyFriendlyIFrame);
