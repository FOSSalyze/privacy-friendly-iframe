// Copyright (c) 2024 FOSSalyze GmbH
// Copyright (c) 2024 Timothy Gillespie
// SPDX-License-Identifier: MIT


export interface PFIFrameConfig {
    onConsent?: (self: HTMLElement) => any;
    generateConsentTemplate?: (width: string, height: string, src: string, self: HTMLElement) => string;
    fetchConsentElement?: (self: HTMLElement) => HTMLElement | null;
    checkExistingConsent?: (self: HTMLElement) => boolean;
}

export interface PFIFrameTranslation {
    consentPromptMessage: string;
    consentButtonLabel: string;
}

declare global {
    interface Window {
        _pfiFrameConfig?: {
            default?: PFIFrameConfig;
            byId?: {
                [id: string]: PFIFrameConfig;
            };
            translation?: PFIFrameTranslation;
        };
    }
}
