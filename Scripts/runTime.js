var navigationMenu = document.getElementById("navigationMenu");
navigationMenu.innerHTML = `
<button id="homeButton" class="navigation-button"> QAS Home </button>
<button id="modelSelectionButton" class="navigation-button"> Select Model </button>
<button id="parameterButton" class="navigation-button"> Change Parameters </button>
<button id="resetButton" class="navigation-button"> Restart Current Model </button>`;


var speedMenu = document.getElementById("speedMenu");
speedMenu.innerHTML = `
<div class="slider-container">
    <div class="slider-label-container">
        <div class="slider-label-middle" id="speedReadout">Speed: 50%</div>
    </div>
    <input type="range" min="1" max="100" value="50" class="slider" id="speedSlider" onchange="speedUpdate(this.value)">
    <div class="slider-label-container">
        <div class="slider-label-left" id="speedReadout">Slowest</div>
        <div class="slider-label-right" id="speedReadout">Fastest</div>
    </div>

</div>
<button id="stopResumeButton" class="speed-button"> Pause </button>
<button id="stepOnceButton" class="speed-button"> Single Step </button>
<button id="changeModeButton" class="speed-button"> Maximum Speed </button>
<button id="graphingButton" class="speed-button"> Graph </button>`;

//BUTTONS!!!!
var homeButton = document.getElementById("homeButton");
var stopResumeButton = document.getElementById("stopResumeButton");
var modelSelectButton = document.getElementById("modelSelectionButton");
var helpButton = document.getElementById("parameterButton");
var resetButton = document.getElementById("resetButton");
var stepOnceButton = document.getElementById("stepOnceButton");
var changeModesButton = document.getElementById("changeModeButton");

/////////////////////////////////////////////////////////////////
var graphingButton = document.getElementById("graphingButton");
var graphContainer = document.getElementById("graphContainer");

graphContainer.style.display = "none";
graphingButton.onclick = function(){
    graphContainer.style.display = "block";
    stopModel();
    
    stepMode = false;
    simulationMode = false;
    updateSpeedMenu();
    currentSimulation.copyAllTasks();
    currentModel.draw();
    createGraphs();

}

////////////////////////////////////////////////////////////////
var speedReadout = document.getElementById("speedReadout");
function speedUpdate(value){
    var percentage = value/100;
    var maxSpeed = 24;
    var minSpeed = 1;
    speedReadout.innerHTML = `Speed: ${value}%`;
    updateRate =  73.197*Math.exp(-0.027*value);

    if(stepMode == true){
        stopStepOnceMode();
    }
    stopResumeButton.innerHTML = "Pause";
    stopResumeButton.onclick = function(){
        stopModel();
        
        //currentSimulation.copyAllTasks(); 
        currentModel.draw();
        simulationMode = false;
        updateSpeedMenu();
    }
    stopModel();
    runModel( updateRate );
}
function setDefaultButtons(){
    stopResumeButton.onclick = function(){
        stopModel();
        updateSpeedMenu();
    }
    homeButton.onclick = function(){
        window.location.href = "../index.html";
    }
    modelSelectButton.onclick = function(){
        window.location.href = "../Pages/modelSelection.html";
    }
    helpButton.onclick = function(){
        window.location.href = "../Pages/modelConfiguration.html";
    }
    resetButton.onclick = function(){
        stopModel();
        resetModel();
        updateSpeedMenu();
    }
    stepOnceButton.onclick = function(){
        startStepOnceMode();
        updateSpeedMenu();
    }
    changeModesButton.onclick = function(){
        beginSimulationMode();
        updateSpeedMenu();
    }
}
function compareServer(identifier){
    if( currentModel.components[identifier].task == null){
        if( currentSimulation.components[identifier].task != null ){
            alert(`${identifier}` + "MODEL NULL, SIM NOT");
            stopModel();
        }
        return;
    }else if( currentSimulation.components[identifier].task == null){
        if( currentModel.components[identifier].task != null ){
            alert(`${identifier}` + "SIM NULL, MODEL NOT");
            stopModel();
        }
        return;
    }else if(currentModel.components[identifier].task.identifier  != currentSimulation.components[identifier].task.identifier){
        alert(`${identifier}` + "SIM: " + currentSimulation.components[identifier].task.identifier + " MODEL: " + currentModel.components[identifier].task.identifier );
        return;
    }
}
function updateSpeedMenu(){
    if(error !== null){
        speedMenu.innerHTML = "<h1> Check parameters for initialization: " + error + "</h1>";
        return;
    }
    if(simulationMode == true){
        stepMode = false;
        changeModesButton.innerHTML = "Normal Speed";
        changeModesButton.onclick = function(){    
            setDefaultButtons();
            currentSimulation.copyAllTasks(); 
            currentModel.draw();
            simulationMode = false;    
            stopModel();
            runModel();
            updateSpeedMenu();
        }
        stopResumeButton.innerHTML = "Pause";
        stopResumeButton.onclick = function(){
            setDefaultButtons();
            currentSimulation.copyAllTasks(); 
            currentModel.draw();
            simulationMode = false;
            stopModel();
            updateSpeedMenu();
        }
        stepOnceButton.onclick = function(){
            currentModel.draw();
            simulationMode = false;
            startStepOnceMode();
            updateSpeedMenu();
        }
    }
    else if (currentModel.timerRunning == false){
        stopResumeButton.innerHTML = "Resume";
        stopResumeButton.onclick = function(){
            runModel();
            updateSpeedMenu();
        }
    }
    else{
        stopResumeButton.innerHTML = "Pause";
        stopResumeButton.onclick = function(){
            stopModel();
            updateSpeedMenu();
        }
    }
    if(simulationMode == false){
        changeModesButton.innerHTML = "Maximum Speed";
        simulationMode = false;
        changeModesButton.onclick = function(){
            beginSimulationMode();
            updateSpeedMenu();
        }           
    }
}

////////////////////////////////////

setDefaultButtons();
