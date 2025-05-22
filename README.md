# ArcPay SDK Demo

This repository contains a simple demonstration of the ArcPay SDK. It allows users to connect their Algorand wallet, provide an ArcPay API Key, create listings, view their current listings, and take down their listings directly from the browser.

## Features

*   Connect to an Algorand wallet (handled by ArcPay SDK modals).
*   Input your ArcPay API Key directly in the frontend.
*   Create a new asset listing (e.g., for an NFT).
*   View all active listings associated with your API Key.
*   Cancel/take down an active listing.

## Files

*   `index.html`: The main HTML file for the demo page.
*   `app.js`: Contains all the JavaScript logic for interacting with the ArcPay SDK and managing the demo page.
*   `README.md`: This file.

## Prerequisites

*   A modern web browser with a compatible Algorand wallet extension/app (e.g., Pera Wallet). The ArcPay SDK will guide you through wallet interactions.
*   An ArcPay API Key. You can obtain one from the [ArcPay Dashboard](https://app.arcpay.dev/).
    *   When generating your API Key, ensure you set the "Allowed Origin" correctly.
    *   If you are testing locally (e.g., by opening `index.html` directly in your browser or using a simple local server), you might need to add origins like `http://localhost:PORT`, `http://127.0.0.1:PORT`, or even `null` (for `file:///` origins, though this is less secure and might not be supported by all APIs for all operations).
    *   If deploying to a service like GitHub Pages, the origin will be `https://your-username.github.io`.
*   Some test assets (NFTs) in your wallet if you want to create listings for specific asset IDs. Otherwise, the SDK can prompt you to select an asset from your wallet during the creation process.

## How to Use

1.  **Clone or Download:** Get the `index.html` and `app.js` files onto your local system.
2.  **Open `index.html`:** Open the `index.html` file in your web browser.
3.  **Enter API Key:**
    *   In the "ArcPay API Key:" input field, paste your API Key from the ArcPay Dashboard.
    *   The SDK will attempt to initialize (or re-initialize if you change the key). Check your browser's developer console for any messages regarding successful initialization or errors (especially "Unauthorized" or CORS errors if the API key or allowed origin is incorrect).
4.  **Connect Wallet:** Click the "Connect Wallet" button. The ArcPay SDK will prompt you to choose and connect your Algorand wallet.
5.  **Create Listing:**
    *   Click the "Create Listing" button.
    *   You'll be prompted to enter the Asset ID, Price, and Currency for the listing.
    *   The ArcPay SDK will guide you through the necessary transaction signing.
6.  **View Listings:**
    *   Click the "View Listings" button to see all active listings under your API Key.
    *   Each listing will show its details and a "Cancel Listing" button.
7.  **Cancel Listing:**
    *   In the listings view, click the "Cancel Listing" button next to any listing you wish to remove.
    *   The SDK will handle the cancellation process. The list will refresh automatically.

## How it Works

*   The `index.html` page includes the ArcPay SDK from a CDN (`unpkg.com`).
*   `app.js` initializes the SDK with the API key you provide and the network (defaulted to `algo:mainnet`).
*   SDK methods (`createClient`, `connect`, `create`, `getListings`, `cancel`) are called to interact with the ArcPay platform.
*   The ArcPay SDK handles wallet communication, transaction signing, and displays user-facing modals.

## Disclaimer

This is a simple demo for educational and testing purposes. Ensure your API keys are handled securely and configured with the correct allowed origins. Do not use production API keys for public-facing client-side demos where the key might be exposed if not handled carefully. For this demo, the API key is entered by the user and used directly in the client-side JavaScript.
