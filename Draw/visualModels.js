//Timer For Drawing Update
var timeElapsed = 0;
var currentModel = null;
var delay = false;
var resumeTime = 0;
function createTimer(updateFunction, rate = updateRate){
    return setInterval(updateFunction, rate);
}
function runModel(rate = updateRate){
    currentModel.timerRunning = true;
    currentModel.intervalID = createTimer(tickModel, rate);
}
function tickModel(){
    currentModel.tickOnce();
}
function createFeedbackDelay(){
    delay = true;
    resumeTime = timeElapsed;
    timeElapsed = timeElapsed - feedbackDelayTime*simulationTimeScaling;
}
function createDelay(delayTime, objectName, eventType, task){
    delay = true;
    resumeTime = timeElapsed
    timeElapsed = timeElapsed - delayTime*simulationTimeScaling;
    var event = {
        "object": currentModel.components[objectName],
        "time": timeElapsed,
        "type": eventType,
        "task": task,
        "simulationObject": currentSimulation.components[objectName],
        "delay": true
    }
    currentModel.events.unshift(event);
}
function createEvent(simulationObject, time, eventType, taskIdentifier = null){
    if(simulationMode !== true){
        var object, time, task = taskIdentifier;
        object = this.components[simulationObject.identifier];
        time = time;
        eventType = eventType;
        if(taskIdentifier != null){
            if(this.tasks[taskIdentifier] != undefined){
                task = this.tasks[taskIdentifier];
            }
            else {
                this.createVisualTask(taskIdentifier, object);
                task = this.tasks[taskIdentifier];
            }
        }
        var event = {
            "object": object,
            "time": time,
            "type": eventType,
            "task": task,
            "simulationObject": simulationObject
        }
        this.addEvent(event);
    }

} 
/*********************************************************************
 *  Contains Functions to Create the Visual Component of Models
 ********************************************************************/
class ModelVisual {
    constructor(identifier){
        currentModel = this;
        this.identifier = identifier;
        this.components = {};
        this.tasks = {};
        this.events = [];
        this.drawnConnections = [];
        this.intervalID = null;
        this.timerRunning = false;
    }
    reset(){
        this.events = [];
        this.tasks = {};
        for(const key in this.components){
            this.components[key].reset();
        }
        timeElapsed = currentTime;
    }

    startTimer(){
        if(this.intervalID == null)
            this.intervalID = runModel(this);
    }
    stopTimer(){
        if(this.intervalID !== null){
            clearInterval(this.intervalID);
        }
        this.intervalID = null;
    }
    addComponent(visualObject){
        this.components[visualObject.identifier] = visualObject;
        if(visualObject.containedElements !== undefined){
            for(var i = 0; i < visualObject.containedElements.length; i++ ){
                if(Array.isArray(visualObject.containedElements[i])){
                    for(var j = 0; j < visualObject.containedElements[i].length; j++)
                        this.components[visualObject.containedElements[i][j].identifier] = visualObject.containedElements[i][j];
                } 
                else{    
                    this.components[visualObject.containedElements[i].identifier] = visualObject.containedElements[i];
                }
            }
        }
        if(visualObject.containedElements !== undefined){
            for(var i = 0; i < visualObject.containedElements.length; i++ ){
               
            }
        }
    }
    setNext(first, second){
        first.setNext(second);
    }
    connectQueue(object, queue){
        object.setConnection(queue);
    }
    addEvent(event){
        this.events.push(event);
    }
    addTask(task){
        this.tasks[task.identifier] = task;
    }
    addDrawnConnection(itemOne, itemTwo, connectFunction){
        this.drawnConnections.push({"arguments": [itemOne, itemTwo], "function": connectFunction});
    }
    callConnectionFunction(connection){
        connection.function(...connection.arguments);
    }
    removeTask(task){
        delete this.tasks[task.identifier];
    }
    processEvent(){
        if(delay == true){
            return;
        }
        if(this.events.length > 0){
            if(this.events[0].type == "accept"){
                this.events[0].object.acceptTask(this.events[0].task);
                this.events.shift();
            }
            else if (this.events[0].type == "advance"){
                this.events[0].object.advanceTask(this.events[0].task);
                this.events.shift();
            }   
        }
    }
    tickOnce(){
        timeElapsed += timePerTick * simulationTimeScaling;
        if(this.events.length > 0 && this.events[0].time <= timeElapsed){
                if(this.events[0].type == "accept"){
                    this.events[0].object.acceptTask(this.events[0].task);
                    this.events.shift();
                }
                else if (this.events[0].type == "advance"){
                    this.events[0].object.advanceTask(this.events[0].task);
                    this.events.shift();
                }   
        }
        this.draw();
    }
    createEvent(simulationObject, time, eventType, taskIdentifier = null){
        if(simulationMode !== true){
            var object, time, task = taskIdentifier;
            object = this.components[simulationObject.identifier];
            time = time;
            eventType = eventType;
            if(taskIdentifier != null){
                if(this.tasks[taskIdentifier] != undefined){
                    task = this.tasks[taskIdentifier];
                }
                else {
                    this.createVisualTask(taskIdentifier, object);
                    task = this.tasks[taskIdentifier];
                }
            }
            var event = {
                "object": object,
                "time": time,
                "type": eventType,
                "task": task,
                "simulationObject": simulationObject
            }
            this.addEvent(event);
        }

    } 
    createVisualTask(taskIdentifier, initialObject){
        var x = initialObject.connections.start.x;
        var y = initialObject.connections.start.y;
        this.addTask(createVisualTask(x,y, taskIdentifier));
        return this.tasks[taskIdentifier];
    }
    draw(){
        drawCanvas();
        //Draw Base Components
        for(const key in this.components){
            if(this.components.hasOwnProperty(key)){
                this.components[key].draw();
            }
        }
        //Draw Connections
        this.drawnConnections.forEach(connection => {
            this.callConnectionFunction(connection);
        });

        //Draw Tasks
        for (const key in this.tasks){
            if(this.tasks.hasOwnProperty(key)){
                this.tasks[key].draw();
            }
        }
    }
}
var xCenter = canvasWidth/2;
var yCenter = canvasHeight/2;

