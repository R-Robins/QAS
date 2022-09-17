/////////////////////////////////////////////////////////////////
// driver.js
// The interface to run the simulation and update the visual
////////////////////////////////////////////////////////////////

/************************************************
* TIMER AND RUNNING COMPONENTS
************************************************/
var currentModel = null;
var currentSimulation = null;
var lock = false;
var timeNextEvent;
var speedModifier = 1;
var stepMode = false;
var simulationMode = false;
function displayError(){
    stopModel();
    if(simulationMode){
        currentSimulation.copyAllTasks();
        currentModel.draw();
    }
    //alert("Error: " + error);
    updateSpeedMenu();
}
function increaseSpeed(){
    speedModifier += .1;
    updateRate = defaultUpdateRate * speedModifier;
    stopModel();
    runModel();
}
function decreaseSpeed(){
    if(speedModifier >= .2){
        speedModifier = speedModifier - .1;
    }
    updateRate = defaultUpdateRate * speedModifier;
    stopModel();
    runModel();
}
function resetModel(){
    location.reload();
}

function stopModel(){
    clearInterval(currentModel.intervalID);
    currentModel.timerRunning = false;
    currentModel.intervalID = null;
}
function createTimer(updateFunction, rate = updateRate){
    return currentModel.intervalID = setInterval(updateFunction, rate);
}
function singleEvent(){
    currentSimulation.processEvent();
}
function runModel(rate = updateRate){
    stopModel();
    if(stepMode == true){
        stepMode = false;
        stopStepOnceMode();
    }
    simulationMode = false;
    currentModel.timerRunning = true;
    currentModel.intervalID = createTimer(tickModel, rate);
    printResults();
}

function tickModel(){
    timeNextEvent = currentSimulation.getNextEventTime();
    if(timeNextEvent !== null && timeElapsed >= timeNextEvent){
        currentSimulation.processEvent();
        //console.log(currentModel.events[0].object.identifier + "|" + currentModel.events[0].task.identifier + "|" + currentModel.events[0].type);
        printResults();
    }
    currentModel.tickOnce();
    if(error) displayError();
}
function tickPlot(numberIterations){
    stepMode = false;
    simulationMode = true;
    for(var i = 0; i < numberIterations; i++){
        //timeNextEvent = currentSimulation.getNextEventTime();
        currentSimulation.processEvent();
        //currentModel.tickOnce();
    }
    
    printResults();
    simulationMode = false;
    updateSpeedMenu();
    currentSimulation.copyAllTasks();
    currentModel.draw();
    if(error) displayError();
}
function startStepOnceMode(){
    if(stepMode == false){
        stepMode = true;
        stopModel();
        currentModel.intervalID = createTimer(stepOnce, updateRate);
    }

    if(stepMode == false){
        stepMode = true;
        stopModel();
        currentModel.intervalID = createTimer(stepOnce, updateRate);
    }
    
    if(timeElapsed > resumeTime){
        delay = false;
    }
    if(delay == true){
        if(timeElapsed < resumeTime){
            stopModel();
            currentModel.intervalID = createTimer(stepOnce, updateRate);
            return;
        }
    }
    
    
    else{
        while(currentModel.events.length < 1)
            currentSimulation.processEvent();

        
        //while(currentModel.events.length >= 1 && currentModel.events[0].delay == true)
          //  currentModel.processEvent() ;
        currentModel.processEvent();
        timeNextEvent = currentSimulation.getNextEventTime();
        elapsedTime = timeNextEvent;
        stopModel();
        currentModel.intervalID = createTimer(stepOnce, updateRate);
    }
    if(error) displayError();
}
function stepOnce(){
    currentModel.tickOnce();
    printResults();
}
function stopStepOnceMode(){
    stepMode = false;
    stopModel();
    //currentSimulation.copyAllTasks();
    //delay = false;
    
    timeElapsed = currentSimulation.getNextEventTime();
    elapsedTime = currentSimulation.getNextEventTime();
}
function beginSimulationMode(){
    stopModel();
    simulationMode = true;
    currentModel.intervalID = createTimer(simulate, 1/1000);
}
function turboMode(){
    stopModel();
    currentModel.intervalID = createTimer(simulate, updateRate);
}
function simulate(){
    for(var i = 0; i < 1000; i++){
        timeNextEvent = currentSimulation.getNextEventTime();
        currentSimulation.processEvent();
    }    
    timeElapsed = currentSimulation.getNextEventTime();
    printResults();
    if(error) displayError();
}
/*
function endSimulationMode(){
    stopModel();
    currentSimulation.copyAllTasks();
    simulationMode = false;
}
*/
/************************************************
* OUTPUT PRINTING
************************************************/
var titleLocation, resultsLocation;
function setPrintOutputLocation(titleLocationID, resultLocationID){
    titleLocation = document.getElementById(titleLocationID);
    resultsLocation = document.getElementById(resultLocationID);

    if(titleLocation === undefined)
        console.log("Invalid title output location");
  
    if(resultsLocation === undefined)
        console.log("Invalid results output location");

}
function printDebugResults(){
    //titleLocation.innerHTML = currentSimulation.toTable();
    resultsLocation.innerHTML = currentSimulation.componentsToTable();
}
function printResults(){
    resultsLocation.innerHTML = currentSimulation.displayResults();
}

