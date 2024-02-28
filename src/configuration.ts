import { PFIFrameConfig } from "./types";

// Maps attributes from the PrivacyFriendlyIFrame to the iFrame element
// Usually it remains 1:1, but there are some exceptions
export const attributeMap = new Map<string, string>([
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

export const observedAttributes = [
    'id', 
    'showiframe', 
    ...Array.from(attributeMap.keys())
];

export const fallbackDefaultConfig: Required<PFIFrameConfig> = {
    onConsent: (self) => {},
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

export const isAttributeTrue = (attribute: string | null) => attribute === '' || attribute === 'true';
