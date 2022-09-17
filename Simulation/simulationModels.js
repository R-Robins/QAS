var maxTasks = 1000;
var maxEvents = 10000;
var maxQueueSize = 500;


class Simulation{
    constructor(identifier, model, maximumEvents, maximumTasks){
        this.identifier = identifier;
        this.maximumEvents = maximumEvents;
        this.maximumTasks = maximumTasks;
        this.model = model;
        this.tableOutputs = [];
    }
    processEvent(){
        this.model.processEvent();
    }
    runNumberOfEvents(eventCount){
        for(var i = 0; i < eventCount; i++){
            this.processEvent();
        }
    }
    runSimulation(){
        while(this.model.eventsProcessed < eventsToRun && tasksCompleted < maximumTasks){
            this.processEvent();
        }
    }
}
class Model{
    constructor(identifier){
        this.identifier = identifier;
        this.components = {};
        this.events = [];
        this.eventsProcessed = 0;
        this.visualModel = null;
        this.enableVisualization = true;

        /***************************************** 
        //Results
        *****************************************/
        this.throughput = 0;
        this.throughputDeviation = 0;
        this.throughputCumulativeDeviation = 0;
        this.responseTime = 0;
        this.responseTimeDeviation = 0;
        this.responseTimeCumulativeDeviation = 0;
        this.userHeadings = ["Identifier", "Mean Response Time",  "SD Response Time", "Throughput", "Jobs Completed", "Events Processed"];
        this.userData = [this.identifier, this.responseTime, this.responseTimeDeviation, this.throughput, tasksCompleted, this.eventsProcessed];
        
        
        /***************************************** 
        //Graphing Information
        *****************************************/
        /*
            var sampleInformation = {
                "id": "one",
                "object": "ONE",
                "label": "One",
                "categories": [1,2,3,4,5,6,7,8,9,10], //NUMBERS FOR COUNT
                "data":       [1,2,3,4,5,4,3,2,1,0],  //FREQUENCY
                "yLabel": "Count",
                "xLabel": "Time"
            }
        */
       this.graphingInformation = {};

        /***************************************** 
        //Organization for user output
        *****************************************/
        this.compByType = {};
        this.resultIndices = {};
        this.selectedResults = [];

    }
    /////////////////////////////////////////////////////////////////////////
    //  Component Management
    /////////////////////////////////////////////////////////////////////////
    addComponent(component){
        this.components[component.identifier] = component;
        component.model = this;

        if(this.compByType[component.type] === undefined){
            this.compByType[component.type] = [];
        }
        this.compByType[component.type].push(component);
    }
    setNext(first, second){
        first.setNext(second);
    }
    linkComponent(first, second){
        second.setConnection(first);
    }

