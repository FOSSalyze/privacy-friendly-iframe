// Copyright (c) 2024 FOSSalyze GmbH
// Copyright (c) 2024 Timothy Gillespie
// SPDX-License-Identifier: MIT


import { assignTranslationToWindow } from "../assign-translation-to-window";

export const enTranslation = {
    consentPromptMessage: 'By continuing, you consent to a connection being established with ${src}. Upon agreement, you allow the display and use of additional content from external sources. This action will share specific data, including your IP address, browser details, and site interaction data with ${domain}. Note that this information might also be shared with other websites that the embedded site interacts with. Ensure you understand and consent to this data sharing before proceeding. Do you wish to continue?',
    consentButtonLabel: 'Yes, proceed and show me the embedded content'
};

assignTranslationToWindow(enTranslation);