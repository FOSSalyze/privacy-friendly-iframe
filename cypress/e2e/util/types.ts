export interface PFIFrameConfig {
    onConsent?: () => any;
    generateConsentTemplate?: (width: string, height: string, src: string, self: HTMLElement) => string;
    fetchConsentElement?: (self: HTMLElement) => HTMLElement | null;
    checkExistingConsent?: (self: HTMLElement) => boolean;
}

export type TestWindow = {
    executed: boolean;
    _pfiFrameConfig?: {
        default?: PFIFrameConfig;
        byId?: {
            [id: string]: PFIFrameConfig;
        };
    };
} & Cypress.AUTWindow;