# Privacy Friendly iFrame

The `<iframe>` tag will transmit user data (by making a request on behalf of the user) to the website specified in the src and potentially more websites as they are loaded by the iframed-website. If the user has not accepted this transfer of data you are most likely violating the General Data Protection Regulation (GDPR).

This project provides a near drop-in replacement for the iframe tag as a webcomponent. All that needs to be done is to:

1. Load the JavaScript to register the custom element
2. Replace all `<iframe>` tags (opening and closing) with `<pf-iframe>` tags

By default, the user will be asked and informed about the transfer of information before it occurs. However, you can also customize the appearance and behavior accordingly.

## Example Usage

This will be added in the future.

## Customization

This will be added in the future.

## Using Other Consent Sources

This will be added in the future.

## Limitation of Drop-In Replaceability

This will be added in the future.