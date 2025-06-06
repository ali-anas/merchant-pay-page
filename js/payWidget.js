const defaultClientId = "";
const defaultClientCred = "";

async function getOlympusToken(clientInfo) {
    const { clientId = defaultClientId, clientCred = defaultClientCred } = clientInfo || {};
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


async function createOrder(token) {
  const orderId = 'MO' + Date.now();

    const options = {
      "merchantOrderId": orderId,
      "amount": 1000,
      "metaInfo": {
          "udf1": "dummy1",
          "udf2": "dummy2",
          "udf3": "dummy3",
          "udf4": "dummy4"
      },
      "paymentFlow": {
          "type": "PG",
          "message": "Payment message",
          "merchantUrls": {
              "redirectUrl": `https://merchant-checkout-widget.netlify.app/html/status.html?orderId=${orderId}`
          }
      }
    }

    const response = await fetch("https://api-testing.phonepe.com/apis/b2b-pg/payments/v2/sdk/order", {
      method: "POST",
      headers: {
        Authorization: `O-Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options),
    })

    if(!response.ok) {
      const errorBody = response.json();
      const errorRes = {
        code: errorBody.code,
        message: errorBody.message,
      }
      throw new Error(
        `Failed to create order: ${response.status} ${response.statusText}`,
      );
    }
  
    const data = await response.json();
    console.log(" order data: ", data);
    return Promise.resolve({ ...data });
}

const errorMapFieldToId = {
  cardNumber: 'cardNumberError', 
  cardHolderName: 'cardHolderNameError',
  cardExpiry: 'cardExpiryError',
  cardCvv: 'cardCvvError'
};

window.onload = () => {
    // Access the global widget instance
    const widget = window.PhonepeWidget;

    // Now you can use the widget, for example, call a method or update its config
    if (widget) {
        widget.init({
            layoutConfig: {
                formId: 'myForm',
                iframeContainers: {
                  cardNumber: {
                    container: '#cardNumberDiv',
                    attributes: {
                      placeholder: "4111 1111 1111 1111",
                      // "aria-label": "Card Number",
                      "aria-required": false,
                    }
                  },
                  cardHolderName: {
                    container: '#cardHolderNameDiv',
                    attributes: {
                      placeholder: "Name on Card",
                      // "aria-label": "Card Holder Name",
                    }
                  },
                  cardExpiry: {
                    container: '#cardExpiryDiv',
                    attributes: {
                      placeholder: "MM / YY",
                      // "aria-label": "Card Expiry Date",
                    }
                  },
                  cardCvv: { 
                    container: '#cardCvvDiv',
                    attributes: {
                      placeholder: "CVV",
                    }
                  }
                },
                styles: {
                  "input": {
                    outline: 'none',
                    border: '1px solid black',
                    padding: '8px 16px',
                    "border-radius": '4px',
                    "max-width": "320px",
                    position: "relative",
                  },
                  // common styles
                //   import fonts ...
                  ".cardNumber": {
                    width: "450px",
                  }, 
                  ".cardHolderName": {
                  },
                  ".cardExpiry": {
                  },
                  ".cardCvv": {
                  }, 
                  ":focus": {
                    border: '2px solid #2e90fa',
                  },
                  ".isInvalid": {
                    border: "1px solid red",
                  }
                }
            },
            callback: (data) => {
                console.log("event data: ", data); 
                const { currentElement, type: eventType, valid, message } = data?.currentEventData || {};

                // handle errors on blur event
                if (eventType === 'blur') {
                  const fieldHasError = !valid && message;
                  if (fieldHasError) {
                    const errorElement = document.getElementById(errorMapFieldToId[currentElement]);
                    errorElement.style.display = 'block';
                    errorElement.innerText = message;
                  }
                } else {
                    const errorElement = document.getElementById(errorMapFieldToId[currentElement]);
                    errorElement.style.display = 'none';
                }
             }
        });
    }

    const submitBtn = document.getElementById("submitBtn");
    const tokenElement = document.getElementById("authToken");
    const apiErrorElement = document.getElementById("payApiError");
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(widget) {
          apiErrorElement.style.display = 'none';
          widget.pay({
            transactionToken: tokenElement.value.trim(),
            callback: (data) => {
              const parsedData =  typeof data === "string" ? JSON.parse(data) : data;
              if(parsedData.redirectUrl) {
                window.location = data.redirectUrl;
              } else if (parsedData.code && parsedData.code >= 400) {
                  apiErrorElement.style.display = 'block';
                  apiErrorElement.innerText = parsedData.message;
              }
            }
        })
          // getOlympusToken()
          // .then(response => {
          //   createOrder(response.token)
          //   .then(orderResponse => {
          //     console.log("order response: ", orderResponse);
          //     widget.pay({
          //       transactionToken: orderResponse.token,
          //       callback: (data) => {
          //         console.log("data: ", data);
          //         if(data.redirectUrl) {
          //           window.location = data.redirectUrl;
          //         }
          //       }
          //   })
          //   })
          // })
          // .catch(err => console.error("error fetching token: ", error))
        }
    })
};