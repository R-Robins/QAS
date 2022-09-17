/**************************************************************
* Contains Components Needed To Draw Objects Onto The Canvas
**************************************************************/

//Base drawable object
class DrawableObject {
    constructor(x, y, identifier) {
        this.identifier = identifier;
        this.coordinates = { "x": x, "y": y };
        this.connections = {"start": {"x": x, "y": y}, "end": {"x": x, "y": y}};
        this.previous = null;
        this.next = null;
        this.isAvailable = true;
        this.isReversed = false;
    }
    reset(){
        this.isAvailable = true;
        this.task = null;
    }
    calculateWidth(){
        Math.abs(this.connections.end.x - this.connections.start.x);
    }
    calculateHeight(){
        return undefined;
    }
    setNext(drawableObject){
        this.next = drawableObject;
        if (drawableObject != null) 
            this.next.previous = drawableObject;
    }
    setPrevious(drawableObject){
        this.previous = drawableObject;
        this.previous.next = drawableObject;
    }
    draw (){}; //will be overidden with specific draw function
    
    receiveMessage(message){
        var type = message.type;
        switch(type){
            case "accept":
                this.acceptTask(message);
            case "advance":
                this.advanceTask(message);
            case "receive":
                this.receiveTask(message);    
        }
    }

    acceptTask(task){ //called when available to accept
        this.task = task;
        task.setDestinationObject(this);
    }
    advanceTask(task = this.task){ //moves to next component
        if(this.next != null){
            this.next.acceptTask(task);
            this.task = null;
        }
        else{
            this.task = null;
        }
    }
    receiveTask(task){
        this.advanceTask(task);
    }
    reverseDrawing(){
        var temp = this.coordinates.x;
        this.connections.start.x = this.connections.end.x;
        this.connections.end.x = temp;
        this.isReversed = true;
    }
    checkAvailability(task){
        return this.isAvailable;
    }
}
DrawableObject.width = undefined;
DrawableObject.height = undefined;

/************************************************************
 * Model Components
 ***********************************************************/

 //Visual Element For Tasks
class TaskVisual extends DrawableObject{
    constructor(x,y,identifier, color){
        super(x,y,identifier);
        this.color = color;
        this.visible = true;
        this.destination = {"x": x, "y": y};
        this.movementRate = taskMovementRate;
        this.destinationObject = {};
        this.isMoving = false;
    }
    setDestination(coordinates){
        this.destination.x = coordinates.x;
        this.destination.y = coordinates.y;
        this.isMoving = true;
    }
    move(){
        if (this.destination != this.coordinates && this.isMoving){
           // this.isDrawingSelf = true;
            for(var i = 0; i < taskSteps; i++){
                var dy = this.destination.y - this.coordinates.y;
                var yDirection = dy == 0 ? 0 : dy > 0 ? 1 : -1;
                this.coordinates.y += yDirection*this.movementRate;
                
                dy = this.destination.y - this.coordinates.y;
                if (dy * yDirection < 0){
                    this.coordinates.y = this.destination.y;
                }

                if(dy==0){
                    var dx = this.destination.x - this.coordinates.x;
                    var xDirection = dx == 0 ? 0 : dx > 0 ? 1 : -1;
                    this.coordinates.x += xDirection*this.movementRate;

                    dx = this.destination.x - this.coordinates.x;
                    if (dx * xDirection < 0){
                        this.coordinates.x = this.destination.x;
                    }
                }

                if(dx == 0 && dy == 0){
                    this.isMoving = false;
                    this.arrive();
                }
                /*

                currentModel.drawnConnections.forEach(connection => {
                    currentModel.callConnectionFunction(connection);
                });
                
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(this.coordinates.x, this.coordinates.y, taskRadius, 0, 2*Math.PI);
                context.fill();
                */
            }
           // this.isDrawingSelf = false;
        }
    }

