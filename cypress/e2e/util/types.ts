import { PFIFrameConfig, PFIFrameTranslation } from '../../../src/types';
export type TestWindow = {
    executed: boolean;
    caughtData: any;
    _pfiFrameConfig?: {
        default?: PFIFrameConfig;
        byId?: {
            [id: string]: PFIFrameConfig;
        };
        translation?: PFIFrameTranslation;
    };
} & Cypress.AUTWindow;