class SingleServerVisualModel extends ModelVisual{
    constructor(){
        super("Single Server");
        
        //Adjust Size
        if(numberSlotsInQueue > 20){
            canvasScalingX = (canvasWidth + queueSlotSize*(numberSlotsInQueue - 20))/canvasWidth;
            canvasWidth = canvasWidth * canvasScalingX;
        }

        let x = (xCenter -(QueueVisual.width + ServerVisual.width)/2) / 2;
        let y = canvasHeight/2 - ServerVisual.height/2;

        //Set Up Base Components
        let queue = new QueueVisual(x + horizontalSpacing,y,"Queue");
        let server = new ServerVisual(x + QueueVisual.width + 2*horizontalSpacing, y, "Server");
        let entryPoint = new EntrancePoint(x - horizontalSpacing, y, "Arrivals");    
        let exitPoint = new ExitPoint(server.connections.end.x + 2*horizontalSpacing, y);

        //Add Components to the Model
        this.addComponent(entryPoint);
        this.addComponent(queue);
        this.addComponent(server);
        this.addComponent(exitPoint);

        //Link Components Together
        this.setNext(entryPoint, queue);
        this.setNext(queue, server);
        this.setNext(server, exitPoint);
        this.setNext(exitPoint, null);
        server.setConnection(queue);
        
        //Drawn Paths
        this.addDrawnConnection(entryPoint, queue, connectArrow);
        this.addDrawnConnection(queue, server, connectArrow);
        this.addDrawnConnection(server, exitPoint, connectArrow);
    }
}