    draw(){
        if(this.isMoving ){//&& this.isDrawingSelf != true){
            this.move();
        }
   
        if (this.isMoving){
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.coordinates.x, this.coordinates.y, taskRadius, 0, 2*Math.PI);
            context.fill();
        }
    }
    setDestinationObject(destinationObject){
        if(destinationObject != null){
            this.destinationObject = destinationObject;
            this.setDestination(destinationObject.connections.start);
        }
    }
    arrive(){
        if(this.destinationObject !== null)
            this.destinationObject.receiveTask(this);
    }
    setCoordinates(coordinates){ 
        this.coordinates.x = coordinates.x; 
        this.coordinates.y = coordinates.y;
    }
    //moveTo(visualElement){visualElement.acceptTask();}
    makeInvisible(){this.visible = false;}
    makeVisible(){this.visible = true;}
}

//Visual Element for Queues
class QueueVisual extends DrawableObject{    
    constructor(x,y,identifier){
        super(x,y,identifier);
        this.connections.start = {"x": x, "y": y}; //start connection point
        this.connections.end = {"x": x + queueSlotSize * numberSlotsInQueue, "y": y}; //right connection point
        this.addQueueSlotVisuals();  
        this.numberTasks = 0;  
        this.tasks = {};
        this.taskOverflow = []; //used to contain tasks greater than amount of slots
        this.tasksWaiting = []; //used to contain tasks that cannot be processed by next component yet
        this.type = "Queue";
        this.readiedTasks = {};
    }
    addQueueSlotVisuals(){ //adds queue slots to queue and labels based on position
        this.queueSlots = [];
        for(let i = numberSlotsInQueue - 1; i >= 0; i--){
            this.queueSlots.push(new QueueSlotVisual(this.coordinates.x + i * queueSlotSize, this.coordinates.y, `${this.identifier}_${i}`, this));
        }
    };
    addTaskIndex(taskIndex){
        if(this.tasks[taskIndex.task.identifier] == undefined)
            this.tasks[taskIndex.task.identifier] = [taskIndex];
        else
            this.tasks[taskIndex.task.identifier].push(taskIndex);
        return taskIndex;
    }
    removeTaskIndex(taskIdentifier){
        if(this.tasks[taskIdentifier] == undefined){
            alert("REMOVING TASK NOT IN INDEX");
        }
        else{
            if(this.tasks[taskIdentifier].length == 1)
                delete this.tasks[taskIdentifier]; 
            else
                this.tasks[taskIdentifier].shift();
        }
    }
    reset(){
        this.numberTasks = 0;
        this.taskOverflow = [];
        this.tasksWaiting = [];
        this.tasks = {};

        for(var i = 0; i < this.queueSlots.length; i++){
            this.queueSlots[i].task = null;
        }
    }
    getTaskByIdentifier(taskIdentifier){
        if(this.tasks[taskIdentifier] == undefined){
            return undefined;
        }
        return (this.tasks[taskIdentifier][0].task);
    }
    acceptTask(task){
        task.setDestinationObject(this);
    }
    receiveTask(task){
        var newTaskIndex = {"assignedSlot": null, "task": task, "server": null};

        if (this.numberTasks  < numberSlotsInQueue) {
            newTaskIndex.assignedSlot = this.numberTasks;            
            this.queueSlots[newTaskIndex.assignedSlot].acceptTask(task); 
            this.addTaskIndex(newTaskIndex);

            if(this.next.checkAvailability(task)){
                this.next.acceptTask(task);
            }
            else
                this.tasksWaiting.push(task);
        }
        else {  //Number of tasks is greater than displayed slots
            this.addTaskIndex(newTaskIndex);
            this.taskOverflow.push(task);
        }
        this.numberTasks++;
        //task.setCoordinates(this.next.connections.start);
    }
    advanceTask(task){ //moves task to next component if present, shifts visual for task in queue slots
        if(this.tasks[task.identifier] == undefined) {
            alert("UNDEFINED TASK ADVANCE");
            stopModel();
            return undefined;
        }
        
        this.shiftQueueSlots(task);
        delete this.readiedTasks[task.identifier];

    }
    shiftQueueSlots(task){
        var currentTaskData = this.tasks[task.identifier][0];
        
        //Remove Shifted Task
        var assignedSlot = currentTaskData.assignedSlot;
        this.numberTasks --;

        //Move the tasks in the queue over
        this.moveTasksInQueue(assignedSlot);
        
        if(this.next.type = "Parallel Block"){
        //Connected component now has an opening, add waiting task to it if available
            if(this.tasksWaiting.length > 0 && this.next.checkAvailability(this.tasksWaiting[0])){
                var shiftedTask = this.tasksWaiting.shift();
               // shiftedTask.isMoving = false;
                this.next.acceptTask(shiftedTask);
                this.next.receiveTask(shiftedTask);
               
            }    
        }
        else{
            if(this.tasksWaiting.length > 0 ){
                var shiftedTask = this.tasksWaiting.shift();
                shiftedTask.ismoving = false;
                if(shiftedTask.isMoving == false){
                    this.next.acceptTask(shiftedTask);
                    this.next.receiveTask(shiftedTask);
                }
                else{

                }
                //this.next.acceptTask(shiftedTask);
                //this.next.receiveTask(shiftedTask);
                
            }    
        }
 

        //Handle tasks that cannot fit into the queue
        this.processOverflow();
    }
    moveTasksInQueue(index){
        //Move Items in Queue Over
        this.removeTaskIndex(this.queueSlots[index].task.identifier);
        this.queueSlots[index].task = null;

        for(var i = index; i < numberSlotsInQueue - 1; i++){
            if(this.queueSlots[i+1].task != null){        
                this.queueSlots[i].task = (this.queueSlots[i+1].task);
                this.removeTaskIndex(this.queueSlots[i+1].task.identifier);
                this.addTaskIndex({"task": this.queueSlots[i].task, "assignedSlot": i, "server": null});

                if(this.readiedTasks[this.queueSlots[i].task.identifier] == undefined){
                    this.queueSlots[i].isDrawingTask = true;
                 //   this.readiedTasks[this.queueSlots[i].task.identifier] = true;
                    this.queueSlots[i].acceptTask(this.queueSlots[i].task);
                }
            }
            else {
                this.queueSlots[i].task = null;
            }
            this.queueSlots[i+1].task = null;

        }             
        
  
            
        
    }
    processOverflow(){
        //If any items in overflow add to last slot.
        if(this.taskOverflow.length > 0){
            var overflowTask = this.taskOverflow.shift();
            var newTaskIndex = {"assignedSlot": numberSlotsInQueue - 1, "task": overflowTask, "server": null};
            this.removeTaskIndex(overflowTask.identifier);
            this.addTaskIndex(newTaskIndex);
            this.queueSlots[newTaskIndex.assignedSlot].acceptTask(overflowTask); 

//            this.queueSlots[newTaskIndex.assignedSlot].task = overflowTask;
  //          this.readiedTasks[overflowTask] = true;
    
            
            if(this.next.checkAvailability(overflowTask))
                this.next.acceptTask(overflowTask);
            else this.tasksWaiting.push(overflowTask);
        }  
    }
    updateQueueSlotLocations(){
        var xCoordinate = this.coordinates.x; 
        for (let i = numberSlotsInQueue-1; i >= 0; i--){
            this.queueSlots[i].coordinates.x = xCoordinate;
            this.queueSlots[i].connections.start.x = xCoordinate;
            xCoordinate += queueSlotSize;
            this.queueSlots[i].connections.end.x = xCoordinate;
        }
    }
    draw(){
        for (let i = 0; i < numberSlotsInQueue; i++){
            this.queueSlots[i].draw()
        }
    }
    reverseDrawing(){
        var temp = this.connections.start.x;
        this.connections.start.x = this.connections.end.x;
        this.connections.end.x = temp;

        var tempCoordinates; 
        var tempConnections; 
        for (let i = 0; i < numberSlotsInQueue/2; i++){
            tempCoordinates = this.queueSlots[i].coordinates;
            this.queueSlots[i].coordinates = this.queueSlots[numberSlotsInQueue - 1 - i].coordinates;
            this.queueSlots[numberSlotsInQueue - 1 - i].coordinates = tempCoordinates;

            tempConnections = this.queueSlots[i].connections;
            this.queueSlots[i].connections = this.queueSlots[numberSlotsInQueue - 1 - i].connections;
            this.queueSlots[numberSlotsInQueue - 1 - i].connections = tempConnections;
        }
        for (let i = 0; i < numberSlotsInQueue; i++){
            this.queueSlots[i].connections.start.x += queueSlotSize / 2 ;
        }
        this.isReversed = true;
    }
    slotReceive(taskIdentifier){
        var slot =  this.queueSlots[this.tasks[taskIdentifier][0].assignedSlot];
        var task = this.tasks[taskIdentifier][0].task;
        if(slot !== undefined && slot !== null){
            task.isMoving = false;
            slot.receiveTask(task);
            //task.setCoordinates(this.queueSlots[slot].connections.start);
            //task.coordinates.x += queueSlotSize;
        }
    }
}

