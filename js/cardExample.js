const fieldsOrder  = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardHolderName'];
  
  window.onload = () => {
      // Access the global widget instance
      console.log("widget loaded");
      const widget = window.PhonepeWidget;
      const submitBtn = document.getElementById("pay-btn");
      submitBtn.disabled = true;
  
      // Now you can use the widget, for example, call a method or update its config
      if (widget) {
          widget.init({
              layoutConfig: {
                  formId: 'card-form',
                  iframeContainers: {
                    cardNumber: {
                      container: '#card-number',
                      attributes: {
                        placeholder: "Enter Card Number",
                      }
                    },
                    cardHolderName: {
                      container: '#card-holder-name',
                      attributes: {
                        placeholder: "Enter name on card",
                      }
                    },
                    cardExpiry: {
                      container: '#card-expiry',
                      attributes: {
                        placeholder: "MM / YY",
                      }
                    },
                    cardCvv: { 
                      container: '#card-cvv',
                      attributes: {
                        placeholder: "CVV",
                      }
                    }
                  },
                  styles: {
                    "input": {
                      outline: 'none',
                      border: 'none',
                      width: "100%",
                      height: "2rem",
                      color: "white",
                      padding: "0",
                      "padding-bottom": "0.25rem",
                    },
                    // common styles
                    "font-family": `"Inter", sans-serif`,
                  //   import fonts ...
                    ".cardNumber": {
                        // height: "2.75rem",
                        "font-size": "2rem",
                    }, 
                    ".cardHolderName": {
                        "font-size": "1.25rem",
                    },
                    ".cardExpiry": {
                        "font-size": "1.25rem",
                    },
                    ".cardCvv": {
                        "font-size": "1.25rem",
                    }, 
                    ":focus": {
                        border: 'none',
                        "border-bottom": "1px solid #FFF5EE60"
                    },
                    "input::placeholder": {
                        color: "#FFF5EE60",
                    },
                    ".isInvalid": {
                      "border-bottom": "1px solid red",
                      color: "red"
                    }
                  }
              },
              merchantDetailsConfig: {
                merchantId: "SWIGGY8",
              },
              callback: (data) => {
                  console.log("event data: ", data); 
                  const { currentElement, type: eventType, valid, message } = data?.currentEventData || {};


                  if(eventType === "input") {
                    let isFormValid = true;
                    fieldsOrder.forEach(field => {
                      isFormValid = isFormValid && data.cardFieldsState[field]?.valid
                    })
                    if (isFormValid) {
                      submitBtn.disabled = false;
                    } else {
                      submitBtn.disabled = true;
                    }
                  }

  
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