class SingleFeedbackVisualModel extends ModelVisual{
    constructor(){
        super("Single Server With Feedback");
        
        //Adjust Size
        if(numberSlotsInQueue > 20){
            canvasScalingX = (canvasWidth + queueSlotSize*(numberSlotsInQueue - 20))/canvasWidth;
            canvasWidth = canvasWidth * canvasScalingX;
        }

        let drawX = (xCenter -(QueueVisual.width + ServerVisual.width)/2) / 2 + horizontalSpacing;
        let drawY = canvasHeight/2 + verticalSpacing/2;

        var startX =  (xCenter -(QueueVisual.width + ServerVisual.width)/2) / 2;
        var offset = 15;

        var serverOneQueue = new QueueVisual(drawX, drawY, "Queue");
        drawX += horizontalSpacing + QueueVisual.width;
        var serverOne = new FeedbackServerVisual(drawX,drawY, "Server");

        var boundaries = {
            "bottomRight" : new VisualAnchor( serverOne.connections.end.x - ServerVisual.width/2, serverOne.connections.end.y - ServerVisual.height/2),
            "topRight" : new VisualAnchor(serverOne.connections.end.x - ServerVisual.width/2, serverOne.connections.end.y - ServerVisual.height/2 - verticalSpacing),
            "topLeft" : new VisualAnchor(startX, serverOne.connections.end.y - verticalSpacing - ServerVisual.height/2),
            "bottomLeft" : new VisualAnchor(startX, serverOneQueue.connections.start.y - offset),
            "exitConnection" : new ExitPoint(serverOne.connections.end.x + horizontalSpacing*3, serverOne.connections.end.y)
        };
        var arrowUp = new VisualAnchor(boundaries.bottomRight.coordinates.x, serverOne.connections.end.y - verticalSpacing/2 - ServerVisual.height/2); 
        var mergeBottom = new VisualAnchor(serverOneQueue.connections.start.x, drawY + offset);
        var mergeTop = new VisualAnchor(serverOneQueue.connections.start.x, drawY - offset);
        var entrance = new EntrancePoint(startX - horizontalSpacing, drawY + offset, "Arrivals");

        //Add Components
        this.addComponent(serverOneQueue);
        this.addComponent(serverOne);
        this.addComponent(entrance);
        this.addComponent(boundaries.exitConnection);
        serverOne.setConnection(serverOneQueue);

        //Set Next
        this.setNext(entrance, mergeBottom);
        this.setNext(mergeBottom, serverOneQueue);
        this.setNext(serverOneQueue, serverOne);
        this.setNext(serverOne, boundaries.bottomRight);
        serverOne.connectExit(boundaries.exitConnection);


        this.setNext(boundaries.bottomRight, boundaries.topRight);
        this.setNext(boundaries.topRight, boundaries.topLeft);
        this.setNext(boundaries.topLeft, boundaries.bottomLeft);
        this.setNext(boundaries.bottomLeft, mergeTop);
        this.setNext(mergeTop, serverOneQueue);

        //Drawn Connections
        this.addDrawnConnection(boundaries["bottomRight"], arrowUp, connectArrow);
        this.addDrawnConnection(boundaries["bottomLeft"], mergeTop, connectArrow);
        this.addDrawnConnection(entrance, mergeBottom, connectArrow);
        this.addDrawnConnection(serverOneQueue, serverOne, connectArrow);
        this.addDrawnConnection(boundaries["bottomRight"], boundaries["topRight"], connectLine);
        this.addDrawnConnection(boundaries["topRight"], boundaries["topLeft"], connectLine);
        this.addDrawnConnection(boundaries["topLeft"], boundaries["bottomLeft"], connectLine);
        this.addDrawnConnection(serverOne, boundaries["exitConnection"], connectArrow);
    }
}
class ParallelServersVisualModel extends ModelVisual{
    constructor(serverCount){
        //Adjust Size
        if(numberSlotsInQueue > 20){
            canvasScalingX = (canvasWidth + queueSlotSize*(numberSlotsInQueue - 20))/canvasWidth;
            canvasWidth = canvasWidth * canvasScalingX;
        }
        super("Parallel Servers");
        let x1 = 200;
        let y1 = 400;

        //Set up Components
        let queue = new QueueVisual(x1, y1, "Queue");
        let parallelServers = new ParallelContainer(x1 + horizontalSpacing + QueueVisual.width, y1, "Parallel", ServerVisual, serverCount);
        let entryPoint = new EntrancePoint(queue.connections.start.x - horizontalSpacing*2, y1, "Arrivals");
        let exitPoint = new ExitPoint(parallelServers.connections.end.x + horizontalSpacing*2, y1);
        
        //Add Components to Model
        this.addComponent(entryPoint);
        this.addComponent(queue);
        this.addComponent(parallelServers);
        this.addComponent(exitPoint);


        //Link Components
        this.setNext(entryPoint, queue);
        this.setNext(queue, parallelServers);
        this.setNext(parallelServers, exitPoint);
        //this.setNext(exitPoint, null);
        parallelServers.connectQueue(queue);

        //Drawn Paths
        this.addDrawnConnection(entryPoint, queue, connectArrow);
        this.addDrawnConnection(queue, parallelServers, connectArrow);
        this.addDrawnConnection(parallelServers, exitPoint, connectArrow);

        //Adjust Size
    }

}
class TwoServersVisualModel extends ModelVisual{
    constructor(){
        super("Two Servers");
        let x1 = 400;
        let y1 = 400;

        //Set up Components
        let queue = new QueueVisual(x1, y1, "Queue");
        let twoServers = new ParallelContainer(x1 + horizontalSpacing + QueueVisual.width, y1, "Parallel", ServerVisual, 2);
        let entryPoint = new EntrancePoint(queue.connections.start.x - horizontalSpacing*2, y1, "Arrivals");
        let exitPoint = new ExitPoint(twoServers.connections.end.x + horizontalSpacing*2, y1);
    
        //Add Components to Model
        this.addComponent(entryPoint);
        this.addComponent(queue);
        this.addComponent(twoServers);
        this.addComponent(exitPoint);

        //Link Components
        this.setNext(entryPoint, queue);
        this.setNext(queue, twoServers);
        this.setNext(twoServers, exitPoint);
        //this.setNext(exitPoint, null);
        twoServers.connectQueue(queue);

        //Drawn Paths
        this.addDrawnConnection(entryPoint, queue, connectArrow);
        this.addDrawnConnection(queue, twoServers, connectArrow);
        this.addDrawnConnection(twoServers, exitPoint, connectArrow);

        //Adjust Size
    }
}

