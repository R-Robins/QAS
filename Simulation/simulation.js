//flag for toggling graphing capabilities
var graphing = true;

/********************************************************************************
 *  OUTPUT COMPONENTS
 *******************************************************************************/
var error = null;

function outputNumber(number){
    if(isNaN(number) )
        return "--";
    else return number;
}
//Generates headings from array or map
function generateTableHeadings(tableHeadings){
    var output = "<tr>";
    if(Array.isArray(tableHeadings)){
        tableHeadings.forEach(element => {
            output += `<th>${element}</th>`;
        });
    }
    else{
        for(var key in tableHeadings){
            output += `<th>${outputNumber(tableHeadings[key])}</th>`;
        }
    }
    return output += "</tr>"
}

//Generates rows from array or map
function generateTableData(tableData){
    var output = "<tr>"
    if(Array.isArray(tableData)){
        tableData.forEach(element => {
            output += `<td>${element}</td>`;
        });
    }
    else{
        for(var key in tableData){
            output += `<td>${outputNumber(tableData[key])}</td>`;
        }
    }
    return output += "</tr>";
}
//Generates headings followed by rows from headings / data
function generateTable(tableHeadings, tableData){
    var output = generateTableHeadings(tableHeadings);
    output += generateTableData(tableData);
    return output;
}

function generateLabeledRow(label, data){
    var output = "";
    output += `<tr>`
    output += `<td>${label}</td>`;
    output += `<td>${outputNumber(data)}</td>`;
    output += `</tr>`;
    return output;
}
function generateOutputTables(tableHeadings, tableData){
    var output = "";
    output+= `<th>${tableData[0]}</th> `;
    
    for(var i = 1; i < tableHeadings.length; i++){
        output += `<tr>`
        output += `<td>${tableHeadings[i]}</td>`;
        output += `<td>${outputNumber(tableData[i])}</td>`;
        output += `</tr>`;
    }
    return output;
}
function generateTinyTable(tableData){
    var output = "<tr>"
    if(Array.isArray(tableData)){
        tableData.forEach(element => {
            output += `<td class="tiny-table-data">${outputNumber(element)}</td>`;
        });
    }
    else{
        for(var key in tableData){
            output += `<td class="tiny-table-data">${outputNumber(tableData[key])}</td>`;
        }
    }
    return output += "</tr>";
}
function generateTinyHeadings(tableHeadings){
    var output = "<tr>"
    if(Array.isArray(tableHeadings)){
        tableHeadings.forEach(element => {
            output += `<th class="tiny-table-heading">${element}</th>`;
        });
    }
    else{
        for(var key in tableHeadings){
            output += `<th class="tiny-table-heading">${outputNumber(tableHeadings[key])}</th>`;
        }
    }
    return output += "</tr>";
}
var currentTime = 0;
var tasksCompleted = 0;
var cumulativeResponseTime = 0;
var responseTimeCumulativeDeviation = 0;
var responseTimeDeviation = 0;

function simulationToTable(){
    var generalHeadings = ["Current Time", "Jobs Completed", "Response Time"];
    var generalData = [currentTime, tasksCompleted, cumulativeResponseTime / tasksCompleted];
    var output = "<tr>";
    generalHeadings.forEach(element => {
        output += `<th>${element}</th>`;
    });
    output += "</tr><tr>"
    generalData.forEach(element => {
        output += `<td>${element}</td>`;
    });
    output += "</tr>";
    return output;
}
function setTime(time){
    currentTime = time;
}


/**********************************************************************************
 *  Classes for Simulation
 **********************************************************************************/
class Task{
    constructor(identifier, creationTime){
        this.identifier = identifier;
        this.creationTime = creationTime;
    }
    getRunTime(){
        return currentTime - this.creationTime;
    }
    toString(){
        return this.identifier;
    }
}

