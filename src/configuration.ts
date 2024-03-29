// Copyright (c) 2024 FOSSalyze GmbH
// Copyright (c) 2024 Timothy Gillespie
// SPDX-License-Identifier: MIT

import { PFIFrameConfig } from './types';

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

export const observedAttributes = ['id', 'showiframe', ...Array.from(attributeMap.keys())];

const defaultReplaceConsentTemplateVariables = (input: string, src: string): string => {
    let domain: string;
    try {
        domain = new URL(src).host
    } catch (e) {
        console.log('Could not get the host from the given src.');
        domain = 'ERROR';
    }

    return input.replace(/\$\{src\}/g, src).replace(/\$\{domain\}/g, domain);
};

const defaultGenerateConsentTemplate = (width: string, height: string, src: string, self: HTMLElement) => {
    const consentMessage = window._pfiFrameConfig?.translation?.consentPromptMessage ?? '';
    const consentButtenLabel = window._pfiFrameConfig?.translation?.consentButtonLabel ?? '';

    return `
    <div class="pf-iframe--consent-container" style="width: ${width}px; height: ${height}px">
        <div class="pf-iframe--consent-content-container">
            <p class="pf-iframe--consent-message">${defaultReplaceConsentTemplateVariables(consentMessage, src)}</p>
            <button class="pf-iframe--consent-button">${defaultReplaceConsentTemplateVariables(consentButtenLabel, src)}</button>
        </div>
    </div>`;
};

export const fallbackDefaultConfig: Required<PFIFrameConfig> = {
    onConsent: (self) => {},
    generateConsentTemplate: defaultGenerateConsentTemplate,
    fetchConsentElement: (self) => self.querySelector('button'),
    checkExistingConsent: (self) => false,
};

export const isAttributeTrue = (attribute: string | null) => attribute === '' || attribute === 'true';