class InteractiveVisualModel extends ModelVisual{
    constructor(numberWorkstations, numberServers){
        super("Interactive Workstations");
        
        //Coordinates
        var yMain = 450;
        var xStart = 50;
        var yTop = 100;
     
        var stationCoord = {"x": 200, "y": yMain};
        var queueCoord = {"x": stationCoord.x + WorkstationVisual.width + horizontalSpacing*2, "y": yMain};
        var serverCoord = {"x": queueCoord.x + QueueVisual.width + horizontalSpacing, "y": yMain};
        var xEnd = serverCoord.x + horizontalSpacing*2 + ServerVisual.width;
        var visualAnchors = {};  
        var anchorCoords = [
            { "name": "botLeft", "x": xStart, "y": yMain},
            { "name": "botRight", "x": xEnd, "y": yMain},
            { "name": "topRight", "x": xEnd, "y": yTop},
            { "name": "topLeft", "x": xStart, "y": yTop}
        ];
        
        anchorCoords.forEach(element => {
            var name = element.name;
            visualAnchors[name] = new VisualAnchor(element.x, element.y);
        });
        
        //Main Components
        var workstationsParallel = new ParallelContainer(stationCoord.x, stationCoord.y, "Parallel", WorkstationVisual, numberWorkstations);
        var serversQueue = new QueueVisual(queueCoord.x, queueCoord.y, "Queue");
        var serversParallel = new ParallelContainer(serverCoord.x, serverCoord.y, "Servers", ServerVisual, numberServers);
    

        //Add Components
        this.addComponent(workstationsParallel);
        this.addComponent(serversQueue);
        this.addComponent(serversParallel);
    
        //Link Components
        this.setNext(visualAnchors["botLeft"], workstationsParallel);
        this.setNext(workstationsParallel, serversQueue);
        this.setNext(serversQueue, serversParallel);
        this.setNext(serversParallel, visualAnchors["botRight"]);
        this.setNext(visualAnchors["botRight"], visualAnchors["topRight"]);
        this.setNext(visualAnchors["topRight"], visualAnchors["topLeft"]);
        this.setNext(visualAnchors["topLeft"], visualAnchors["botLeft"]);
        serversParallel.connectQueue(serversQueue);   
        
        //Add Drawn Paths
        this.addDrawnConnection(workstationsParallel, serversQueue, connectArrow);
        this.addDrawnConnection(serversQueue, serversParallel, connectArrow);
        this.addDrawnConnection(visualAnchors["botLeft"], workstationsParallel, connectArrow);
        this.addDrawnConnection(serversParallel, visualAnchors["botRight"], connectLine);
        this.addDrawnConnection(visualAnchors["botRight"], visualAnchors["topRight"], connectLine);
        this.addDrawnConnection(visualAnchors["topRight"], visualAnchors["topLeft"], connectLine);
        this.addDrawnConnection(visualAnchors["topLeft"], visualAnchors["botLeft"], connectLine);
    }
}

