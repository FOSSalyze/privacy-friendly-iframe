import { PFIFrameTranslation } from "./types";

export const assignTranslationToWindow = (translation: PFIFrameTranslation) => {
    window._pfiFrameConfig = {
        ...window._pfiFrameConfig,
        translation
    }
}