QueueVisual.width = queueSlotSize * numberSlotsInQueue;
QueueVisual.height = QueueVisual.width;
QueueVisual.type = "Queue";

//Visual Element for Queue Slots
class QueueSlotVisual extends DrawableObject{
    constructor(x,y,identifier, queue){
        super(x,y,identifier);
        this.connections.start = {"x": x + queueSlotSize / 2, "y": y};
        this.connections.end = {"x": x + queueSlotSize, "y": y};
        this.task = null;
        this.type = "Queue Slot";
        this.isDrawingTask = false;
        this.queue = queue;
    }
    moveTask(task){
        this.task = task;
        this.task.destinationObject = null;
        this.isDrawingTask = true;
    }
    acceptTask(task){    
        this.isDrawingTask = false;
        this.task = task;
        task.setDestinationObject(this);
    }
    receiveTask(task){
        this.isDrawingTask = true;
        this.draw();
        this.queue.readiedTasks[task.identifier] = true;
        
        this.queue.next.receiveTask(task);    
    }
    draw(){
        context.fillStyle = backgroundColor
        context.fillRect(this.coordinates.x, this.coordinates.y - queueSlotSize/2, queueSlotSize, queueSlotSize);
        context.strokeRect(this.coordinates.x, this.coordinates.y - queueSlotSize/2, queueSlotSize, queueSlotSize);
       
        if(this.task !== null && this.isDrawingTask == true){
            context.fillStyle = this.task.color;
            context.beginPath();
            context.arc(this.coordinates.x + queueSlotSize/2, this.coordinates.y, taskRadius, 0, 2*Math.PI);
            context.fill();
        }
    }
}
QueueSlotVisual.width = queueSlotSize;
QueueSlotVisual.height = queueSlotSize;
QueueSlotVisual.type = "Queue Slot";

