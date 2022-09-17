var tabContainer = document.getElementById("tabContainer");
var graphingInformation = {};
var defaultTabColor = "#fcf4dc";
var highlightTabColor = "#cdd2ff";
var currentTab = null;
var standardDeviationRange = 1;
var histogramConfiguration = {
    barColor: "blue",
    barLabelColor: "white",
    barLabelUnits: "",
}

function setGraphTitle(title){
    document.getElementById("graphTitle").innerHTML = title;
}

function createTab( tabIdentifier, tabLabel ){
    tabContainer.innerHTML += `
        <button id="${tabIdentifier}" class="graph-tab"> ${tabLabel} </button>
    `
}

function createTabs( tabInformation ){
    for (const key in tabInformation) {
        createTab(tabInformation[key].id, tabInformation[key].label);
    }
}

function addGraphingInformation(information){
    graphingInformation[`${information.id}`] = information;
}

function addTabListener(identifier, e){
    var tab = document.getElementById(identifier);
    var chart = document.getElementById("chart");
    tab.onclick =  function(){
        highlightTab(tab);
        chart.innerHTML = "";
        createHistogram(e.data, e.categories, e.label, e.xLabel, e.yLabel);
    };
    
    if(currentTab == null || currentTab === tab){
        currentTab = tab;
        highlightTab(tab);
        chart.innerHTML = "";
        createHistogram(e.data, e.categories, e.label, e.xLabel, e.yLabel);
    } 
}

function addAllTabListeners(){
    for (const key in graphingInformation) {
        if (graphingInformation[key].hasOwnProperty("data")) {
            var element = graphingInformation[key];
            addTabListener(element.id, element);
        }
    }
}

function highlightTab(tab){
    if(currentTab !== null)
        currentTab.style.backgroundColor = defaultTabColor;
    tab.style.backgroundColor = highlightTabColor;
    console.log()
    currentTab = tab;
}

function closeWindow(){
    //setGraphTitle("");
    //tabContainer.innerHTML = "";
    //chart.innerHTML = "";
    //graphingInformation = {};
    hideGraphReturnButton();
    document.getElementById("left-block").style.visibility = "visible";
}

function addReturnListener(){
    showGraphReturnButton();
    document.getElementById("graphReturnButton").onclick = function(){   
        document.getElementById("graphContainer").style.display = "none";
        closeWindow();
    }
}

function hideGraphReturnButton(){
    document.getElementById("graphNavigationContainer").innerHTML = "";
}
function showGraphReturnButton(){
    document.getElementById("graphNavigationContainer").innerHTML = `
        <div id="graphNavigationUpper">
            <div id="graphPlotCounterDivision" class="graph-plot-counter-division">
                <div id="graphEventCounterTitle" class="graph-event-counter-title"> Events Processed: </div>  
                <div id="graphEventCount" class="graph-event-count"> 0 </div>
            </div>
        </div>

        <div id="graphNavigationLower" class="graph-navigation-lower">
            <div id="graphPlotControls" class="graph-plot-controls">
                <div> Advance Graph </div>
                <div id="graphPlotButtonGroup" class="graph-plot-button-group">
                    <button id = "plotThousand" class="graph-plot-button"> 1000 </button>
                    <button id = "plotTenThousand" class="graph-plot-button"> 10,000 </button>
                    <button id = "plotHundredThousand" class="graph-plot-button"> 100,000 </button>
                </div>

                <div> Deviation Range </div>
                <div id="graphPlotButtonGroup" class="graph-plot-button-group">
                    <button id = "setOneDeviation" class="graph-plot-button"> σ </button>
                    <button id = "setTwoDeviation" class="graph-plot-button"> 2σ </button>
                    <button id = "setThreeDeviation" class="graph-plot-button"> 3σ </button>
                </div>
            </div>
            <button id = "graphReturnButton" class="graph-navigation-button"> Return </button>
        </div>
    `;
    document.getElementById("plotThousand").onclick = function(){tickAndGraph(1000)};
    document.getElementById("plotTenThousand").onclick = function(){tickAndGraph(10000)};
    document.getElementById("plotHundredThousand").onclick = function(){tickAndGraph(100000)};
    document.getElementById("setOneDeviation").onclick = function(){changeDeviationRange(1)};
    document.getElementById("setTwoDeviation").onclick = function(){changeDeviationRange(2)};
    document.getElementById("setThreeDeviation").onclick = function(){changeDeviationRange(3)};
    switch (standardDeviationRange) {
        case 1:
            //document.getElementById("setOneDeviation").style.backgroundColor = "#A9A9A9";
            document.getElementById("setOneDeviation").style.border = "solid";
            document.getElementById("setOneDeviation").onclick = "";
            break;
        case 2:
            document.getElementById("setTwoDeviation").style.border = "solid";
            document.getElementById("setTwoDeviation").onclick = "";
            break;
        case 3:
            document.getElementById("setThreeDeviation").style.border = "solid";
            document.getElementById("setThreeDeviation").onclick = "";
            break;
    
        default:
            break;
    }
}
function highlightDeviationButtons(){
    
}
function tickAndGraph(numberEvents){
    tickPlot(numberEvents);
    createGraphs();
    if(error !== null){
        document.getElementById("graphContainer").style.display = "none";
        closeWindow();
    }
}

function changeDeviationRange(deviation){
    console.log(deviation);
    standardDeviationRange = parseFloat(deviation);
    for (const key in graphingInformation) {
        graphingInformation[key].setSelectedDeviationRange(standardDeviationRange);
    }

    createGraphs();
    if(error !== null){
        document.getElementById("graphContainer").style.display = "none";
        closeWindow();
    }
}

function createGraphs(){
    document.getElementById("left-block").style.visibility = "hidden";
    for (const key in graphingInformation) {
        var object = graphingInformation[key].object;
        object.standardizeGraphingInformation();
    }
    if(currentTab == null) 
        createTabs(graphingInformation);
    for (const key in graphingInformation) {
        addGraphingInformation(graphingInformation[key]);
    }
    addAllTabListeners();
    addReturnListener();
    document.getElementById("graphEventCount").innerHTML = currentSimulation.eventsProcessed;
}

function setGraphingInformation(){
    setGraphTitle(currentSimulation.identifier);
    currentSimulation.initializeGraphingInformation();
    graphingInformation = currentSimulation.graphingInformation;
}

var numberGraphDivisions = 100;
function findGraphingInterval(component){
    var distribution = component.distribution;
    switch(distribution.type){
        case "Constant":
            this.predictedDeviation = 0;
            break;
        case "Exponential":
            this.predictedDeviation = this.distribution.mean;
            break;
        case "Uniform":
            this.predictedDeviation = Math.pow( Math.pow(this.distribution.upper - this.distribution.lower, 2)/12, 0.5 );
            break;
    }
    this.graphingInterval = (component.predictedDeviation * standardDeviationRange * 2) / numberGraphDivisions;
}


function addGraphingValue(component){
    switch(component.type){
        case "Queue":
            break;
        case "Server":
            runParallelServers();
            break;
        case "Disk":
            runSingleFeedback();
            break;
        case "arrival":
            runWorkstations();
            break;
        case "Workstation":
            runCentral();
            break;
    }
}