function setTimeScaling(utilization, lambda){};
function findDistributionAverage(distribution){
    switch(distribution.type){
        case "constant":
            return distribution.values.value;
            break;
        case "exponential":
            return distribution.values.mean;
            break;
        case "uniform":
            var lower = distribution.values.lowerBound;
            var upper = distribution.values.upperBound;
            return (upper + lower) / 2;
            break;
    }
}
/************************************************
* Creation methods
************************************************/
function createSingleServer(arrivalDistribution, serviceDistribution){
    currentSimulation= new SingleServerModel(arrivalDistribution, serviceDistribution);
    currentModel = new SingleServerVisualModel();
    currentSimulation.connectVisualModel(currentModel);
    drawCanvas();
    currentModel.draw();    
    var averageArrivalTime = findDistributionAverage(arrivalDistribution);
    var averageServiceTime = findDistributionAverage(serviceDistribution);
    var averageUtilization = averageArrivalTime / averageServiceTime;

    var incomingTime = averageArrivalTime
    //simulationTimeScaling = incomingTime / (desiredAdjustedValue * averageUtilization );
    simulationTimeScaling = incomingTime / desiredAdjustedValue;
    setGraphingInformation();
    runModel(updateRate);
}
function createSingleFeedback(arrivalDistribution, serviceDistribution, feedbackRate){
    currentSimulation= new SingleFeedbackModel(arrivalDistribution, serviceDistribution, feedbackRate);
    currentModel = new SingleFeedbackVisualModel();
    currentSimulation.connectVisualModel(currentModel);
    drawCanvas();
    currentModel.draw();  
    
    var averageArrivalTime = findDistributionAverage(arrivalDistribution);
    var averageServiceTime = findDistributionAverage(serviceDistribution);
    var averageUtilization = averageArrivalTime * (1 - feedbackRate/100) / averageServiceTime;
    var incomingTime = averageArrivalTime
    //simulationTimeScaling = incomingTime / (desiredAdjustedValue * averageUtilization );
    simulationTimeScaling = incomingTime / desiredAdjustedValue;
    setGraphingInformation();
    runModel(updateRate);
}

function createTwoServers(arrivalDistribution, serviceDistributions){
    currentSimulation= new TwoServersModel(arrivalDistribution, serviceDistributions);
    currentModel = new TwoServersVisualModel();
    currentSimulation.connectVisualModel(currentModel);
    drawCanvas();
    currentModel.draw();    
    var averageArrivalTime = findDistributionAverage(arrivalDistribution);
    var incomingTime = averageArrivalTime
    simulationTimeScaling = incomingTime / desiredAdjustedValue;
    setGraphingInformation();
    runModel(updateRate);
}

function createParallelServers(arrivalDistribution, serviceDistributions, serverCount){
    currentSimulation = new ParallelServersModel(arrivalDistribution, serviceDistributions, serverCount);
    correntModel = new ParallelServersVisualModel(serverCount);
    currentSimulation.connectVisualModel(currentModel);
    drawCanvas();
    currentModel.draw();


    var averageArrivalTime = findDistributionAverage(arrivalDistribution);
    var averageServiceTime = findDistributionAverage(serviceDistributions) / serverCount;
    var averageUtilization = averageArrivalTime / averageServiceTime;
    var incomingTime = averageArrivalTime
    //simulationTimeScaling = incomingTime / (desiredAdjustedValue * averageUtilization );
    simulationTimeScaling = incomingTime / desiredAdjustedValue;
    setGraphingInformation();
    runModel(updateRate);
}

var workstationCount = 6;
var serverCount = 6;

var w1 = new Distribution("uniform", {"lowerBound": 6, "upperBound": 24});
var w2 = new Distribution("uniform", {"lowerBound": 10, "upperBound":15}); 

function createWorkstations(workstationDistribution, workstationCount, serverDistribution, serverCount){
    currentSimulation= new InteractiveModel(workstationDistribution, workstationCount, serverDistribution, serverCount);
    currentModel = new InteractiveVisualModel(workstationCount, serverCount);
    currentSimulation.connectVisualModel(currentModel);
    currentSimulation.addInitialVisualEvents();
    drawCanvas();
    currentModel.draw();    

    var averageArrivalTime = findDistributionAverage(workstationDistribution) / workstationCount;
    var averageServiceTime = findDistributionAverage(serverDistribution) / serverCount;
    var averageUtilization = averageArrivalTime / averageServiceTime;
    var incomingTime = averageArrivalTime
    //simulationTimeScaling = incomingTime / (desiredAdjustedValue * averageUtilization );
    if(incomingTime == 0){
        simulationTimeScaling = averageServiceTime / (desiredAdjustedValue);
    }
    else
        simulationTimeScaling = incomingTime / (desiredAdjustedValue);
        
    setGraphingInformation();
    runModel(updateRate);
}