//Visual Element for Servers
class ServerVisual extends DrawableObject{
    constructor(x,y, identifier){
        super(x,y,identifier);
        this.connections.start = {"x": x, "y": y};
        this.connections.end = {"x": x + serverRadius*2, "y": y};
        this.task = null;
        this.connectedComponent = null; 
        this.type = "Server";
        this.parallelBlock = null;
        this.immediatelyProcess = false;
        this.backLog = [];
        this.isDrawingTask = true;
        this.lastDeparture = 0;
        this.delayLock = false;
        this.lastTimeReceived = 0;
    }
    reset(){
        this.task = null;
        this.immediatelyProcess = false;
        this.backLog = [];
        this.isAvailable = true;
    }
    setConnection(drawableObject){
        this.connectedComponent = drawableObject;
    }
    connectQueue(drawableObject){
        setConnection(drawableObject);
    }
    setDrawing(bool){
        if (bool == true){
            this.isDrawingTask = true;
        }else{
            this.isDrawingTask = false;
        }
    }
    acceptTask(task){
        if(this.connectedComponent !== null){
            this.isDrawingTask = false;
        }
        this.isAvailable = false;
        this.task = task;
        if(this.backLog.length > 0){
            if(this.connectedComponent != null && this.connectedComponent.tasks[task.identifier] != undefined)
                //this.backLog.pop();
                this.advanceTask(task);
        }
        this.draw();
    }
    receiveTask(task){
        this.lastTimeReceived = timeElapsed;
        this.isDrawingTask = true;
        this.draw();
    };
    advanceTask(task){
        if(this.task !== task || this.isDrawingTask == false ){
            createDelay(serverDelayTime, this.identifier, "advance", task);
            this.delayLock = true;
        }
        else if( this.delayLock == false && (timeElapsed - this.lastTimeReceived) < serverDelayTime){
            createDelay(serverDelayTime, this.identifier, "advance", task);
            this.delayLock = true;
        }else if(this.connectedComponent !== null && this.connectedComponent.readiedTasks[task.identifier] == undefined){
            createDelay(serverDelayTime, this.identifier, "advance", task);
            this.delayLock = true;
        }
            //this.backLog.push(task);
        else{
            this.delayLock = false;
            this.lastDeparture = timeElapsed;
            task.setCoordinates(this.connections.end);  

            if(this.parallelBlock !== null){
                this.parallelBlock.advanceTask(task);
                task.setCoordinates(this.parallelBlock.connections.end);
            }
            else{
                task.setCoordinates(this.connections.end);
                if(this.next.isAvailable){
                    this.next.acceptTask(this.task);
                }
            }
            task.makeVisible();
            this.task = null;
            this.isAvailable = true;
            if(this.connectedComponent != null)
                this.connectedComponent.advanceTask(task);
        }
    }
    draw(){
        context.fillStyle = this.task == null ? backgroundColor: this.task.color;
        context.beginPath();
        context.arc(this.coordinates.x + serverRadius, this.coordinates.y, serverRadius, 0, 2*Math.PI);
        if(this.isDrawingTask){
            context.fill();
        }
        context.stroke(); 
    }
}
ServerVisual.width = serverRadius*2;
ServerVisual.height = serverRadius*2;
ServerVisual.type = "Server";