class CentralServerVisualModel extends ModelVisual{
    constructor(numberDisks, coreCount){
        super("Central Server");
        //Adjust Size
        if(numberSlotsInQueue > 10 || true){
            canvasScalingX = (canvasWidth + 2*queueSlotSize*(numberSlotsInQueue - 10))/canvasWidth;
            canvasWidth = canvasWidth * canvasScalingX + horizontalSpacing;
        }
        
        var neededVerticalSpace = (parseFloat(numberDisks) + parseFloat(coreCount))*parseFloat(parallelSpacingVertical) + parseFloat(verticalSpacing);
        canvasHeight = canvasHeight > neededVerticalSpace ? canvasHeight : neededVerticalSpace;
        var cpuHeight = (parallelSpacingVertical/2+ serverRadius)*coreCount;
        canvasWidth = canvasWidth + 500;
        var diskHeight = numberDisks * (parallelSpacingVertical) ;
        var diskWidth = QueueVisual.width + horizontalSpacing + 2*parallelSpacingHorizontal +  ServerVisual.width;
        var verticalGap = verticalSpacing/2;
        var modelHeight = diskHeight + verticalGap + cpuHeight;
        var modelWidth = 2*QueueVisual.width + 6*horizontalSpacing  + 2*ServerVisual.width;
        
        //Coordinates
        var middleY = canvasHeight/2;
        var middleX = canvasWidth/2;
        var xStart = middleX - modelWidth/2;
        var xEnd = middleX + modelWidth/2;
        var yTop = middleY - modelHeight/2 + cpuHeight/2;
        var yBot = middleY + modelHeight/4;
        
        //DISK
        var disksY = yBot;
        var disksX = xStart + diskWidth/2;
        
        //Channel
        var channelX = xEnd - horizontalSpacing - ServerVisual.width;
        var channelY = yTop;
        var channelQueueX = channelX - horizontalSpacing - QueueVisual.width;
        var channelQueueY = yTop;

        //CPU
        var centralQueueX = xStart + horizontalSpacing;
        var centralQueueY = yTop;
        var centralServerX = xStart + horizontalSpacing*2 + QueueVisual.width;
        var centralServerY = yTop;
        
        //Anchors
        var topRight = new VisualAnchor(xEnd, yTop);
        var bottomRight = new VisualAnchor(xEnd, yBot);
        var topLeft = new VisualAnchor(xStart, yTop);
        var bottomLeft = new VisualAnchor(xStart, yBot);
        var bottomArrow = new VisualAnchor( disksX  + diskWidth +(xEnd - disksX - diskWidth)/2, yBot);
        //Components
        var disksParallel = new ParallelContainer(disksX, disksY, "Parallel", [QueueVisual, DiskVisual], numberDisks);
        var centralQueue = new QueueVisual(centralQueueX, centralQueueY, "Processor Queue");

        var centralProcessor = new ParallelContainer(centralServerX, centralServerY, "Central Processor", ServerVisual, coreCount)
        //var centralProcessor = new ServerVisual(centralServerX, centralServerY, "Central Processor");
        var channelQueue = new QueueVisual(channelQueueX, channelQueueY, "Channel Queue");
        var channel = new ServerVisual(channelX, channelY, "Channel");

        //Reverse Top Components
        disksParallel.reverseDrawing();
        
        //Add Components to Model
        this.addComponent(disksParallel);
        this.addComponent(centralQueue);
        this.addComponent(centralProcessor);
        this.addComponent(channelQueue);
        this.addComponent(channel);
        
        //Set Next
        this.setNext(topLeft, centralQueue);
        this.setNext(centralQueue, centralProcessor);
        this.setNext(centralProcessor, channelQueue);
        this.setNext(channelQueue, channel);
        this.setNext(channel, topRight);
        this.setNext(topRight, bottomRight);
        this.setNext(bottomRight, disksParallel);
        this.setNext(disksParallel, bottomLeft);
        this.setNext(bottomLeft, topLeft);
       
        //Connect Queues
        centralProcessor.connectQueue(centralQueue); 

        channel.setConnection(channelQueue); 

        //Drawn Connections
        this.addDrawnConnection(topLeft, centralQueue, connectArrow);
        this.addDrawnConnection(centralQueue, centralProcessor, connectArrow);
        this.addDrawnConnection(centralProcessor, channelQueue, connectArrow);
        this.addDrawnConnection(channelQueue, channel, connectArrow);
        this.addDrawnConnection(channel, topRight, connectArrow);
        this.addDrawnConnection(topRight, bottomRight, connectLine);
        this.addDrawnConnection(bottomRight, disksParallel, connectArrowReverse);
        this.addDrawnConnection(disksParallel, bottomLeft, connectLine);
        this.addDrawnConnection(bottomLeft, topLeft, connectLine);
        
    }
    displayResults(){};
}