class Distribution{
    constructor(type, values){
        this.type = type;
        this.values = values;
    }
    generate(){
        switch(this.type){
            case "uniform":
                var upperBound = this.values.upperBound;
                var lowerBound = this.values.lowerBound;
                return Math.random() * ( (upperBound - lowerBound) ) + lowerBound;
            case "exponential":
                var mean = this.values.mean;
                return -1.0 * mean * Math.log(1.0 - Math.random());
            case "constant":
                return this.values.value;
        }
    }
    toString(){
        var distributionComponents;
        switch(this.type){
            case "uniform":
                distributionComponents = "Lower: " + this.values.lowerBound + "| Upper: "+ this.values.upperBound;
                break;
            case "exponential":
                distributionComponents = this.values.mean;
                break;
            case "constant":
                distributionComponents = this.values.value;
                break;
        }
        return "Distribution: " + this.type + " | " + distributionComponents;
    }
}

class GraphingInformation{
    constructor(identifier, object, title, yLabel, xLabel){
        this.identifier = identifier;
        this.object = object;
        this.title = title;
        this.yLabel = yLabel;
        this.xLabel = xLabel;

        this.data = [];
        this.allData = [];
        this.categories = [];
        this.maxCategories = 100;
        this.maxDeviations = 3;
        this.stepRate = undefined;
        this.min = Infinity;
        this.max  = 0;
        this.cumulativeMean = 0;
        this.cumulativeDeviation = 0;
        this.minBoundary = Infinity;

        this.mean = 0;
        this.numberEntries = 0;
        this.deviation = 0;

        this.selectedDeviationRange = 2;

        //Set up categories for graphing
        while(this.categories.length < this.maxCategories){
            this.categories.push(this.categories.length);
            this.data.push(0);
        }
    }
    
    //titled update user data
    addDataPoint(dataPoint){
        let value = parseFloat(dataPoint);
        this.numberEntries += 1;
        this.allData.push(value);
        this.cumulativeDeviation += value*value;
        this.cumulativeMean += value;
        this.mean = this.cumulativeMean / this.numberEntries;
        this.deviation = Math.sqrt(this.cumulativeDeviation/this.numberEntries - this.mean*this.mean);
        if(value < this.min) this.min = value;
        if(this.min < 0) this.min = 0;
        if(value > this.max) this.max = value;
    }
    setSelectedDeviationRange(number){
        this.selectedDeviationRange = number;
    }
    setGraphingArea(){
        this.minBoundary = this.mean - this.selectedDeviationRange * this.deviation;
        if(this.minBoundary < 0) this.minBoundary = 0;
        //THIS IS PROBABLY NOT NECESARRRY
        //BLARG ARG ARG ARG ARG!
        this.maxBoundary = this.mean + this.selectedDeviationRange * this.deviation;
        this.stepRate = (this.maxBoundary - this.minBoundary) / (this.maxCategories);
        var currentPlace = this.minBoundary;

        for( var i = 0; i < this.maxCategories; i++){
            this.categories[i] = currentPlace;
            currentPlace += this.stepRate;
            this.data[i] = 0;
        }
    }
    generateCurrentData(){
        this.setGraphingArea();
        for(var i = 0; i < this.allData.length; i++){
            var result = (this.allData[i]);
            if( (result >= this.minBoundary) && (result <= this.mean + this.deviation * this.selectedDeviationRange )){

                this.data[ Math.floor(result / this.stepRate) ] += 1;
            }
        }
    }
}

