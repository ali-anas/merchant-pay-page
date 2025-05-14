const defaultClientId = "SWIGGY8_123";
const defaultClientCred = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCJVrpuLL8drSOGo5N3s89e8gwakggT1S9BaAtZQgDaE3h1szlWIGvLNuNN1UwoiZK7u37wgHbOJj21xAX5eOZ4iHCbXmoTiWmCLVys9Kw21MeZYV5Rx2tDtIsSZdb7nop7cD48H1GkbIy3OGqGXEUgWjYiAI7pvuhu8ukAWPHy005yLfnZg84sOVb1cBRb31TK0JGSy9mTTKZ48A1c0CFnVLCIwlbTtRxDn1PmpowBXGjtOtSaWrF7WPwUzUowHioB7hJaGRdSpq24jXnIsTmjrC1cVNQYGhJYUrKV50klDqVBLU57t7l1kOcrpWftLIwf15ZMeShsk5Aveb/S6ndJAgMBAAECggEAIy9a99ry45F15oqFv0cLu5FbVHtRInOdda5IKgfk2/ndBJpz+AK6Wwem2EvrBP+p3fq9HLRsu4fEi4q61R0KPpsF7mgT2Ql9RGKGubC9ZhbBRCRT27OxYVkhwAbjOvd1Fwa8iv6jFfLRYidL8zw0YYN7Ft75vhyww6vr0bD323OzES4jYTOGtAvpcTJbry4N13RauizRIVNeCZRe9KTZRFedfazj0nCYc1IxwqeuqjVdzgIAsUwioXJqlyZF24+qTlF2Uws/dZEr0gIPNHNfW2MaaaygMJmUzT/bO2eYQBMvKu83OOvS69C1DWO+hNT/28jTcHmsmrFR6WszMIJL4QKBgQDFs6zh4DN1OciFhM9Tx+92mJBOYJQvb4YBOPs5QNPlW87RyrPhlNw+48QixeZ/fhyIHBD94hW9yhVXGFvKQKME098nsMMp2Qt6/8+g8l8E2DEtSoS8XKXkm3q/Ze5V2mF8uXnhqENIsvXB+56MZqnobvdnywSViOMjQihQyuhFZQKBgQCx1k1OQ43DtthqSosmGcAJiUdlOEMkHWzw3IIR94Rc1rlJPU21/sWrlBVMMacNy40W9Dwf6rmQOeyFhcbWirwpRDNgyfDM/HKmZjH7Qe1F3C8xw3UCF9Md3jG/mivxMVBQiW7m5IvVACY3e5RiFpKrPdcymkLCk7Qi94wYdlhOFQKBgQCBs12hFghMSKtfxQCLc2iLQo2xjbTJ5f1hAfP23KvnFbL6eWRHgvR3IdAEDBcq3x5ywQ74sIEY8OHNMMLPTlZkjWciT9nJs4XPnNGnQjrKH9crYm7wcEu5TbNaq9GPa2R3gesO+uehYx7Ns3iRnaysO1h+NHd+br6s2/M9BdEZ7QKBgE43CtkZLQifKp/VGU4wlR2cmyIRlLYVmwx0b2CnlDeg2O01YTBiVV4ZSySv0eFnXS5zTN5cxjCAyV4QcFt7uTYNIOu45YfCoEo/OExhupG3PaqNZLD++YNxbj/u9tSl88T4LSav7jBIWIaee6yIcQmPsU44OpSJkfivF5bKthvhAoGBAK3B11f9APwE1C9q4p+af23lSYPo8UL1EUwZ8jINS8uEmf4Rbe6/VXKxJoBLRDtL1GQQ05D2M7JnAUxIqBcQOlKzqtJkl/NwZA5oUYUVW6LsEx4WHaXF7uiw1IXw4YRytdo5gX45/oAG7FwCmAyZnNFSwPrHoGY6IcLUG26bVgoe";

export async function getOlympusToken(clientInfo) {
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


export async function createOrder(token) {
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
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(widget) {
          getOlympusToken()
          .then(response => {
            createOrder(response.token)
            .then(orderResponse => {
              console.log("order response: ", orderResponse);
              widget.pay({
                transactionToken: orderResponse.token,
                callback: (data) => {
                  console.log("data: ", data);
                  if(data.redirectUrl) {
                    window.location = data.redirectUrl;
                  }
                }
            })
            })
          })
          .catch(err => console.error("error fetching token: ", error))
        }
    })
};