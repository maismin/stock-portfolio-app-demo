const catchErrors = (error, displayError) => {
  let errorMsg;
  if (error.response) {
    /* The request was made and server responsed with a status 
       code that is not in the range of 2XX */
    errorMsg = error.response.data.error;
    // console.error('Error response', errorMsg);
  } else if (error.request) {
    /* The request was made, but no response was received */
    errorMsg = error.request;
    // console.error('Error request', errorMsg);
  } else {
    /* Something else happened in making the request that triggered 
       an error */
    errorMsg = error.message;
    // console.error('Error message', errorMsg);
  }
  displayError(errorMsg);
};

export default catchErrors;