class SimulationComponent {
    constructor(identifier, type){
        this.identifier = identifier;
        this.type = type; //the type of object, ex. server
        this.model = null;
        this.available = true;
        this.task = null;
        this.timeNextEvent = null; //time at which next event is scheduled to occur for this object

        //graphing information
        this.canGraph = false;
        this.graphingInformation = new GraphingInformation(identifier, this, identifier, "Occurrences", "Time");

        //user output
        this.userHeadings;
        this.userData;
        this.resultIndices = {};
        this.selectedResults = [];
    }
    copyTask(){
        if(this.task !== undefined && this.task !== null && this.visual !== undefined & this.visual !== null)
            this.model.copyTask(this.task.identifier, this.visualComponent);
    }
    updateUserData(){
        console.log("Update undefined for: " + this.identifier);
    }
    setResultIndices(){
        for(var i = 1; i < this.userHeadings.length; i++){
            this.resultIndices[this.userHeadings[i]] = i;
        }
    }
    setSelectedResults(selectedResults){
        this.setResultIndices();
        for(var i = 0; i < selectedResults.length; i++){
            this.selectedResults.push(selectedResults[i]);
            if(this.getResult(selectedResults[i]) == undefined){
                console.log("Invalid selected result! " + selectedResults[i]);
            }
        }
    }
    getSelectedResults(){
        this.updateUserData();
        var output = "";
        var label;
        var data;
        for(var i = 0; i < this.selectedResults.length; i++){
            label = this.selectedResults[i];
            data = this.getResult(label);
            output += generateLabeledRow(label, data);
        }
        return output;
    }
    getDataResults(resultNames){
        var output = "";
        var results = [];
        this.updateUserData();
        for(var i = 0; i < resultNames.length; i++){
            results.push(this.getResult(resultNames[i]));
        }
        return generateTableData(results);
    }
    getResultValues(resultNames){
        var results = [];
        this.updateUserData();
        for(var i = 0; i < resultNames.length; i++){
            results.push(this.getResult(resultNames[i]));
        }
        return results;
    }
    getTinyTable(resultNames){
        var output = "";
        var results = [];
        this.updateUserData();
        for(var i = 0; i < resultNames.length; i++){
            results.push(this.getResult(resultNames[i]));
        }
        return generateTinyTable(results);
    }
    getHeadings(headingNames){
        return generateTableHeadings(headingNames);
    }
    getResult(resultName){
        return this.userData[ this.resultIndices[resultName] ];
    }
    userHeadingsToTable(){
        if(this.userHeadings !== undefined)
            return generateTableHeadings(this.userHeadings);
        return "";
    }
    userDataToTable(){
        this.updateUserData();
        if(this.userData !== undefined)
            return generateTableData(this.userData);
        return "";
    }
    userOutputTable(){
        this.updateUserData();
        if(this.userData !== undefined)
            return generateOutputTables(this.userHeadings, this.userData);
    }
    updateComponentData(value){
        /*
        while(this.graphingInformation.categories.length <= Math.round(value)){
            this.graphingInformation.categories.push(this.graphingInformation.categories.length);
            this.graphingInformation.data.push(0);
        }
        this.graphingInformation.data[Math.round(value)]++;
        */
        this.graphingInformation.addDataPoint(value);
    }

    standardizeGraphingInformation(){
        this.graphingInformation.generateCurrentData();
        //for(var i = 0; i < this.graphingInformation.data.length; i++){
         //   this.graphingInformation.data[i] = 0;
       // };
    }
    setNext(component){
        this.next = component;
    }
    setPrevious(component){
        this.previous = component;
    }
    acceptTask(task){
        this.task = task;
    }
    advanceTask(task){
        this.next.acceptTask(task);
    }
    //to be overridden in decendants for relevant output
    toString(){
        var output;
        output = this.identifier + "| Task: " + this.task;
    }
    checkAvailability(){
        return this.available;
    }
    resetVisual(){
        this.visual.reset();
    }
}

