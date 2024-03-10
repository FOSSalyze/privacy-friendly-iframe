import { assignTranslationToWindow } from "../assign-translation-to-window";

export const deTranslation = {
    consentPromptMessage: 'Indem Sie fortfahren, stimmen Sie einer Verbindung mit ${src} zu. Bei Zustimmung erlauben Sie die Anzeige und Nutzung zusätzlicher Inhalte von externen Quellen. Diese Aktion wird spezifische Daten teilen, einschließlich Ihrer IP-Adresse, Browserdetails und Interaktionsdaten mit ${domain}. Beachten Sie, dass diese Informationen möglicherweise auch mit anderen Websites geteilt werden, mit denen die eingebettete Site interagiert. Stellen Sie sicher, dass Sie diesem Datenaustausch zustimmen, bevor Sie fortfahren. Möchten Sie fortfahren?',
    consentButtonLabel: 'Ja, forfahren und mir die eingebetteten Inhalte anzeigen'
};

assignTranslationToWindow(deTranslation);