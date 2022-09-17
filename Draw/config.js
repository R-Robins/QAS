//ANIMATION SPEED
let taskMovementRate =  70;//45;//45; //30
let taskSlowSpeed = 4;
let taskFastSpeed = 12;
let defaultUpdateRate =  20;//-7.628*Math.log(50) + 36; //6
//TIMER SEEMS STUCK AT LOWE BOUND  Of 5?

//updateRate = 
let taskSteps = 1;
let timeScaling = 1;
let simulationTimeScaling = undefined;
let timePerTick = 1;

//taskSteps = 4;
//taskMovementRate = 2;

let updateRate = defaultUpdateRate;
let desiredAdjustedValue = 100;//100;

//let feedbackDelayTime = 150;
//let delayTime = 100;
let feedbackDelayTime = 50;
let delayTime = 5//20;

let serverDelayTime = 10;
let parallelDelayTime = 20;
//CANVAS COMPONENTS
let canvasWidth = 1400;
let canvasHeight = 800;
let canvasScaling = 1; //scaling for resize
let canvasScalingX = 1;
let canvasScalingY = 1;

//LINE SIZE
let lineWidth = 3; //was 4
let canvasLineWidth = 3; //canvas border
let arrowThickness = 4;
let arrowHeadLength = 5;
let connectionThickness = 3;

//COLORS
let canvasBorderColor = "white";
let background = "white";
let strokeColor = "black";
let backgroundColor = "white";
let connectionColor = "black";

//SIZES
let serverRadius = 35;
let workStationSize = 30; //Length is two times this, simular to radius
let taskRadius = 15;
let diskRadius = 35;
let diskWidth = 30;
let diskHeight = 30;
let queueSlotSize = 40;

//SPACINGS
let horizontalSpacing = 75; //horizontal spacing 
let verticalSpacing = 150; //vertical spacing
let parallelSpacingHorizontal = 20; 
let parallelSpacingVertical = 80;
let workstationSpacingVertical = 60;
let parallelSpacingWorkstation = 60;

//QUEUE SLOT COUNT
let numberSlotsInQueue = 10;
let maxSlots = 20;

//color choices: 
//paleturquoise
// #f4a261 // orangeish
// #e9c46a // yellowish
// #e76f51 // darker orange
// #2a9d8f //greenish
// #264653//darker green//