class QueueComponent extends SimulationComponent{
    constructor(identifier){
        super(identifier, "Queue");
        this.tasks = {};
        this.tasksWaiting = [];
        this.numberTasks = 0;

        /////////////////////////
        this.canGraph = true;
        this.timeLastArrival = 0;
        this.graphingInformation.xLabel = "Time between arrivals";
        //INFORMATION FOR RESULTS
        this.averageQueueLength = 0;
        this.weightedQueueSize = 0;
        this.timeLastAdvance = 0;
        this.timeLastUpdate = 0;
        this.userHeadings = ["Identifier", "Current Queue Length", "Mean Queue Length"];
        this.userData = [this.identifier, this.numberTasks, this.averageQueueLength];
        this.setResultIndices();
    }
    copyTask(){
        /*
        for(var key in this.forwardedTasks){
            var createdTask = currentModel.createVisualTask(key, this.visual);
            this.visual.receiveTask(createdTask);
        }
        */
        for(var i = 0; i < this.tasksWaiting.length; i++){
            var taskIdentifier = this.tasksWaiting[i].identifier;
            var createdTask = currentModel.createVisualTask(taskIdentifier, this.visual);
            this.visual.receiveTask(createdTask);
            this.visual.slotReceive(createdTask.identifier);
        }
    }
    updateUserData(){
        this.averageQueueLength = this.weightedQueueSize / this.timeLastUpdate;
        this.userData = [this.identifier, this.numberTasks, this.averageQueueLength.toFixed(2)];
    }
    acceptTask(task){ //Receiving a new task
        if(this.numberTasks > maxQueueSize){
            error = "MAX QUEUE SIZE EXCEEDED";
        }
        //Graphing update
        this.updateComponentData(currentTime - this.timeLastArrival);
        this.timeLastArrival = currentTime;  
        ///////////////////////////////////////////////////////////////////////
        this.tasks[task.identifier] = task;
        this.weightedQueueSize += (currentTime-this.timeLastUpdate)*this.numberTasks;
        this.timeLastUpdate = currentTime;
        this.numberTasks++;

        //if not available push to waiting
        if(!this.next.checkAvailability()){
            this.tasksWaiting.push(task);
        }
        else {
            if(this.tasksWaiting.length > 0){
                this.forwardTask(this.tasksWaiting.shift());
                this.tasksWaiting.push(task);
            }
            else{
                this.forwardTask(task);
            }
        }
        this.updateUserData();
    }
    forwardTask(task){
        //this.forwardedTasks[`${task.identifier}`] = task;
        this.next.acceptTask(task);
    }
    advanceTask(task){ //Called by component that queue is linked to
        //this.weightedQueueSize += this.numberTasks * (currentTime - this.timeLastAdvance);
        this.timeLastAdvance = currentTime;
        this.weightedQueueSize += (currentTime-this.timeLastUpdate)*this.numberTasks;
        this.timeLastUpdate = currentTime;
        this.removeTask(task);  

        if(this.tasksWaiting.length > 0 && this.next.checkAvailability()){
            this.next.acceptTask(this.tasksWaiting.shift());
        }

        this.updateUserData();
    }

    removeTask(task){
       // delete this.forwardedTasks[task.identifier];
        delete this.tasks[task.identifier];
        this.numberTasks--;
    }
    toString(){
        var output = this.identifier + ": <br/>Contained Tasks: ";
        for (const key in this.tasks) {
            if (this.tasks.hasOwnProperty(key)) 
                output  += this.tasks[key].toString() + " | ";             
        }
        return output;
    }
    toTable(){
        var tableHeadings = ["Identifier", "Contained Tasks"];
        var tasks = "";
        for (const key in this.tasks) {
            if (this.tasks.hasOwnProperty(key)) 
            tasks  += this.tasks[key].toString() + " | ";             
        }
        var tableData = [this.identifier, tasks];
        return generateTable(tableHeadings, tableData);
    }
}

class ServiceComponent extends SimulationComponent{
    constructor(identifier, distribution){
        super(identifier, "Server");
        this.distribution = distribution;
        this.connectedQueue = null;
        this.available = true;
        
        //Metrics to Evaluate
        this.jobsServiced = 0;
        this.timeUtilized = 0;
        this.utilization = 0;

        this.totalServiceTime = 0; 
        this.averageServiceTime = 0;
        this.serviceCumulativeDeviation = 0;
        this.serviceTimeDeviation = 0;

        this.lastGeneratedServiceTime = 0;
        this.timeLastUpdate = 0;

        /////////////////////////
        this.canGraph = true;
        this.graphingInformation.xLabel = "Service Time";

        //User Output
        this.userHeadings = ["Identifier", "Utilization", "Mean Service Time", "SD Service Time", "Jobs Serviced"];
        this.userData = [this.identifier, this.utilization, this.averageServiceTime, this.serviceTimeDeviation, this.jobsServiced];
        this.setResultIndices();
    }

