export interface PFIFrameConfig {
    onConsent?: (self: HTMLElement) => any;
    generateConsentTemplate?: (width: string, height: string, src: string, self: HTMLElement) => string;
    fetchConsentElement?: (self: HTMLElement) => HTMLElement | null;
    checkExistingConsent?: (self: HTMLElement) => boolean;
}

export type TestWindow = {
    executed: boolean;
    caughtData: any;
    _pfiFrameConfig?: {
        default?: PFIFrameConfig;
        byId?: {
            [id: string]: PFIFrameConfig;
        };
    };
} & Cypress.AUTWindow;