function createCentralServer( centralDistribution, channelDistribution, diskDistributions, diskCount, jobCount, coreCount, diskWeights){
    currentSimulation= new CentralServerModel(centralDistribution, channelDistribution, diskDistributions, diskCount, jobCount, coreCount, diskWeights);
    currentModel = new CentralServerVisualModel(diskCount, coreCount);
    currentSimulation.connectVisualModel(currentModel);
    currentSimulation.addInitialEvents();
       
    var totalDistribution = 0;
    var totalDiskWeights = 0;
    for(var i = 0; i < diskWeights.length; i++){
        totalDiskWeights += parseFloat(diskWeights[i]);
    }
    var adjustedDiskWeights = [];

    for(var i = 0; i < diskWeights.length; i++){
        adjustedDiskWeights.push( diskWeights[i] / totalDiskWeights );
    }
    for(var i = 0; i < diskDistributions.length; i++){
        totalDistribution += findDistributionAverage(diskDistributions[i])* adjustedDiskWeights[i];
    }
   
    var averageDiskDistribution = totalDistribution * diskCount;
    var averageProcessorDistribution = findDistributionAverage(centralDistribution) * coreCount;
    var averageChannelDistribution = findDistributionAverage(channelDistribution);
    var averageUtilization = averageProcessorDistribution / averageDiskDistribution;
    var incomingTime = averageDiskDistribution
    //simulationTimeScaling = incomingTime / (desiredAdjustedValue * averageUtilization );
    simulationTimeScaling = incomingTime / (3*desiredAdjustedValue);
    setGraphingInformation();
    drawCanvas();
    currentModel.draw();
    runModel(updateRate);
}

function draw(){
    currentModel.draw();
}

function onClickPause(){

}
function onClickResume(){

}
function onClickSpeedUp(){

}
function onClickSpeedDown(){
    
}

//Distribution Templates
var lowerBound = 0;
var upperBound = 1;
var constantValue = 1;
var exponentialMean = 5;

var uniformDistribution = new Distribution("uniform", {"lowerBound": lowerBound, "upperBound": upperBound});
var constantDistribution = new Distribution("constant", {"value": constantValue}); 
var exponentialDistribution = new Distribution("exponential", {"mean": exponentialMean});


////////////////////////////////////
// TWO SERVERS
///////////////////////////////////
var twoServersUniformDistribution = new Distribution("uniform", {"lowerBound": lowerBound, "upperBound": upperBound});
var twoServersConstantDistribution = new Distribution("constant", {"value": constantValue}); 
var twoServersExponentialDistribution = new Distribution("exponential", {"mean": exponentialMean});

var twoServersArrivalDistribution = twoServersUniformDistribution;
var twoServersServerDistribution = twoServersUniformDistribution;

/////////////////////////////////////
//SINGLE FEEDBACK
////////////////////////////////////
var feedbackLowerBound = 0;
var feedbackUpperBound = 5;
var feedbackConstantValue = 5;
var feedbackExponentialMean = 5;
var feedbackUniformDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 5});
var feedbackConstantDistribution = new Distribution("constant", {"value": constantValue}); 
var feedbackExponentialDistribution = new Distribution("exponential", {"mean": exponentialMean});

var singleFeedbackServerDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 4});
var singleFeedbackArrivalDistribution = feedbackUniformDistribution;
var feedbackReturnProbability = 0.3;

///////////////////////////////
// Workstations
/////////////////////////////////
var workstationCount = 5;
var workstationDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 5});

var serverCount = 3;
var serverDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 4});



/////////////////////////////////
// Central Server
///////////////////////////////
var centralDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 4});
var channelDistribution = new Distribution("uniform", {"lowerBound": 0, "upperBound": 4});
var diskDistributions = [
    new Distribution("uniform", {"lowerBound": 0, "upperBound": 4}),
    new Distribution("uniform", {"lowerBound": 0, "upperBound": 4}),
    new Distribution("uniform", {"lowerBound": 0, "upperBound": 4}),
    new Distribution("uniform", {"lowerBound": 0, "upperBound": 4})
];
var diskCount = 4;

//singleServerSimulation(uniformDistribution, constantDistribution);
//twoServersSimulation(twoServersArrivalDistribution, twoServersServerDistribution);
//singleFeedbackSimulation(singleFeedbackArrivalDistribution, singleFeedbackServerDistribution, feedbackReturnProbability);
//workstationsSimulation(workstationDistribution, workstationCount, serverDistribution, serverCount);
//centralServerSimulation(centralDistribution, channelDistribution, diskDistributions, diskCount);

