declare const attributeMap: Map<string, string>;
declare const observedAttributes: string[];
declare class PrivacyFriendlyIFrame extends HTMLElement {
    iFrameElement: HTMLIFrameElement;
    private _mounted;
    constructor();
    connectedCallback(): void;
    accept(): void;
    private mountIFrame;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
}
