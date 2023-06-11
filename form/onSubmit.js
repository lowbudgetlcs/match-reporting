function onSubmit() {
  const POST_URL = "https://us-central1-lblcs-389419.cloudfunctions.net/test-function";
  // Fetch the latest response
  const form = FormApp.getActiveForm();
  const allResponses = form.getResponses();
  const latestResponse = allResponses[allResponses.length - 1];
  const response = latestResponse.getItemResponses();
  // Put data into response array
  response.forEach((item, idx) => {
    response[idx] = item.getResponse();
  });
  const body = {
    "data": msg
  };
  // POST data to message builder
  const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(body)
  };
  UrlFetchApp.fetch(POST_URL, options);
}