    copyTask(){
        this.visual.reset();
        this.visual = this.model.visualModel.components[this.identifier];
        if(this.task != undefined && this.task != null ){     
            if( this.connectedQueue == null){
                var assignedTask = currentModel.createVisualTask(this.task.identifier, this.visual);
                this.visual.task = assignedTask;
               // this.visual.acceptTask(assignedTask);
                this.visual.receiveTask(assignedTask);
            }   
            else{
                var assignedTask = currentModel.createVisualTask(this.task.identifier, this.connectedQueue.visual);    
                assignedTask.setDestinationObject(null);
                if(this.visual.parallelBlock !== null){
                    this.visual.parallelBlock.placeTask(assignedTask.identifier, this.identifier);
                }
               // this.connectedQueue.visual.acceptTask(assignedTask);
                this.connectedQueue.visual.receiveTask(assignedTask);
                this.connectedQueue.visual.slotReceive(assignedTask.identifier);
            }

        }    
    }
    updateUserData(){
        this.serviceTimeDeviation = Math.sqrt(this.serviceCumulativeDeviation/(this.jobsServiced) - this.averageServiceTime*this.averageServiceTime)
        this.userData = [this.identifier, this.utilization.toFixed(2), this.averageServiceTime.toFixed(2), this.serviceTimeDeviation.toFixed(2), this.jobsServiced];
    }
    connectQueue(queue){
        this.connectedQueue = queue;
    }
    acceptTask(task){
        this.task = task;
        //Generate Random Service Time Based on Distribution
        this.lastGeneratedServiceTime = this.distribution.generate();
        this.updateComponentData(this.lastGeneratedServiceTime);
        this.timeNextEvent = this.lastGeneratedServiceTime + currentTime;
        this.available = false;
        this.model.addEvent(this);

        //Return Information Regarding Next Event for This Object
        return {"component": this.identifier, "time": this.timeNextEvent, "task": task};
    }
    updateMetrics(){
        this.totalServiceTime += this.lastGeneratedServiceTime;
        this.averageServiceTime = this.totalServiceTime / (this.jobsServiced);
        this.serviceCumulativeDeviation += this.lastGeneratedServiceTime*this.lastGeneratedServiceTime
        this.utilization = this.totalServiceTime / currentTime;   //(this.jobsServiced)/(currentTime)*this.averageServiceTime;//this.totalServiceTime / currentTime;   
        this.averageResponseTime = this.totalServiceTime / this.jobsServiced;
    }
    advanceTask(){
        //Move Task to Next Component
        var task = JSON.parse(JSON.stringify(this.task));
        if(this.next != null && this.next.available)
            this.next.acceptTask(this.task);

        this.jobsServiced++;

        this.updateMetrics();
        
        
        this.available = true;
        this.timeNextEvent = null;
        this.task = null;
        
        //If there is a connected queue, notify that server is available
        if(this.connectedQueue != null)
            this.connectedQueue.advanceTask(task);
    }
    toString(){
        var serverInformation = this.identifier + ": ";
        serverInformation += "<br>Jobs: " + this.jobsServiced + " | Response: " + this.averageResponseTime + " | Utilization: " + this.utilization; 
        serverInformation += "<br>" + this.distribution.toString();
        serverInformation += "<br>Active Task: " + this.task;
        serverInformation += "<br/>Next Event: " + this.timeNextEvent;
        return serverInformation;
    }
    getOutput(){
        return [
            {"Jobs" : this.jobsServiced},
            {"Service Time" : this.jobsServiced},
            {"Active Task" : this.task},
            {"Next Event" : this.timeNextEvent}
        ];
    }
    toTable(){
        var tableHeadings = ["Identifier", "Jobs", "Service Time", "Active Task", "Next Event", "Utilization"];
        var tableData = [this.identifier,this.jobsServiced, this.totalServiceTime/this.jobsServiced, this.task, this.timeNextEvent, this.utilization];
        return generateTable(tableHeadings, tableData);
    }
}

class DiskComponent extends ServiceComponent{
    constructor(identifier, distribution){
        super(identifier, distribution);
        this.type = "Disk";
    }
}

class ArrivalComponent extends SimulationComponent{
    constructor(identifier, distribution){
        super(identifier, "arrival");
        this.identifier = identifier;
        this.distribution = distribution;
        this.jobsArrived = 0;

        //metrics needed
        this.interArrivalTime = 0;
        
        this.totalInterArrivalTime = 0;
        this.averageInterArrivalTime = 0;
        this.interArrivalCumulativeDeviation = 0;
        this.interArrivalTimeDeviation = 0;

        /////////////////////////
        this.canGraph = true;
        this.graphingInformation.xLabel = "Time between arrivals";

        //User Output
        this.userHeadings = ["Identifier", "Mean Interarrival Time", "SD Interarrival Time", "Jobs Arrived"];
        this.userData = [this.identifier, this.averageInterArrivalTime, this.averageInterArrivalTimeDeviation, this.jobsArrived];
        this.setResultIndices();
    }
    copyTask(){

    }
    updateUserData(){
        this.interArrivalTimeDeviation = Math.sqrt(this.interArrivalCumulativeDeviation/(this.jobsArrived) - this.averageInterArrivalTime*this.averageInterArrivalTime);
        this.userData = [this.identifier, this.averageInterArrivalTime.toFixed(2), this.interArrivalTimeDeviation.toFixed(2), this.jobsArrived-1];
    }
    generateNextArrival(){
        var generatedTime = this.distribution.generate();
        this.updateComponentData(generatedTime);
        this.timeNextEvent += generatedTime; 
        this.jobsArrived += 1;
        this.totalInterArrivalTime += generatedTime;
        this.averageInterArrivalTime = this.totalInterArrivalTime/(this.jobsArrived);
        this.interArrivalCumulativeDeviation += generatedTime*generatedTime;
        this.task = new Task(`Task ${this.jobsArrived}`, this.timeNextEvent);
        this.model.addEvent(this);
    }

