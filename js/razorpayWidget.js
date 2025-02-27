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
                  showCardBrandIcon: false, // default value is true
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
              customerConfig: {
                cardEncryptionKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmj6Bri6mSOKz0gH7n+X4K5Thi9Jpqr71Kk1flA+V4+q0JxuMbNJRh9TR+6JMZiLCwyMerktUPPc7DCre48Ja9g3IUDSMpUZx1OATw00sNOazGzf/72xRS4vpEMhCMXJl31SR/nmbCS0p0qj1WR8ZKyh4QUOEkh/0OCqy6rqxjq1lJE/Heiz9O9Rk70WqsyU5gb7M5Xeng7ZlTT3OpPqgpzs6kue7azLjE3Rq3e178coib9Jo9eOsRX+LrAkaaY0bD05ur/08QTnEujFjbrc7rd4mZAU27QedkEAnLsPbBe9RikRtZSWfOCEGOMzAj5/vz40Xl4gg/MiFIv6cn4IBYFTYYL08h83wyX0BlSAisKRc9e1gea64EGBz/BBWh1f92IFbqRaxyFL5K5fAOhhkT0CehfozIm8XQz6tlgayxqLNSIStLnJtzGhpoWzsYF/uN0BMjPaPxif+sWXZm7en92kWVz2WBFo5uSGTnFM1iJrzpiVC9LUwD5EbQSjxFcYOxAgccHi60FVoGDpdNSJWIb76TBeFclQ1C9gDmEj8RUgxCHqaPJDls5HES2FygS8uB0zUHNdhnmuK0uyv8JbG7H8ZJmIsPXNTRW+u5IOmaskofcOEY8LOZERhhXXsZh4WEKOtL0/zBGfi3uSIl/CpwrNdChqnIsfFLfo9qT1jcB8CAwEAAQ==',
                cardEncryptionKeyId: 129,
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
                  redirectUrl: 'https://www.phonepe.com/',
                  callback: (data) => {
                    if(data.redirectUrl) {
                      window.location = data.redirectUrl;
                    }
                  }
              })
          }
      })
  };