//Starting point of program
setPrintOutputLocation("titleTable","resultsTable");

var selectedModel = getCookie("selectedModel");
if(selectedModel == "" || selectedModel == undefined || selectedModel == null){
  window.location.href = "../Pages/modelSelection.html";
}

numberSlotsInQueue = getCookie("queue-size");
if(selectedModel == "workstations"){
  numberSlotsInQueue = getCookie("workstation-count");
  if(numberSlotsInQueue < 4) numberSlotsInQueue = 4;
}
QueueVisual.width = queueSlotSize * numberSlotsInQueue;
function getCookie(key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for(var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
}
function getFloatCookie(key){
  var name = key + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  for(var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return parseFloat(cookie.substring(name.length, cookie.length));
    }
  }
  return "";

}
function getDistribution(componentName, distributionType){
  var parameters = {};
  switch(distributionType){
    case "constant":
      parameters.value = getFloatCookie(`${componentName}-constant-input`);
      break;
    case "uniform":
      parameters.lowerBound = getFloatCookie(`${componentName}-uniform-lower`);
      parameters.upperBound = getFloatCookie(`${componentName}-uniform-upper`);
      break;
    case "exponential":
      parameters.mean = getFloatCookie(`${componentName}-exponential-input`);
      break;
  }
  return new Distribution(distributionType, parameters);
}
function runSingleServer(){
  var serviceType = getCookie("server-distribution-type");
  var arrivalType = getCookie("arrival-distribution-type");
  var serviceDistribution = getDistribution("server", serviceType);
  var arrivalDistribution = getDistribution("arrival", arrivalType);
  createSingleServer(arrivalDistribution, serviceDistribution);
  initializeCanvas();
}
function runParallelServers(){
  var arrivalType = getCookie("arrival-distribution-type");
  var arrivalDistribution = getDistribution("arrival", arrivalType);
  var serverCount = getFloatCookie("server-count");
  var serviceType = getCookie("parallel-servers-distribution-type");
  var serviceDistributions = getDistribution("parallel-servers",serviceType);
  createParallelServers(arrivalDistribution, serviceDistributions, serverCount);
  initializeCanvas();
}
function runSingleFeedback(){
  var serviceType = getCookie("server-distribution-type");
  var arrivalType = getCookie("arrival-distribution-type");
  var serviceDistribution = getDistribution("server", serviceType);
  var arrivalDistribution = getDistribution("arrival", arrivalType);
  var feedbackRate = getFloatCookie("feedback-return-rate");
  createSingleFeedback(arrivalDistribution, serviceDistribution, feedbackRate);
  initializeCanvas();
}
function runWorkstations(){
  var workstationCount = getCookie("workstation-count");
  var workstationType = getCookie("workstation-distribution-type");
  var workstationDistribution = getDistribution("workstation", workstationType);
  
  var serverCount = getCookie("server-count");
  var serverType = getCookie("processor-distribution-type");
  var serverDistribution = getDistribution("processor", serverType);
  
  createWorkstations(workstationDistribution, workstationCount, serverDistribution, serverCount);
  initializeCanvas();
}
function runCentral(){
  var centralType = getCookie("cpu-distribution-type");
  var centralDistribution = getDistribution("cpu", centralType);
  
  var channelType = getCookie("channel-distribution-type");
  var channelDistribution = getDistribution("channel", channelType);

  var diskCount = getCookie("disk-count");
  var coreCount = getCookie("core-count");
  var diskDistributions = [];
  var diskWeights = [];
  var jobCount = getCookie("job-count");

  for(var i = 1; i <= diskCount; i++){
    var diskType = getCookie(`disk-${i}-distribution-type`);
    diskDistributions.push(getDistribution(`disk-${i}`, diskType));

    var diskWeight = getCookie(`disk-${i}-weight`);
    diskWeights.push(diskWeight);
  }
  createCentralServer(centralDistribution, channelDistribution, diskDistributions, diskCount, jobCount, coreCount, diskWeights);
  initializeCanvas();
}
switch(selectedModel){
    case "singleServer":
        runSingleServer();
        break;
    case "parallelServers":
        runParallelServers();
        break;
    case "singleFeedback":
        runSingleFeedback();
        break;
    case "workstations":
        runWorkstations();
        break;
    case "centralServer":
        runCentral();
        break;
}
