import { createOrder, getOlympusToken } from "./apiHelpers";

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