class FeedbackServerVisual extends ServerVisual{
    constructor(x,y,identifier){
        super(x,y,identifier);
        this.taskDestinations = {};
    }
    reset(){
        this.task = null;
        this.taskDestinations = {};
        this.immediatelyProcess = false;
        this.backLog = [];
        this.isAvailable = true;
    }
    connectExit(exitPoint){
        this.exitPoint = exitPoint;
    }
    setTaskDestination(task, destination){
        this.taskDestinations[task.identifier] = destination;
    }
    getTaskDestination(task){
        return this.taskDestinations[task.identifier];
    }
    advanceTask(task){
        if(this.task !== task || this.isDrawingTask == false)
            createDelay(delayTime, this.identifier, "advance", task);
            //this.backLog.push(task);
        else{
              
            var destination = this.getTaskDestination(task);
            if(destination == "Exit"){
                task.setCoordinates(this.connections.end);
                this.exitPoint.acceptTask(task);
            }
            else{
                task.setCoordinates(this.connections.end);
                task.coordinates.y -= serverRadius;
                task.coordinates.x -= serverRadius;
                createFeedbackDelay();
                this.next.acceptTask(task);
            }

            task.makeVisible();
            this.task = null;
            this.isAvailable = true;
            delete this.taskDestinations[task.identifier];
            if(this.connectedComponent != null)
                this.connectedComponent.advanceTask(task);
            
        }
    }
   
}
//Workstation
class WorkstationVisual extends ServerVisual{
    constructor(x,y, identifier){
        super(x,y, identifier);
        this.connections.end.x = this.coordinates.x + workStationSize*2;
        this.type = "Workstation";
    }
  