    advanceTask(){
        this.next.acceptTask(new Task(`Task ${this.jobsArrived}`, this.timeNextEvent));
        this.generateNextArrival();
    }
    toString(){
        var arrivalInformation = this.identifier + ": " 
        arrivalInformation += "<br/>Jobs: " + this.jobsArrived; 
        arrivalInformation += "<br/>" + this.distribution.toString();
        arrivalInformation += "<br/>Active Task: " + this.task;
        arrivalInformation += "<br/>Next Event: " + this.timeNextEvent;
        return arrivalInformation;
    }
    toTable(){
        var tableHeadings = ["Identifier", "Jobs", "Inter-Arrival Time", "Active Task", "Next Event"];
        var tableData = [this.identifier,this.jobsArrived, this.totalInterArrivalTime/this.jobsArrived, this.task, this.timeNextEvent];
        return generateTable(tableHeadings, tableData);
    }
}

class ExitComponent extends SimulationComponent{
    constructor(identifier){
        super(identifier, "Exit");
    }
    acceptTask(task){    
        this.task = task;
        this.advanceTask(task);
    }
    advanceTask(task){
        cumulativeResponseTime += task.getRunTime();
        responseTimeCumulativeDeviation += task.getRunTime() * task.getRunTime();
        tasksCompleted++;
        this.task = null;
    }
    updateUserData(){
        return "";
    }
    updateUserHeadings(){
        return "";
    }
}

class FeedbackServer extends ServiceComponent{
    constructor(identifier, distribution, feedbackProbability){
        super(identifier, distribution);
        this.feedbackProbability = feedbackProbability/100;
    }
    connectExit(exitPoint){
        this.exitPoint = exitPoint;
    }
    advanceTask(){
        var task = JSON.parse(JSON.stringify(this.task));
        if(this.next != null){
            var randomValue = Math.random();
            randomValue < this.feedbackProbability ? this.choseBelow++ : this.choseAbove++;
            if(randomValue < this.feedbackProbability){
                this.visual.setTaskDestination(this.task, "Loop");
                this.next.acceptTask(this.task);
                this.tasksReturned++;
            }  
            else{
                this.visual.setTaskDestination(this.task, "Exit");
                this.exitPoint.acceptTask(this.task);
                this.tasksExitted++;
            }
        }
        this.jobsServiced++;
        this.updateMetrics();
        
        this.available = true;
        this.timeNextEvent = null;
        this.task = null;
        
        //If there is a connected queue, notify that server is available
        if(this.connectedQueue != null)
            this.connectedQueue.advanceTask(task);        
    }
}

