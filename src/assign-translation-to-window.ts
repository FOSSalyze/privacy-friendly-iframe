// Copyright (c) 2024 FOSSalyze GmbH
// Copyright (c) 2024 Timothy Gillespie
// SPDX-License-Identifier: MIT

import { PFIFrameTranslation } from "./types";

export const assignTranslationToWindow = (translation: PFIFrameTranslation) => {
    window._pfiFrameConfig = {
        ...window._pfiFrameConfig,
        translation
    }
}