    draw(){
        context.fillStyle = this.task == null? backgroundColor: this.task.color;
        context.beginPath();
        context.moveTo(this.coordinates.x + workStationSize + workStationSize * Math.cos(0), this.coordinates.y + workStationSize * Math.sin(0));
        for (var side = 0; side <= 6; side++) {
            context.lineTo(this.coordinates.x + workStationSize + workStationSize * Math.cos(side * 2 * Math.PI / 6), this.coordinates.y + workStationSize * Math.sin(side * 2 * Math.PI / 6));
        } 
        context.lineTo(this.coordinates.x + workStationSize*2, this.coordinates.y + 1);
        context.fill();
        context.stroke();
    }
}
WorkstationVisual.width = workStationSize*2;
WorkstationVisual.height = workStationSize*2;
WorkstationVisual.type = "Workstation";

//Disk
class DiskVisual extends ServerVisual{
    constructor(x,y, identifier){
        super(x,y,identifier);
        this.connections.start = {"x": x, "y": y};
        this.connections.end = {"x": x + diskRadius*2, "y": y};
        this.task = null;    
        this.type = "Disk";   
    }
    draw(){
        context.fillStyle = this.task == null? backgroundColor: this.task.color;
        context.draw
        context.beginPath();
        context.arc(this.coordinates.x + diskRadius, this.coordinates.y, diskRadius, 0, 2*Math.PI);   
        context.fill();
        context.stroke(); 
    }
}
DiskVisual.width = diskRadius*2;
DiskVisual.height = diskRadius*2;
DiskVisual.type = "Disk";

//Visual Anchors Are Used For Connections to Draw Path
class VisualAnchor extends DrawableObject{
    constructor(x,y){
        super(x,y, `Anchor(${x},${y})`);
        this.type = "Visual Anchor";
    }
}
VisualAnchor.type = "Visual Anchor";
class EntrancePoint extends VisualAnchor{
    constructor(x,y, identifier){
        super(x,y);
        this.identifier = identifier;
        this.type = "Entrance Point";
    }
}
//Exit Point Anchor
class ExitPoint extends VisualAnchor{
    constructor(x,y, identifier){
        super(x,y);
        this.identifier = identifier;
        this.type = "Exit Point";
    }
}
class SlowZone extends VisualAnchor{
    constructor(x,y){
        super(x,y);
    }
    advanceTask(task = this.task){
        if(this.task !== null){
            this.next.acceptTask(task);
            task.movementRate = taskSlowSpeed;
        }
        this.task = null;
    }
}
class FastZone extends VisualAnchor{
    constructor(x,y){
        super(x,y);
    }
    advanceTask(task = this.task){
        if(this.task !== null){
            this.next.acceptTask(task);
            task.movementRate = taskFastSpeed;
        }
        this.task = null;
    }
}
class NormalZone extends VisualAnchor{
    constructor(x,y){
        super(x,y);
    }
    advanceTask(task = this.task){
        if(this.task !== null){
            this.next.acceptTask(task);
            task.movementRate = taskMovementRate;
        }
        this.task = null;
    }
}