class ParallelComponent extends SimulationComponent{
    constructor(identifier, objectType, distribution, numberOfElements, model){
        super(identifier, "parallel block");
        this.objectType = objectType;
        this.distribution = distribution;
        this.numberOfElements = numberOfElements;
        this.containedElements = [];
        this.objectIndices = {};
        this.demandedTasks = [];
        this.connectedQueue = null;
        this.model = model;
        this.placeAllObjects();
        delete this.graphingInformation;
    }
    copyTask(){
        /*
        this.visual.reset();
        for(var key in this.objectIndices){
            var assignedComponent = this.objectIndices[key];
            var assignedTask = assignedComponent.task;
            if(assignedTask !== null)
                this.visual.placeTask(assignedTask.identifier,  key);
        }
        */
        

    }
    updateUserData(){

    }
    userHeadingsToTable(){
        return "";//this.containedElements[0].userHeadingsToTable();
    }
    userDataToTable(){
        var output = "";
        output += this.containedElements[0].userHeadingsToTable();
        for(const key in this.objectIndices){
           output += this.objectIndices[key].userDataToTable();
        }
        return output;
    }
    connectQueue(queue){
        this.connectedQueue = queue;
        for(var i = 0; i < this.containedElements.length; i++){
            this.containedElements[i].connectQueue(this.connectedQueue);
        }
    }
    connectInteriorObjects(){
        for(var i = 0; i < this.containedElements.length - 1; i++){
            for(var j = 0; j < this.containedElements[i].length; j++){
                connectArrow(this.containedElements[i][j], this.containedElements[i+1][j]);
            }
        }
    }
    placeAllObjects(){
        if(!Array.isArray(this.objectType)){
            this.placeObjects(this.objectType, this.containedElements);
        }
        else {
            for(var i = 0; i < this.objectType.length; i++){
                if(this.containedElements[i] === undefined){
                    this.containedElements.push([]);
                }
                this.placeObjects(this.objectType[i], this.containedElements[i]);
            }
            
            for(var i = 0; i < this.numberOfElements; i++){
                for(var j = 1; j < this.objectType.length; j++){
                    this.containedElements[j-1][i].setNext(this.containedElements[j][i]);
                    if(this.containedElements[j-1][i].type == "Queue"){
                        this.containedElements[j][i].connectQueue(this.containedElements[j-1][i]); 
                    }
                }
            }
            
            var tempArray = [];
            for (var i = 0; i < this.numberOfElements; i++){
                for( var j = 0; j < this.objectType.length; j++)
                    tempArray.push(this.containedElements[j][i]);
            }
            this.containedElements = tempArray;
        }   
    }

    placeObjects(object, resultArray){
        if(Array.isArray(this.distribution)){
            for (var i = 0; i < this.numberOfElements; i++){
                resultArray.push(new object(`${this.identifier} `, this.distribution[i]));
                resultArray[i].identifier += resultArray[i].type + ` ${i+1}`;  
                resultArray[i].model = this.model;
                this.objectIndices[resultArray[i].identifier] = resultArray[i];
                this.model.addComponent(resultArray[i]);
            }
        }
        else{
            for (var i = 0; i < this.numberOfElements; i++){
                resultArray.push(new object(`${this.identifier} `, this.distribution));
                resultArray[i].identifier += resultArray[i].type + ` ${i+1}`;  
                resultArray[i].model = this.model;
                this.objectIndices[resultArray[i].identifier] = resultArray[i];
                this.model.addComponent(resultArray[i]);
            }
        }
    }
    setNext(drawableObject){
        this.next = drawableObject;
        if( drawableObject != undefined){
            for(var i = 0; i < this.containedElements.length; i++){
                if(this.containedElements[i].next == undefined)
                    this.containedElements[i].setNext(this.next);
            }
            this.next.previous = this;
        }
    }
    acceptTask(task){
        var success = false;
        var availableComponents = [];
        if(!Array.isArray(this.objectType)){
            for(var i = 0; i < this.containedElements.length; i++){
                if(this.containedElements[i].checkAvailability()){
                    availableComponents.push(this.containedElements[i]);
                    success = true;
                }
            }
        }
        else{
            for(var i = 0; i < this.containedElements.length; i++){
                if(this.containedElements[i].type == "Queue"){
                    availableComponents.push(this.containedElements[i]);
                    success = true;
                }
            }
        }
        if(success){
            var numberAvailable = availableComponents.length;
            var randomValue =  Math.floor(Math.random() * numberAvailable);
            availableComponents[randomValue].acceptTask(task);
            var assignedComponent = this.objectIndices[availableComponents[randomValue].identifier];
            assignedComponent.task = task;
            this.visual.placeTask(task.identifier, assignedComponent.identifier);
        }
        if (!success){
            this.demandedTasks.push(task);
        }
    }
    toTable(){
        var output = "";
        this.containedElements.forEach(element => {
            output += element.toTable();
        });
        return output;
    }
    checkAvailability(){
        var success = false;
        for(var i = 0; i < this.containedElements.length; i++){
            if(this.containedElements[i].checkAvailability()){
                success = true;
                i = this.containedElements.length;
            }
        }
        return success;
    }
}

