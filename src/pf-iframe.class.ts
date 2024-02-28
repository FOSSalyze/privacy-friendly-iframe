import { attributeMap, observedAttributes, fallbackDefaultConfig, isAttributeTrue } from './configuration';
import { PFIFrameConfig } from "./types";

const getConfig: (id?: string | null) => Required<PFIFrameConfig> = (id?: string | null) => {
    if (id != null && window._pfiFrameConfig?.byId != null) {
        return {...fallbackDefaultConfig, ...(window._pfiFrameConfig?.default ?? {}), ...(window._pfiFrameConfig?.byId[id] ?? {})};
    }
    return {...fallbackDefaultConfig, ...(window._pfiFrameConfig?.default ?? {})};
};

export class PrivacyFriendlyIFrame extends HTMLElement {
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
                this.onConsent(this); 
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