const defaultClientId = "SU2407261558245785595105";
const defaultClientCred = "e5ceadd4-d259-400e-a6b8-0de5a89f5674"

const loaderElement = document.getElementById("loader-animation");
const successAnimationElement = document.getElementById("success-animation");
const failureAnimationElement = document.getElementById("failure-animation");
const statusElement = document.getElementById("status-placeholder");

class OrderStatusFetcher {
    constructor(intervalSeconds = 5) {
      this.orderId = null;
      this.intervalInMilSec = intervalSeconds * 1000;
      this.intervalId = null;
      this.isRunning = false;
      this.token = null;
      this.intervalSeconds = intervalSeconds;
    }
  
    startPolling(token, orderId, callback) {
    console.log("starting polling with token: ", token , " orderId: ", orderId);
      this.token = token;
      this.orderId = orderId;
      if (this.isRunning) {
        console.log(`Polling for order ${this.orderId} is already running.`);
        return;
      }
  
      this.isRunning = true;
      console.log(`Starting polling for order ${this.orderId} every ${this.intervalSeconds} seconds...`);
  
      // Initial fetch
      this.fetchOrderStatus(callback);
  
      // Set up the interval for subsequent fetches
      this.intervalId = setInterval(() => {
        this.fetchOrderStatus(callback);
      }, this.intervalInMilSec);
    }
  
    stopPolling() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isRunning = false;
        console.log(`Polling for order ${this.orderId} stopped.`);
      } else {
        console.log(`Polling for order ${this.orderId} is not currently running.`);
      }
    }
  
    async fetchOrderStatus(callback) {
      try {
        const urlWithId = `https://api.phonepe.com/apis/pg/payments/v2/order/${this.orderId}/status`;
        console.log(`Fetching status for order ${this.orderId} from: ${urlWithId}`);
        console.log("token: ", this.token);
        const response = await fetch(urlWithId, {
            headers: {
                Authorization: `O-Bearer ${this.token}`,
            }
        });
  
        if (!response.ok) {
          console.error(`Error fetching order status for ${this.orderId}: ${response.status} - ${response.statusText}`);
          return;
        }
  
        const data = await response.json();
        console.log(`Order ${this.orderId} status:`, data);
        if (callback && typeof callback === 'function') {
          callback(data); // Call the provided callback with the fetched data
        }
      } catch (error) {
        console.error(`Error fetching order status for ${this.orderId}:`, error);
      }
    }
  }

const statusFetcher = new OrderStatusFetcher(5);

function handleOrderStatus(statusData) {
    document.getElementById('order-status-placeholder').textContent = `Status: ${statusData?.state ?? "Pending..."}`;
    // You can perform other actions based on the status here,
    // like updating the UI or stopping the polling if a final status is reached.
    if (statusData.state === 'FAILED' || statusData.state === 'COMPLETED') {
        statusFetcher.stopPolling();
        const animationEle = statusData.state === 'COMPLETED' ? successAnimationElement : failureAnimationElement;
        loaderElement.style.display = "none";
        animationEle.style.display = "block";
        console.log(`Order ${orderIdToTrack} reached final status: ${statusData.status}. Polling stopped.`);
    }
}
  

async function getOlympusToken(clientConfig) {
    const { clientId = defaultClientId, clientCred = defaultClientCred} = clientConfig || {};
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_version', '1');
  params.append('client_secret', clientCred);
  params.append('grant_type', 'client_credentials');
  // ?client_id=${clientId}&client_version=1&client_secret=${clientCred}&grant_type=client_credentials
  const response = await fetch(`https://api.phonepe.com/apis/identity-manager/v1/oauth/token`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString(),
  });

  if(!response.ok) {
    const errorBody = res.json();
    const errorRes = {
      code: errorBody.code,
      message: errorBody.message,
    }
    throw new Error(
      `Failed to fetch olympus token: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const { access_token: token } = data;
  return Promise.resolve({ token });
}

    getOlympusToken()
   .then(res => {
        document.getElementById('order-status-placeholder').textContent = `Status: Pending...`;
        // successAnimationElement.style.display = "block";
        const currentURL = window.location.href;

        // Create a URL object from the URL string
        const url = new URL(currentURL);

        // Access the search parameters using the .searchParams property
        const searchParams = url.searchParams;

        // Now you can work with the searchParams object to get individual parameters

        // Get the value of a specific parameter by its key
        const orderId = searchParams.get('orderId');
        if(!orderId) {
            window.alert("No order found!");
            return;
        }
    statusFetcher.startPolling(res.token, orderId, handleOrderStatus);
   })
    .catch(err => console.log("error fetching token: ", error));

