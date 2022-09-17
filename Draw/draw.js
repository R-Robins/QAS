//Draws components onto the canvas
let canvas = document.getElementById("window");
let context = canvas.getContext("2d");

//******************** */
//Canvas Functions
//******************** */
function initializeCanvas(){
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.lineWidth = canvasLineWidth;
    drawCanvas();
}

function drawCanvas(){
    context.fillStyle = background;
    context.fillRect(0,0,canvasWidth,canvasHeight);
    context.strokeStyle = canvasBorderColor;
    context.strokeRect(0, 0, canvasWidth, canvasHeight);
    context.strokeStyle = strokeColor;
}

//*********************** */
//  Connection Functions
//*********************** */

//Draws a line from (x1,y1) to (x2,y2)
function drawLine(x1, y1, x2, y2, color){
    context.lineWidth = lineWidth;
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.fillRect(x1- lineWidth/2, y1-lineWidth/2, lineWidth, lineWidth);
    context.stroke();
}

//Draws the head of an arrow oriented based on the given coordinates of the line
function drawArrowHead(x1,y1,x2,y2,color){
    context.beginPath();
    context.fillStyle = color;
    let angle = Math.atan2(y2-y1, x2-x1);
    context.moveTo(x2,y2);
    context.lineTo(x2 - arrowHeadLength * Math.cos(angle - Math.PI / 6), y2 - arrowHeadLength * Math.sin(angle - Math.PI / 6));
    context.lineTo(x2 - arrowHeadLength * Math.cos(angle + Math.PI / 6), y2 - arrowHeadLength * Math.sin(angle + Math.PI / 6));
    context.lineTo(x2,y2);
    context.lineTo(x2 - arrowHeadLength * Math.cos(angle - Math.PI / 6), y2 - arrowHeadLength * Math.sin(angle - Math.PI / 6));
    context.stroke();
}

//Draws Arrow Between Two Coordinates
function drawArrow(x1, y1, x2, y2, color){
    context.lineWidth = connectionThickness;
    drawLine(x1, y1, x2, y2, color);
    if(x2 > x1){
        x2 = x2 - lineWidth;
        x1 = x1 - lineWidth;
    }
    else{
        y1 = y1 - lineWidth;
        y2 = y2 - lineWidth;
    }

    drawArrowHead(x1, y1, x2, y2, color);
  }

  //Draws Arrow Between Two Coordinates
function drawArrowReversed(x1, y1, x2, y2, color){
    context.lineWidth = connectionThickness;
    drawLine(x1, y1, x2, y2, color);
    if(x2 > x1){
        x2 = x2 - lineWidth;
        x1 = x1 - lineWidth;
    }


    drawArrowHead(x1, y1, x2, y2, color);
  }
function connectArrowReverse(){
    try{
        for (var i=0; i < arguments.length-1; i++) {
            drawArrowReversed(arguments[i].connections.end.x, arguments[i].connections.end.y, 
                arguments[i+1].connections.start.x + arrowHeadLength, arguments[i+1].connections.start.y, connectionColor);
        }
    } catch(err){
        console.log("ERROR IN CONNECTION");
        console.error();
    };
}

//Draws Arrow Connection Between Arguments
function connectArrow(){
    try{
        for (var i=0; i < arguments.length-1; i++) {
            drawArrow(arguments[i].connections.end.x, arguments[i].connections.end.y, 
                arguments[i+1].connections.start.x, arguments[i+1].connections.start.y, connectionColor);
        }
    } catch(err){
        console.log("ERROR IN CONNECTION");
        console.error();
    };
}

//Draws Line Connection Between Arguments
function connectLine(){
    try{
        if(arguments.length < 2) return; 
        context.beginPath();
        context.moveTo(arguments[0].connections.start.x, arguments[0].connections.end.y);
        for (var i=0; i < arguments.length-1; i++) {
            drawLine(arguments[i].connections.end.x, arguments[i].connections.end.y, 
                arguments[i+1].connections.start.x, arguments[i+1].connections.start.y, connectionColor);
        }
    } catch(err){
        console.log("ERROR IN CONNECTION");
        console.error();
    }
}

//Connects Parallel Components
function drawParallelstart(){
    context.beginPath();
    context.moveTo(arguments[0].connections.start.x, arguments[0].connections.start.y);
    for (var i=0; i < arguments.length - 1; i++) {
        context.lineTo(arguments[i].coordinates.x - parallelSpacingHorizontal, arguments[i].connections.start.y);
        context.lineTo(arguments[i].coordinates.x - parallelSpacingHorizontal, arguments[i + 1].connections.start.y);
        context.lineTo(arguments[i + 1].coordinates.x , arguments[i + 1].connections.start.y);
    }
    context.stroke();
}
function drawParallelStartArrowed(){
    context.beginPath();
    drawArrow()
    context.moveTo(arguments[0].connections.start.x, arguments[0].connections.start.y);
    for (var i=0; i < arguments.length - 1; i++) {
        context.lineTo(arguments[i].connections.start.x - parallelSpacingHorizontal, arguments[i].connections.start.y);
        context.lineTo(arguments[i].connections.start.x - parallelSpacingHorizontal, arguments[i].connections.start.y + parallelSpacingVertical);
        context.lineTo(arguments[i + 1].connections.start.x, arguments[i + 1].connections.start.y);
        drawArrow(arguments[i].connections.start.x, arguments[i].connections.start.y, arguments[i].connections.start.x + parallelSpacingHorizontal, arguments[0].start.y, connectionColor);
    }
    context.stroke();

}
//coordinates.x + arguments[i].constructor.width
function drawParallelRight(){
    context.beginPath();
    context.moveTo(arguments[0].connections.end.x, arguments[0].connections.end.y);
    for (var i=0; i < arguments.length - 1; i++) {
        context.lineTo(arguments[i].coordinates.x + arguments[i].constructor.width + parallelSpacingHorizontal, arguments[i].connections.end.y);
        context.lineTo(arguments[i].coordinates.x + arguments[i].constructor.width + parallelSpacingHorizontal,  arguments[i + 1].connections.end.y);
        context.lineTo(arguments[i + 1].coordinates.x + arguments[i].constructor.width, arguments[i + 1].connections.end.y);
    }
    context.stroke();
}

function drawParallelConnection(){
    context.strokeStyle = connectionColor;
    try{
        drawParallelstart.apply(null, arguments);
        drawParallelRight.apply(null, arguments);
    }catch(err){
        console.log("ERROR IN PARALLEL CONNECTION");
        console.error();
    }
}

function drawParallelConnectionArrowed(){
    context.strokeStyle = connectionColor;
    try{
        drawParallelStartArrowed.apply(null, arguments);
        drawParallelRight.apply(null, arguments);
    }catch(err){
        console.log("ERROR IN PARALLEL CONNECTION");
        console.error();
    }
}