class WorkstationComponent extends ServiceComponent{
    constructor(identifier, distribution){
        super(identifier, distribution);
        var workstationTask = new Task(identifier + "|task", currentTime);
        this.assignedTask  = workstationTask;
        this.task = workstationTask;
        this.type = "Workstation";
        this.lastGeneratedServiceTime = 0;
        this.userHeadings=["Identifier", "Utilization", "Think Time", "SD Think Time", "Jobs Submitted"];
        this.setResultIndices();
    }
    acceptTask(task){
        this.task = task;
        //Generate Random Service Time Based on Distribution

        this.lastGeneratedServiceTime = this.distribution.generate();
        this.updateComponentData(this.lastGeneratedServiceTime);
        this.timeNextEvent = this.lastGeneratedServiceTime + currentTime;
        this.available = false;
        this.model.addEvent(this);

        //UPDATE GENERAL INFORMATION
        if(currentTime != 0){
            cumulativeResponseTime += task.getRunTime();
            responseTimeCumulativeDeviation += task.getRunTime() * task.getRunTime();
            tasksCompleted++;
            task.creationTime = currentTime;
        }
        //Return Information Regarding Next Event for This Object
        return {"component": this.identifier, "time": this.timeNextEvent, "task": task};
    }
}

class ParallelWorkstationComponent extends ParallelComponent{
    constructor(identifier, distribution, numberOfElements, model){
        super(identifier, WorkstationComponent, distribution, numberOfElements, model);
        this.assignedTaskMapping = {};
        this.setAssignedTasks();
    }
    setAssignedTasks(){
        this.containedElements.forEach(element => {
            element.assignedTask.identifier = element.identifier + "|task";
            this.assignedTaskMapping[element.task.identifier] = element;  
            element.acceptTask(element.assignedTask);
        });
    }
    getServerFromTask(task){
        return this.assignedTaskMapping[task.identifier];
    }
    checkAvailability(){
        return true;
    }
    acceptTask(task){
        var workstation = this.getServerFromTask(task);
        workstation.acceptTask(task);
        this.visual.placeTask(task.identifier, workstation.identifier);
    }
    setVisualTasks(){
        this.containedElements.forEach(element => {
            this.visual.placeTask(element.task.identifier, element.identifier);
        });
    }
}

class ParallelDiskComponent extends ParallelComponent{
    constructor(identifier, objectType, diskDistributions, diskCount, diskWeights, model){
        super(identifier, objectType, diskDistributions, diskCount, model);
        this.disks = [];
        this.queues = [];
        this.availableComponents = [];
        this.setAdjustedWeights(diskWeights);
    }

    setAdjustedWeights(diskWeights){
        for(var i = 0; i < this.containedElements.length; i++){
            if(this.containedElements[i].type == "Disk"){
                this.disks.push(this.containedElements[i]);
            }
            else{
                this.queues.push(this.containedElements[i]);
                this.availableComponents.push(this.containedElements[i]);
            }
        }      
        var sumOfWeights = 0;
        for(var i = 0; i < diskWeights.length; i++){
            this.disks[i].weight = parseFloat(diskWeights[i]);
            sumOfWeights += this.disks[i].weight;
        }
        
        var weightWatcher = 0;
        for(var i = 0; i < this.disks.length; i++){
            if(this.disks[i].weight == 0){
                this.disks[i].adjustedWeight = 0;
                this.disks[i].randomBoundary = -1;
            }
            else{
                this.disks[i].adjustedWeight = this.disks[i].weight / sumOfWeights;
                weightWatcher += this.disks[i].adjustedWeight;
                this.disks[i].randomBoundary = weightWatcher;
            }
        }
    }
    acceptTask(task){
        var randomValue =  Math.random();
        var assignedComponent = null;
        for(var i = 0; i < this.disks.length && assignedComponent == null; i++){
            if(randomValue < this.disks[i].randomBoundary){
                assignedComponent = this.disks[i];
            }
        }
        assignedComponent.connectedQueue.acceptTask(task);
        this.visual.placeTask(task.identifier, assignedComponent.connectedQueue.identifier);
    }
}

        