//Parallel Container
class ParallelContainer extends DrawableObject{
    constructor(xStart, yCenter, identifier, objectType, numberOfElements){
        super(xStart, yCenter, identifier);
        this.type = "Parallel Block";
        this.objectType = objectType;
        this.numberOfElements = numberOfElements;
        this.containedElements = [];
        this.objectIndices = {};
        this.demandedTasks = {};
        this.createParallelObjects();
        this.connectedQueue = null;
        this.tasks = [];
        
    }
    reset(){
        this.demandedTasks = {};
        this.tasks = [];
    }
    checkTask(taskIdentifier){
        var results = this.findTask(taskIdentifier);
        if(results !== null && results.destination.isAvailable)
            return true;
        else {
            return false;
        }
    }
    connectQueue(queue){
        this.connectedQueue = queue;
        for(var i = 0; i < this.containedElements.length; i++){
            this.containedElements[i].setConnection(this.connectedQueue);
        }
    }
    connectInteriorObjects(){
        for(var i = 0; i < this.containedElements.length - 1; i++){
            for(var j = 0; j < this.containedElements[i].length; j++){
                connectArrow(this.containedElements[i][j], this.containedElements[i+1][j]);
            }
        }
    }
    connectInteriorObjectsReversed(){
        for(var i = 0; i < this.containedElements.length - 1; i++){
            for(var j = 0; j < this.containedElements[i].length; j++){
                connectArrowReverse(this.containedElements[i][j], this.containedElements[i+1][j]);
            }
        }
    }
    createParallelObjects(){
        var objectWidth = this.findWidth(this.objectType);
        var objectHeight = this.objectType.width;
        this.connections.end.x = this.coordinates.x + 2*parallelSpacingHorizontal + objectWidth;
        if(this.numberOfElements == 1)
            this.connections.end.x = this.coordinates.x + objectWidth;
        this.calculateWidth();
        this.placeAllObjects();
    }
    placeAllObjects(){
        var x = this.coordinates.x + parallelSpacingHorizontal;
        if(this.numberOfElements == 1)
            x = this.coordinates.x;
        var y = this.coordinates.y;
        
        var newElements = [];

        if(!Array.isArray(this.objectType)){
            this.placeObjects(x,y, this.objectType, this.containedElements);
        }
        else {
            for(var i = 0; i < this.objectType.length; i++){
                if(this.containedElements[i] === undefined){
                    this.containedElements.push([]);
                }
                this.placeObjects(x, y, this.objectType[i], this.containedElements[i]);
                x += this.objectType[i].width + horizontalSpacing;
            }
            
            for(var i = 0; i < this.numberOfElements; i++){
                for(var j = 1; j < this.objectType.length; j++){
                    this.containedElements[j-1][i].setNext(this.containedElements[j][i]);
                    if(this.containedElements[j-1][i].type == "Queue"){
                        this.containedElements[j][i].setConnection(this.containedElements[j-1][i]);                
                    }
                }
            }
        }
        
    }
    placeObjects(x, y, object, resultArray){
        var verticalSpacing = object === WorkstationVisual ? workstationSpacingVertical : parallelSpacingVertical;
            
        //if even offset y to center parallel components
        if(this.numberOfElements % 2 === 0){
            y -= verticalSpacing/2;
        }
        //get first object y coordinate
        y -= (verticalSpacing)*Math.floor( (this.numberOfElements - 1)/2 );
        for (var i = 0; i < this.numberOfElements; i++){
            resultArray.push(new object(x,y, `${this.identifier} `));
            resultArray[i].identifier += resultArray[i].type + ` ${i+1}`;  
            y += verticalSpacing;     
            this.objectIndices[resultArray[i].identifier] = resultArray[i];
            resultArray[i].parallelBlock = this;
        }
    }
    setNext(drawableObject){
        this.next = drawableObject;
        if( drawableObject != null && !Array.isArray(this.containedElements[0])){
            for(var i = 0; i < this.containedElements.length; i++){
                this.containedElements[i].setNext(this.next);
            }
            this.next.previous = this;
        } 
        else if(drawableObject != null){
            var lastIndex = this.containedElements.length - 1;
            if(drawableObject != null){
                for(var i = 0; i < this.containedElements[lastIndex].length; i++){
                    this.containedElements[lastIndex][i].setNext(this.next);
                }
                this.next.previous = this;
            }
        }
    }
    findWidth(){
        if (Array.isArray(this.objectType)){
            var width = 0;
            this.objectType.forEach(element => {
                width += element.width;
            });
            return width + (this.objectType.length - 1) * horizontalSpacing;
        }
        else return this.objectType.width;
    }
    draw(){
        if(!this.isReversed){
            if(Array.isArray(this.objectType)){
                this.connectInteriorObjects();
                drawParallelstart(...this.containedElements[0]);
                this.containedElements.forEach(type => {
                    type.forEach(element => {
                        element.draw();
                    });
                });
                drawParallelRight(...this.containedElements[this.containedElements.length-1]);
            }
            else{
                drawParallelConnection(...this.containedElements);
                this.containedElements.forEach(element => {
                    element.draw();
                });
            }
        }
        else{
            if(Array.isArray(this.objectType)){
                this.connectInteriorObjectsReversed();
                drawParallelRight(...this.containedElements[0]);
                this.containedElements.forEach(type => {
                    type.forEach(element => {
                        element.draw();
                    });
                });
                drawParallelstart(...this.containedElements[this.containedElements.length-1]);
            }
            else{
                drawParallelConnection(...this.containedElements);
                this.containedElements.forEach(element => {
                    element.draw();
                });
            }
        }
    }
    placeTask(taskIdentifier, serverIdentifier){
        var destination = this.objectIndices[serverIdentifier];
        this.tasks.push({"taskIdentifier": taskIdentifier, "destination":destination});
    }
    acceptTask(task){
        var results = this.findTask(task.identifier);
        results.destination.acceptTask(task);    
        if(this.connectedQueue == null){
            if(selectedModel == "centralServer")   
                task.setDestination(this.connections.start);
            else 
                task.setDestinationObject(this);
        }
            
    }
    findTask(taskIdentifier){
        if(this.tasks.length > 0){
            for(var i = 0; i < this.tasks.length; i++)
            {   
                if(this.tasks[i].taskIdentifier == taskIdentifier ){//&& this.tasks[i].destination.task.identifier == taskIdentifier){
                    return {"index": i, "destination": this.tasks[i].destination};
                }
            }
        }
        return null;
    }
    receiveTask(task){
       var result = this.findTask(task.identifier);
       //task.isMoving = false;
       if(this.connectedQueue == null && selectedModel == "centralServer"){
            task.setDestinationObject(result.destination);
       }
        else if (result !== null && result.destination.task.identifier == task.identifier){
            result.destination.receiveTask(task);
        }
        
        
    }
    advanceTask(task){
        this.next.acceptTask(task);
        var results = this.findTask(task.identifier);
        if(results !== null)
            this.tasks.splice(results.index, 1);
    }
    checkAvailability(task){
        var result = this.checkTask(task.identifier);
        if(result == false) return false;
        else return true;
    }
    reverseDrawing(){
        var temp = this.coordinates.x;
        this.connections.start.x = this.connections.end.x;
        this.connections.end.x = temp;
        this.isReversed = true;
        
        for(var key in this.objectIndices){
            var currentObject = this.objectIndices[key];
            
            if(currentObject.next !== this.next){
                var nextObject = currentObject.next;
                
                currentObject.coordinates.x = nextObject.connections.end.x - currentObject.constructor.width; 
                currentObject.connections.start.x = currentObject.coordinates.x;
                currentObject.connections.end.x = currentObject.connections.start.x + currentObject.constructor.width;
                

                nextObject.coordinates.x = currentObject.coordinates.x - nextObject.constructor.width - horizontalSpacing;
                nextObject.connections.start.x = nextObject.coordinates.x;
                nextObject.connections.end.x = nextObject.connections.start.x + nextObject.constructor.width;

                if(nextObject.type == "Queue"){
                    nextObject.updateQueueSlotLocations();
                } 
                if(nextObject.isReversed !== true)
                    nextObject.reverseDrawing();
            }
            if(currentObject.type == "Queue"){
                currentObject.updateQueueSlotLocations();
            }
            if(currentObject.isReversed !== true)
                currentObject.reverseDrawing();
        }
    }
}

var taskColorChoices = [
    "red", 
    "cyan",
    "brown",
    "green",
    "purple",
    "blue",
    "orange",
    "Chartreuse",
    "deeppink",
    "chocolate",
    "orangeRed",
    "SpringGreen",
    "maroon",
    "Fuchsia",
    "saddleBrown",
    "teal"

]
var colorIndex = 0;
function generateColor(){
    var colorChoice = taskColorChoices[colorIndex];
    colorIndex = ( (colorIndex + 1) % taskColorChoices.length);
    return colorChoice;
}
function createVisualTask(x,y, identifier){
    return new TaskVisual(x, y, identifier, generateColor());
}
