const defaultClientId = "SWIGGY8_123";
const defaultClientCred = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCJVrpuLL8drSOGo5N3s89e8gwakggT1S9BaAtZQgDaE3h1szlWIGvLNuNN1UwoiZK7u37wgHbOJj21xAX5eOZ4iHCbXmoTiWmCLVys9Kw21MeZYV5Rx2tDtIsSZdb7nop7cD48H1GkbIy3OGqGXEUgWjYiAI7pvuhu8ukAWPHy005yLfnZg84sOVb1cBRb31TK0JGSy9mTTKZ48A1c0CFnVLCIwlbTtRxDn1PmpowBXGjtOtSaWrF7WPwUzUowHioB7hJaGRdSpq24jXnIsTmjrC1cVNQYGhJYUrKV50klDqVBLU57t7l1kOcrpWftLIwf15ZMeShsk5Aveb/S6ndJAgMBAAECggEAIy9a99ry45F15oqFv0cLu5FbVHtRInOdda5IKgfk2/ndBJpz+AK6Wwem2EvrBP+p3fq9HLRsu4fEi4q61R0KPpsF7mgT2Ql9RGKGubC9ZhbBRCRT27OxYVkhwAbjOvd1Fwa8iv6jFfLRYidL8zw0YYN7Ft75vhyww6vr0bD323OzES4jYTOGtAvpcTJbry4N13RauizRIVNeCZRe9KTZRFedfazj0nCYc1IxwqeuqjVdzgIAsUwioXJqlyZF24+qTlF2Uws/dZEr0gIPNHNfW2MaaaygMJmUzT/bO2eYQBMvKu83OOvS69C1DWO+hNT/28jTcHmsmrFR6WszMIJL4QKBgQDFs6zh4DN1OciFhM9Tx+92mJBOYJQvb4YBOPs5QNPlW87RyrPhlNw+48QixeZ/fhyIHBD94hW9yhVXGFvKQKME098nsMMp2Qt6/8+g8l8E2DEtSoS8XKXkm3q/Ze5V2mF8uXnhqENIsvXB+56MZqnobvdnywSViOMjQihQyuhFZQKBgQCx1k1OQ43DtthqSosmGcAJiUdlOEMkHWzw3IIR94Rc1rlJPU21/sWrlBVMMacNy40W9Dwf6rmQOeyFhcbWirwpRDNgyfDM/HKmZjH7Qe1F3C8xw3UCF9Md3jG/mivxMVBQiW7m5IvVACY3e5RiFpKrPdcymkLCk7Qi94wYdlhOFQKBgQCBs12hFghMSKtfxQCLc2iLQo2xjbTJ5f1hAfP23KvnFbL6eWRHgvR3IdAEDBcq3x5ywQ74sIEY8OHNMMLPTlZkjWciT9nJs4XPnNGnQjrKH9crYm7wcEu5TbNaq9GPa2R3gesO+uehYx7Ns3iRnaysO1h+NHd+br6s2/M9BdEZ7QKBgE43CtkZLQifKp/VGU4wlR2cmyIRlLYVmwx0b2CnlDeg2O01YTBiVV4ZSySv0eFnXS5zTN5cxjCAyV4QcFt7uTYNIOu45YfCoEo/OExhupG3PaqNZLD++YNxbj/u9tSl88T4LSav7jBIWIaee6yIcQmPsU44OpSJkfivF5bKthvhAoGBAK3B11f9APwE1C9q4p+af23lSYPo8UL1EUwZ8jINS8uEmf4Rbe6/VXKxJoBLRDtL1GQQ05D2M7JnAUxIqBcQOlKzqtJkl/NwZA5oUYUVW6LsEx4WHaXF7uiw1IXw4YRytdo5gX45/oAG7FwCmAyZnNFSwPrHoGY6IcLUG26bVgoe"

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
        const urlWithId = `https://api-testing.phonepe.com/apis/b2b-pg/payments/v2/order/${this.orderId}/status`;
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
  const response = await fetch(`https://api-testing.phonepe.com/apis/identity-manager/v1/oauth/token`, {
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

