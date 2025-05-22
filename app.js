// Declare arcPay variable to hold the ArcPay SDK client instance
let arcPay;
const ARCPAY_NETWORK = 'algo:mainnet'; // or 'algo:testnet'

// Function to get the API key from the input field
function getApiKey() {
  const apiKeyInput = document.getElementById('arcpay-api-key');
  return apiKeyInput.value;
}

// Asynchronous function to initialize the ArcPay SDK client
async function initializeArcPay() {
  const apiKey = getApiKey();
  if (!apiKey) {
    alert('Please enter your ArcPay API Key.');
    console.error('ArcPay API Key is missing.');
    return false;
  }

  if (arcPay && arcPay.apiKey === apiKey) {
    console.log('ArcPay SDK already initialized with this API key.');
    return true;
  }

  try {
    arcPay = new arcpay.ArcPayClient({ apiKey, network: ARCPAY_NETWORK });
    console.log('ArcPay SDK initialized successfully.');
    // Attempt a benign read operation to confirm connectivity and key validity
    await arcPay.getAUCTIONINFO(); // Or any other simple read call
    console.log('ArcPay SDK connection confirmed.');
    return true;
  } catch (error) {
    console.error('Error initializing ArcPay SDK:', error);
    alert(`Error initializing ArcPay SDK: ${error.message || error}`);
    arcPay = null; // Reset arcPay instance if initialization failed
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const apiKeyInput = document.getElementById('arcpay-api-key');
  const connectWalletBtn = document.getElementById('connect-wallet-btn');
  const createListingBtn = document.getElementById('create-listing-btn');
  const viewListingsBtn = document.getElementById('view-listings-btn');
  const listingsContainer = document.getElementById('listings-container');

  // Event Listener for Connect Wallet Button
  connectWalletBtn.addEventListener('click', async () => {
    if (!arcPay) {
        const initialized = await initializeArcPay();
        if (!initialized) return;
    }
    try {
      const result = await arcPay.connect();
      console.log('Wallet connection result:', result);
      alert(`Wallet connected: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Error connecting wallet: ${error.message || error}`);
    }
  });

  // Event Listener for Create Listing Button
  createListingBtn.addEventListener('click', async () => {
    if (!arcPay) {
        const initialized = await initializeArcPay();
        if (!initialized) return;
    }
    try {
      const assetId = prompt('Enter Asset ID:');
      const price = prompt('Enter Price:');
      const currency = prompt('Enter Currency (e.g., ALGO, USDC):');

      if (assetId && price && currency) {
        const listingDetails = {
          assetId: parseInt(assetId, 10), // Ensure assetId is a number
          price: parseFloat(price),       // Ensure price is a number
          currency: currency.toUpperCase()
        };
        console.log('Creating listing with details:', listingDetails);
        const result = await arcPay.create(listingDetails);
        console.log('Create listing result:', result);
        alert(`Listing created: ${JSON.stringify(result)}`);
        // Optionally, refresh listings view
        viewListingsBtn.click();
      } else {
        alert('Asset ID, Price, and Currency are required to create a listing.');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(`Error creating listing: ${error.message || error}`);
    }
  });

  // Event Listener for View Listings Button
  viewListingsBtn.addEventListener('click', async () => {
    if (!arcPay) {
        const initialized = await initializeArcPay();
        if (!initialized) return;
    }
    try {
      const listings = await arcPay.getListings();
      console.log('Fetched listings:', listings);
      listingsContainer.innerHTML = ''; // Clear previous listings

      if (listings && listings.length > 0) {
        const ul = document.createElement('ul');
        listings.forEach(listing => {
          const li = document.createElement('li');
          li.innerHTML = `
            Asset ID: ${listing.assetId}, 
            Price: ${listing.price} ${listing.currency}, 
            Listing ID: ${listing.listingId}
            <button class="cancel-listing-btn" data-listing-id="${listing.listingId}">Cancel Listing</button>
          `;
          ul.appendChild(li);
        });
        listingsContainer.appendChild(ul);
      } else {
        listingsContainer.textContent = 'No active listings found.';
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      listingsContainer.textContent = `Error fetching listings: ${error.message || error}`;
    }
  });

  // Event Delegation for Cancel Listing Buttons
  listingsContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('cancel-listing-btn')) {
      if (!arcPay) {
        // It's unlikely arcPay wouldn't be initialized here if listings are visible,
        // but as a safeguard:
        const initialized = await initializeArcPay();
        if (!initialized) return;
      }
      
      const listingId = event.target.dataset.listingId;
      if (!listingId) {
        console.error('Listing ID not found on button.');
        alert('Error: Listing ID not found.');
        return;
      }

      // Confirm before cancelling
      if (!confirm(`Are you sure you want to cancel listing ID: ${listingId}?`)) {
        return;
      }

      try {
        console.log('Cancelling listing with ID:', listingId);
        const result = await arcPay.cancel({ listingId });
        console.log('Cancel listing result:', result);
        alert(`Listing ${listingId} cancelled: ${JSON.stringify(result)}`);
        // Refresh listings view
        viewListingsBtn.click();
      } catch (error) {
        console.error('Error cancelling listing:', error);
        alert(`Error cancelling listing ${listingId}: ${error.message || error}`);
      }
    }
  });

  // Initialize ArcPay when API key is entered or changed
  apiKeyInput.addEventListener('change', async () => {
    console.log('API key changed, re-initializing ArcPay SDK...');
    // Clear existing listings if API key changes
    listingsContainer.innerHTML = '';
    arcPay = null; // Reset arcPay instance to force re-initialization with new key
    await initializeArcPay();
  });
});