    /////////////////////////////////////////////////////////////////////////
    //  Event Management
    /////////////////////////////////////////////////////////////////////////
    addEvent(target){
        this.events.push(target);
        this.events = this.events.sort((a, b) => a.timeNextEvent > b.timeNextEvent ? 1 : -1);
    }
    updateEvent(target){
        var index = this.events.findIndex(target);
        if(index == -1)
            this.addEvent(target);
        else{
            this.events[index].timeNextEvent = target.timeNextEvent;
            this.events = this.events.sort((a, b) => a.timeNextEvent > b.timeNextEvent ? 1 : -1);
        }
    }
    //runs the event
    processEvent(){
        var target = this.events.shift();
        //update visual component
        if(this.enableVisualization){
            this.updateVisual(target);
        }

        //Advance the simulation
        currentTime = target.timeNextEvent;
        target.advanceTask();
        this.eventsProcessed++;
    }
    getNextEventTime(){
        if(this.events.length > 0)
            return this.events[0].timeNextEvent;
        else return null;
    }
    /////////////////////////////////////////////////////////////////////////
    //  Graphing Components
    /////////////////////////////////////////////////////////////////////////
    addGraphingInformation(newInformation){
        this.graphingInformation[`${newInformation}`.id] = newInformation;
    }
    initializeGraphingInformation(){
        for(var key in this.components){
            if(this.components[`${key}`].canGraph){   
                this.graphingInformation[`${key}`] = this.components[`${key}`].graphingInformation;
                this.graphingInformation[`${key}`].id = this.graphingInformation[`${key}`].object.identifier;
                this.graphingInformation[`${key}`].label = this.graphingInformation[`${key}`].object.identifier;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //  Interaction with visual
    /////////////////////////////////////////////////////////////////////////
    copyAllTasks(){
        this.visualModel.reset();
        for(var key in this.compByType){
            if(key != "Queue"){
                var typeArray = this.compByType[key];
                for(var i = 0; i < typeArray.length; i++){
                    typeArray[i].copyTask();
                }
            }
        }
        for(var i = 0; i < this.compByType["Queue"].length; i++){
             this.compByType["Queue"][i].copyTask();
         }
    }
    copyTask(taskIdentifier, destination){
        this.visualModel.createVisualTask(taskIdentifier, destination);
    }
    updateVisual(simulationObject){
        var object, time, type, task;
        time = simulationObject.timeNextEvent;
        type = simulationObject.type == "arrival" ? "accept" : "advance";
        if(simulationObject.task == null){
            console.log("TASK IS NULL FOR: " + simulationObject.identifier);
        }
        task = simulationObject.task.identifier;
        this.visualModel.createEvent(simulationObject,  time, type, task);
    }
    connectVisualModel(visualModel){
        this.visualModel = visualModel;
        for (const key in this.components){
            var component = this.components[key];
            var visualComponent = visualModel.components[component.identifier];
            if(visualComponent != undefined)
                component.visual = visualComponent;
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //  BELOW THIS POINT IS ALL OUTPUT
    /////////////////////////////////////////////////////////////////////////
    setResultIndices(){
        for(var i = 1; i < this.userHeadings.length; i++){
            this.resultIndices[this.userHeadings[i]] = i;
        }
    }
    setSelectedResults(selectedResults){
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
            data = outputNumber(this.getResult(label));
            output += generateLabeledRow(label, data);
        }
        return output;
    }
    getSelectedTable(){
        var output = "";
        var label;
        var data;
        for(var i = 0; i < selectedResults.length; i++){
            label = selectedResults[i];
            data = this.getResult(label);
            output += generateLabeledRow(label, data);
        }
        return output;
    }
    getDataResults(resultNames){
        var output = "";
        var results = [];
        for(var i = 0; i < resultNames.length; i++){
            results.push(this.getResult(resultNames[i]));
        }
        return generateTableData(results);
    }
    getHeadings(headingNames){
        return generateTableHeadings(headingNames);
    }
    getResult(resultName){
        return this.userData[this.resultIndices[resultName]];
    }
    toTable(){
        var tableHeadings = ["Identifier", "Contained Events"];
        
        var events = "";

        this.events.forEach(element => {
            events += element.identifier + ": " + element.timeNextEvent + " | ";
        });
         
        var tableData = [this.identifier, events];

        var output = "<tr>";
        tableHeadings.forEach(element => {
            output += `<th>${element}</th>`;
        });
        output += "</tr><tr>"
        tableData.forEach(element => {
            output += `<td>${element}</td>`;
        });
        output += "</tr>";
        
        return output;
    }
    componentsToTable(){
        var output = "";
        for(const key in this.components){
            output += this.components[key].toTable();
        }
        return output;
    }
    getUserData(){
        var output = "";
        for(const key in this.components){
            output += this.components[key].userDataToTable();
        }
        return output;
    }
    getTitle(){
        return this.toTable();
    }
    getResults(){
        return this.componentsToTable();
    }
    displayResults(){
        return this.displayResultsByType();
    }
    displayResultsByType(){
        var output = `<table>`;
        output += this.userOutputTable();
        output += `</table>`;
        for(const key in this.compByType){
            for(var i = 0; i < this.compByType[key].length; i++){
                output+= `<table>`
                var temp = this.compByType[key][i].userOutputTable();
                if (temp != undefined) 
                    output += `<table> ${temp} </table>`;
            }
            
        }
        return output + `</table>` + `<div></div>`;
    }  
    userOutputTable(){
        this.updateUserData();
        if(this.userData !== undefined)
            return generateOutputTables(this.userHeadings, this.userData);
    }
    userHeadingsToTable(){
        return generateTableHeadings(this.userHeadings);
    }
    userDataToTable(){
        this.updateUserData();
        if(this.userData !== undefined)
            return generateTableData(this.userData);
        else
            console.log("User data for: " + this.identifier + " is undefined");
        return "";
    }
    updateUserData(){
        this.responseTime = cumulativeResponseTime / tasksCompleted;
        this.throughput = tasksCompleted / currentTime;
        this.responseTimeDeviation = Math.sqrt(responseTimeCumulativeDeviation/tasksCompleted - this.responseTime*this.responseTime);
        this.userData = [this.identifier, this.responseTime.toFixed(2), this.responseTimeDeviation.toFixed(2), this.throughput.toFixed(3), tasksCompleted, this.eventsProcessed];
    }   
}
class SingleServerModel extends Model{
    constructor(arrivalDistribution, serverDistribution){
        super("Single Server");
    
        //Create Components For Model
        var arrivalComponent = new ArrivalComponent("Arrivals", arrivalDistribution);
        var queueComponent = new QueueComponent("Queue");
        var serverComponent = new ServiceComponent("Server", serverDistribution);
        var exitComponent = new ExitComponent("Exit");

        //Add Components to the Model
        this.addComponent(arrivalComponent);
        this.addComponent(queueComponent);
        this.addComponent(serverComponent);
        this.addComponent(exitComponent);

        //Link Components
        this.setNext(arrivalComponent, queueComponent);
        this.setNext(queueComponent, serverComponent);
        serverComponent.connectQueue(queueComponent);
        this.setNext(serverComponent, exitComponent); 

        //Set Initial Event
        arrivalComponent.generateNextArrival();
    }
}
class ParallelServersModel extends Model{
    constructor(arrivalDistribution, serverDistributions, serverCount){
        super("Parallel Servers");

        //Create Model Components
        var arrivalComponent = new ArrivalComponent("Arrivals", arrivalDistribution);
        var queueComponent = new QueueComponent("Queue");
        var parallelServers = new ParallelComponent("Parallel", ServiceComponent, serverDistributions, serverCount, this);
        var exitPoint = new ExitComponent("Exit");
        //Add to Model
        this.addComponent(arrivalComponent);
        this.addComponent(queueComponent);
        this.addComponent(parallelServers);
        this.addComponent(exitPoint);

        //Link Components
        this.setNext(arrivalComponent, queueComponent);
        this.setNext(queueComponent, parallelServers);
        parallelServers.connectQueue(queueComponent);
        this.setNext(parallelServers, exitPoint);

        //Initialize Model
        arrivalComponent.generateNextArrival();
    }
    displayResults(){
        var results = [];
        var parallelServersOutput = `<table>`;
       // parallelServersOutput += generateTableHeadings(["Parallel Servers Model"]);
        parallelServersOutput += this.userOutputTable();
        parallelServersOutput += `</table>`;
        var arrivalOutput = "<table>" + this.components["Arrivals"].userOutputTable() + "</table>";

        //OUTPUTS
        var serverOutput =`<table class="title-table"> ${generateTableHeadings(["Servers"])} </table>`;
        serverOutput += `<table class="tiny-table">`;
        serverOutput += generateTinyHeadings(["ID", "U", "S", "SD S"]);
        for(var i = 0; i < this.compByType["Server"].length; i++){
            results = this.compByType["Server"][i].getResultValues(["Utilization", "Mean Service Time", "SD Service Time"]);
            results.unshift(i + 1);
            serverOutput += generateTinyTable(results);
        }
        serverOutput += "</table>";


        var queueOutput = "<table>" + this.components["Queue"].userOutputTable() + "</table>";
        var outputs = [
            parallelServersOutput,
            arrivalOutput,
            queueOutput,
            serverOutput
        ]

        var output = "";
        outputs.forEach(element => {
            output += element;
        });
        return output;
    }
}
class TwoServersModel extends Model{
    constructor(arrivalDistribution, serverDistributions){
        super("Two Servers");

        //Create Model Components
        var arrivalComponent = new ArrivalComponent("Arrivals", arrivalDistribution);
        var queueComponent = new QueueComponent("Queue");
        var parallelServers = new ParallelComponent("Parallel", ServiceComponent, serverDistributions, 2, this);
        var exitPoint = new ExitComponent("Exit");
        //Add to Model
        this.addComponent(arrivalComponent);
        this.addComponent(queueComponent);
        this.addComponent(parallelServers);
        this.addComponent(exitPoint);

        //Link Components
        this.setNext(arrivalComponent, queueComponent);
        this.setNext(queueComponent, parallelServers);
        parallelServers.connectQueue(queueComponent);
        this.setNext(parallelServers, exitPoint);

        //Initialize Model
        arrivalComponent.generateNextArrival();
    }
}
class SingleFeedbackModel extends Model{
    constructor(arrivalDistribution, serverDistribution, feedbackProbability){
       super("Single Server (Feedback)");
        
       //Create Model Components
       var arrivalComponent = new ArrivalComponent("Arrivals", arrivalDistribution);
       var queueComponent = new QueueComponent("Queue");
       var serverComponent = new FeedbackServer("Server", serverDistribution, feedbackProbability);
       var exitPoint = new ExitComponent("Exit");
       
       //Add to Model
       this.addComponent(arrivalComponent);
       this.addComponent(queueComponent);
       this.addComponent(serverComponent);
       this.addComponent(exitPoint);

       //Link Components
       this.setNext(arrivalComponent, queueComponent);
       this.setNext(queueComponent, serverComponent);
       serverComponent.connectQueue(queueComponent);
       this.setNext(serverComponent, queueComponent); 
       serverComponent.connectExit(exitPoint);

       //Initialize
       arrivalComponent.generateNextArrival();
    }
}
class InteractiveModel extends Model{
    constructor( workstationDistribution, workstationCount, serverDistribution, serverCount){
        super("Interactive Model");
        var taskColors = {};
        //Create Model Components
        var parallelWorkstations = new ParallelWorkstationComponent("Parallel", workstationDistribution, workstationCount, this);
        var parallelServers = new ParallelComponent("Servers", ServiceComponent, serverDistribution, serverCount, this);
        var queueComponent = new QueueComponent("Queue");
        //Add to Model
        this.addComponent(parallelWorkstations);
        this.addComponent(parallelServers);
        this.addComponent(queueComponent);

        //Link Components
        this.setNext(parallelWorkstations, queueComponent);
        this.setNext(queueComponent, parallelServers);
        this.setNext(parallelServers, parallelWorkstations);
        parallelServers.connectQueue(queueComponent);        

        this.setResultIndices();
        this.setSelectedResults(["Mean Response Time", "SD Response Time", "Throughput"]);


        createVisualTask = function(x,y, identifier){
            if(taskColors[identifier] == undefined){
                var task = new TaskVisual(x, y, identifier, generateColor());
                taskColors[identifier] = task.color;
                return task;
            }
            else{
                return new TaskVisual(x, y, identifier, taskColors[identifier]);
            }  
        }
    }

    addInitialVisualEvents(){
        if(this.visualModel === null || this.visualModel === undefined){
            console.log("no visual model connected");
        }
        else{
            var workstations = this.components["Parallel"].containedElements;

            for(var i = 0; i < workstations.length; i++){
                this.visualModel.createVisualTask(workstations[i].task.identifier, this.visualModel.components[workstations[i].identifier]);
                var task = this.visualModel.tasks[workstations[i].task.identifier];
                this.visualModel.components[workstations[i].identifier].acceptTask(task);
            }  
            this.components["Parallel"].setVisualTasks();
        }
        
    }
    displayResults(){
        var results = [];
        var interactiveOutput = `<table>`;
        interactiveOutput += generateTableHeadings(["Interactive Systems"]);
        interactiveOutput += this.getSelectedResults();
        interactiveOutput += `</table>`;

        //OUTPUTS
        var workstationOutput =`<table class="title-table"> ${generateTableHeadings(["Workstations"])} </table>`;
        workstationOutput += `<table class="tiny-table">`;
        workstationOutput += generateTinyHeadings(["ID", "U", "Z", "SD Z"]);
        for(var i = 0; i < this.compByType["Workstation"].length; i++){
            results = this.compByType["Workstation"][i].getResultValues(["Utilization", "Think Time", "SD Think Time"]);
            results.unshift(i + 1);
            workstationOutput += generateTinyTable(results);
        }
        workstationOutput += "</table>";
        workstationOutput += `<div >  </br> </div>`;
        
        var queueOutput = "<table>" + this.components["Queue"].userOutputTable() + "</table>";
        
        var serverOutput =`<table class="title-table"> ${generateTableHeadings(["Servers"])} </table>`;
        serverOutput += `<table class="tiny-table">`;
        serverOutput += generateTinyHeadings(["ID", "U", "S", "SD S"]);
        for(var i = 0; i < this.compByType["Server"].length; i++){
            results = this.compByType["Server"][i].getResultValues(["Utilization", "Mean Service Time", "SD Service Time"]);
            results.unshift(i + 1);
            serverOutput += generateTinyTable(results);
        }
        serverOutput += "</table>";

        var outputs = [
            interactiveOutput,
            workstationOutput,
            queueOutput,
            serverOutput
        ]

        var output = "";
        outputs.forEach(element => {
            output += element;
        });
        return output;
    }
}
class CentralServerModel extends Model{
    constructor( centralDistribution, channelDistribution, diskDistributions, diskCount, jobCount, coreCount, diskWeights){
        super("Central Server");
        this.jobCount = jobCount;

        //Create Components
        var centralProcessorQueue = new QueueComponent("Processor Queue");
        var centralProcessor = new ParallelComponent("Central Processor", ServiceComponent, centralDistribution, coreCount, this);
        
        var channelQueue = new QueueComponent("Channel Queue");
        var channel = new ServiceComponent("Channel", channelDistribution);
        var parallelDisks = new ParallelDiskComponent("Parallel", [QueueComponent, DiskComponent], diskDistributions, diskCount, diskWeights, this);

        //Add to Model
        this.addComponent(centralProcessorQueue);
        this.addComponent(centralProcessor);
        this.addComponent(channelQueue);
        this.addComponent(channel);
        this.addComponent(parallelDisks);

        //Link Components
        this.setNext(centralProcessorQueue, centralProcessor);
        this.setNext(centralProcessor, channelQueue);
        this.setNext(channelQueue, channel);
        this.setNext(channel, parallelDisks);
        this.setNext(parallelDisks, centralProcessorQueue);

        centralProcessor.connectQueue(centralProcessorQueue);
        channel.connectQueue(channelQueue);


        //for output
        for(var i = 1; i <= centralProcessor.numberOfElements; i++){
            centralProcessor.objectIndices[`Central Processor Server ${i}`].setSelectedResults( ["Utilization", "Mean Service Time"] );
        }
        for(var i = 1; i <= parallelDisks.numberOfElements; i++){
            parallelDisks.objectIndices[`Parallel Queue ${i}`].setSelectedResults( [ "Mean Queue Length"] );
            parallelDisks.objectIndices[`Parallel Disk ${i}`].setSelectedResults( ["Utilization", "Mean Service Time"] );
        }

        const desiredResults = {
            /*
            "Central Processor": [
                "Utilization",
                "Mean Service Time",
                "SD Service Time"
            ],
            */
            "Processor Queue": [
                "Current Queue Length",
                "Mean Queue Length"
            ],
            "Channel": [
                "Utilization",
                "Mean Service Time",
                "SD Service Time"
            ],
            "Channel Queue": [
                "Current Queue Length"
            ]
        }
        
        for(var key in desiredResults){
            this.components[key].setSelectedResults( desiredResults[key] );
        }
        
        this.setResultIndices();
        this.setSelectedResults(["Mean Response Time",  "SD Response Time", "Throughput"]);
    }
    addInitialEvents(){
        var processorQueue = this.components["Processor Queue"];
        var centralProcessor = this.components["Central Processor"];
        for(var i = 0; i < this.jobCount; i++){
            processorQueue.acceptTask(new Task(`Task ${i}`, 0));
        }
        for(var i = 0; i < centralProcessor.containedElements.length; i++){
            centralProcessor.containedElements[i].copyTask();
        }
      
        currentSimulation.copyAllTasks();
    }
    displayResults(){
        //OUTPUTS
        var centralProcessor = this.components["Central Processor"];
        var centralOutput = "<table>";
        centralOutput += generateTableHeadings(["Central Processor"]);  
        centralOutput += this.components["Processor Queue"].getSelectedResults();
        centralOutput += "</table>";


        var centralResults;
        var coreOutput = `<table class="title-table"> ${generateTableHeadings(["CPU Cores"])} </table>`;
        coreOutput += `<table class="tiny-table">`;
        coreOutput += generateTinyHeadings(["ID", "U", "S"]);
        for(var i = 1; i <= centralProcessor.numberOfElements; i++){
            centralResults = centralProcessor.objectIndices[`Central Processor Server ${i}`].getResultValues(["Utilization", "Mean Service Time"]);
            centralResults.unshift(i);
            coreOutput += generateTinyTable(centralResults);
        }
        coreOutput += "</table>";
        coreOutput += `<div class="tiny-information">   </div>`;
    
        var channelResults;
        var channelOutput = `<table class="title-table"> ${generateTableHeadings(["Channel"])} </table>`;
        channelOutput += `<table class="tiny-table">`;
        channelOutput += generateTinyHeadings(["U", "S", "Q"]);
        channelResults = this.components["Channel"].getResultValues(["Utilization", "Mean Service Time"]);
        channelResults.push(this.components["Channel Queue"].averageQueueLength.toFixed(2));
        channelOutput += generateTinyTable(channelResults);
        channelOutput += "</table>";
        channelOutput += `<div class="tiny-information">   </div>`;

        var parallelDisks = this.components["Parallel"];
        var parallelOutputs =`<table class="title-table"> ${generateTableHeadings(["Disks"])} </table>`;
        parallelOutputs += `<table class="tiny-table">`;
        parallelOutputs += generateTinyHeadings(["ID", "U", "S", "Q"]);
        var results;
        for(var i = 1; i <= parallelDisks.numberOfElements; i++){
            results = parallelDisks.objectIndices[`Parallel Disk ${i}`].getResultValues(["Utilization", "Mean Service Time"]);
            results.unshift(i);
            results.push(parallelDisks.objectIndices[`Parallel Queue ${i}`].getResultValues(["Mean Queue Length"]));
            parallelOutputs += generateTinyTable(results);
        }
        parallelOutputs += "</table>";
        

        var outputs = [
            centralOutput,
            coreOutput,
            channelOutput,
            parallelOutputs
        ]

        var output = "";
        outputs.forEach(element => {
            output += element;
        });
        return output;
    }
}


