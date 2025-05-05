const fieldsOrder  = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardHolderName'];
  
  window.onload = () => {
      console.log("PARENT ORIGIN: ", window.location)
      // Access the global widget instance
      const widget = window.PhonepeWidget;
  
      // Now you can use the widget, for example, call a method or update its config
      if (widget) {
          widget.init({
              layoutConfig: {
                  formId: 'myForm',
                  iframeContainers: {
                    cardNumber: {
                      container: '.card_number',
                      attributes: {
                        placeholder: "Card Number",
                      }
                    },
                    cardHolderName: {
                      container: '#cardHolderName',
                      attributes: {
                        placeholder: "Enter name on card",
                      }
                    },
                    cardExpiry: {
                      container: '.card_expiry',
                      attributes: {
                        placeholder: "MM / YY",
                      }
                    },
                    cardCvv: { 
                      container: '.card_cvv',
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
                      "border-radius": '0px',
                      width: "100%",
                    },
                    // common styles
                  //   import fonts ...
                    ".cardNumber": {
                        "border-top-left-radius": "4px",
                        "border-top-right-radius": "4px",
                        width: "420px",
                    }, 
                    ".cardHolderName": {
                        "border-bottom-left-radius": "4px",
                        "border-bottom-right-radius": "4px",
                        "border-top": "0px",
                    },
                    ".cardExpiry": {
                        "border-top": "0px",
                        "border-right": "0px",
                    },
                    ".cardCvv": {
                        "border-top": "0px",
                    }, 
                    ":focus": {
                      border: '2px solid #2e90fa',
                    },
                  }
              },
              merchantDetailsConfig: {
                merchantId: "SWIGGY8",
              },
              callback: (data) => {
                  console.log("event data: ", data); 
                  const { currentElement, type: eventType, valid, message } = data.currentEventData;

  
                  // handle errors on blur event
                  if (eventType === 'blur') {
                    let error = "";
                    const fieldWithError = fieldsOrder.find(
                        field => data.cardFieldsState[field]?.message
                    );
                    
                    if (fieldWithError) {
                        error = data.cardFieldsState[fieldWithError].message;
                    }
                    if (error) {
                      const errorElement = document.getElementById("error");
                      errorElement.style.display = 'block';
                      errorElement.innerText = error;
                    }
                  } else {
                      const errorElement = document.getElementById("error");
                      errorElement.style.display = 'none';
                  }
               }
          });
      }
  
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const tokenEle = document.getElementById("authToken");
          if(widget) {
              widget.pay({
                  transactionToken: tokenEle.value.trim(),
                  callback: (data) => {
                    if(data.redirectUrl) {
                      window.location = data.redirectUrl;
                    }
                  }
              })
          }
      })
  };