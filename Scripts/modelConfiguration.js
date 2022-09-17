var body = document.getElementById("configuration-body");
var selectedModel = getCookie("selectedModel");
if(selectedModel == "" || selectedModel == undefined || selectedModel == null){
    window.location.href = "../Pages/modelSelection.html";
}
var inputs = {};
var distributionSectionNames = {};

//Default Values
var defaultConstantDistributionValue = 200;
var defaultUniformLower = 100;
var defaultUniformUpper = 400;
var defaultExponentialValue = 300;
var defaultInteractiveWorkstations = 4;
var defaultInteractiveServers = 3;
var defaultInteractiveServers = 3;
var defaultInteractiveWorkstations = 4;

//Validation Boundaries
var validations = {
    "minServerCount": 1,
    "maxServerCount": 8,
    "minWorkstationCount": 1,
    "maxWorkstationCount": 8,
    "maxDiskCount": 8,
    "minDiskCount": 1,
    "minCoreCount": 1,
    "maxCoreCount": 8,
    "minQueueSize": 3,
    "maxQueueSize": 30,
    "minFeedbackRate": 0,
    "maxFeedbackRate": 100,
    "minJobCount": 1,
    "maxJobCount": Infinity
};

//Detailed Default Parameters For Specific Models
var defaultParameters = {
    "singleServer": {
        "queue-size": 16,
        "server-distribution-type": "uniform",
        "server-uniform-lower": 300,
        "server-uniform-upper": 600,
        "server-exponential-input": 450,
        "server-constant-input": 450,
        "arrival-distribution-type": "exponential",
        "arrival-exponential-input": 500,
        "arrival-constant-input": 500,
        "arrival-uniform-upper": 600,
        "arrival-uniform-lower": 500
    },
    "parallelServers": {
        "queue-size": 15,
        "parallel-servers-distribution-type": "uniform",
        "parallel-servers-constant-input": 1000,
        "parallel-servers-uniform-lower": 500,
        "parallel-servers-uniform-upper": 1500,
        "parallel-servers-exponential-input": 1000,
        "arrival-distribution-type": "exponential",
        "arrival-exponential-input": 300,
        "arrival-constant-input": 300,
        "arrival-uniform-upper": 400,
        "arrival-uniform-lower": 200,
        "parallel-servers-count": 4,
        "server-count": 4
    },
    "workstations": {
        "queue-size": 4,
        "server-count": 4,
        "workstation-count": 7,
        "max-workstations": 9,
        "max-servers": 8,
        "workstation-distribution-type": "exponential",
        "workstation-exponential-input": 1750,
        "workstation-uniform-lower": 500,
        "workstation-uniform-upper": 3000,
        "workstation-constant-input": 1750,
        "processor-distribution-type": "uniform",
        "processor-uniform-lower": 600,
        "processor-uniform-upper": 2400,
        "processor-exponential-input": 1500,
        "processor-constant-input": 1500
    },
    "singleFeedback":{
        "queue-size": 16,
        "feedback-return-rate": 40,
        "server-distribution-type": "uniform",
        "server-uniform-lower": 150,
        "server-uniform-upper": 290,
        "server-exponential-input": 220,
        "server-constant-input": 220,
        "arrival-distribution-type": "exponential",
        "arrival-exponential-input": 400,
        "arrival-constant-input": 400,
        "arrival-uniform-lower": 300,
        "arrival-uniform-upper": 500
    },
    "centralServer":{
        "queue-size": 10,
        "disk-count": 3,
        "job-count": 15,
        "core-count": 4,
        "cpu-distribution-type": "exponential",
        "cpu-exponential-input": 300,
        "cpu-constant-input": 300,
        "cpu-uniform-lower": 200,
        "cpu-uniform-upper": 400,
        "channel-distribution-type": "exponential",
        "channel-exponential-input": 60,
        "channel-constant-input": 60,
        "channel-uniform-lower": 50,
        "channel-uniform-upper": 70,
        "disk-weight": 1,
        "disk-distribution-type": "constant",
        "disk-constant-input" : 180,
        "disk-exponential-input": 180,
        "disk-uniform-lower": 100,
        "disk-uniform-upper": 260
    }
}
function setDefaultParameters(modelIdentifier){
    for( const key in defaultParameters[modelIdentifier]){
        if(getCookie(key) == undefined || getCookie(key) == "")
            inputs[key] = defaultParameters[modelIdentifier][key];
        else inputs[key] = getCookie(key);
    }
}
function setDefaultDistributionValues(identifier, textInputs){
    if( inputs[`${identifier}-constant-input`] == undefined)
        inputs[`${identifier}-constant-input`] = defaultConstantDistributionValue;
    textInputs.constant.value.value = inputs[`${identifier}-constant-input`];

    if(inputs[`${identifier}-uniform-lower`] == undefined)
        inputs[`${identifier}-uniform-lower`] = defaultUniformLower;
    textInputs.uniform[`uniform-lower`].value = inputs[`${identifier}-uniform-lower`];
    
    if(inputs[`${identifier}-uniform-upper`] == undefined)
        inputs[`${identifier}-uniform-upper`] = defaultUniformUpper;
    textInputs.uniform[`uniform-upper`].value = inputs[`${identifier}-uniform-upper`];

    if(inputs[`${identifier}-exponential-input`] == undefined)
        inputs[`${identifier}-exponential-input`] = defaultExponentialValue;
    textInputs.exponential.value.value = inputs[`${identifier}-exponential-input`];

}
function setDefaultFeedbackValue(feedbackInput){
    if(inputs[`feedback-return-rate`] == undefined)
        inputs[`feedback-return-rate`] = defaultFeedbackRate;
    feedbackInput.value = inputs[`feedback-return-rate`];
}
function setDefaultInputValue(inputName, inputValue, inputField){
    if(inputs[inputName] == undefined)
        inputs[inputName] = inputValue;   
    inputField.value = inputs[inputName];
}
function setDefaultValue(inputName, value, inputComponent){
    if(inputs[inputName] == undefined)
        inputs[inputName] = value;
    inputComponent.value = inputs[inputName];
}
function setDefaultQueueSize(queueInput){
    var model = getCookie(`selectedModel`);
    inputs['queue-size'] = defaultParameters[model]["queue-size"];
    queueInput.value = defaultParameters[model]["queue-size"];
}

//DESCRIPTION TEXTS

const singleServerDescription = `
    <div class = "help-description-title"> Single Server Model: </div>
    The single server model consists of arrivals, a single queue, and a single processor. 
    </br> Jobs arrive then are enqueued and processed. 
    </br></br> The queueing discipline utilized is first come, first served.
    <img src="../Images/single.PNG" alt="Single Server System" width="60%"  class="image-left">

    </br></br>
    <div class="help-colored-text"><b>Adjustable Parameters:</b></div>
    -Interarrival Time Distribution
    </br>-Service Time Distribution
    </br>-Number of Visible Queue Slots    

    </br></br>
    <div class="help-colored-text"><b>Available Results:</b></div>
    <b>Processor:</b>
    </br>-Mean Response Time and Standard Deviation of Response Time
    </br>-Throughput
    </br>-Jobs Completed
    </br>-Events Processed
    </br></br><b>Arrivals:</b>
    </br>-Mean Interarrival Time and Standard Deviation of Interarrival Time
    </br>-Number of Jobs That Have Arrived
    </br></br><b>Queue:</b>
    </br>-Current Queue Length
    </br>-Mean Queue Length
`;

const singleFeedbackDescription = `
    <div class = "help-description-title"> Single Server with Feedback Model: </div>
    The single server with feedback model contains arrivals, a single queue, and a single server. 
    </br>Jobs are allowed to return back into the system instead of leaving for further processing. 
    </br></br> The queueing discipline utilized is first come, first served.
    <img src="../Images/single_feedback.PNG" alt="Single Server with Feedback" width="60%"  class="image-left">

    </br></br>
    <div class="help-colored-text"><b>Adjustable Parameters:</b></div>
    -Interarrival Time Distribution
    </br>-Service Time Distribution
    </br>-Feedback Return Percentage
    </br>-Number of Visible Queue Slots


    </br></br>
    <div class="help-colored-text"><b>Available Results:</b></div>
    <b>Processor:</b>
    </br>-Mean Response Time and Standard Deviation of Response Time
    </br>-Throughput
    </br>-Jobs Completed
    </br>-Events Processed
    </br></br><b>Arrivals:</b>
    </br>-Mean Interarrival Time and Standard Deviation of Interarrival Time
    </br>-Number of Jobs That Have Arrived
    </br></br><b>Queue:</b>
    </br>-Current Queue Length
    </br>-Mean Queue Length
`;
const parallelServersDescription = `
    <div class = "help-description-title"> Parallel Servers Model: </div>
    The parallel servers model consists of a single queue with multiple identical servers in parallel.
    </br>Tasks from the queue are placed into one of the available servers for processing when available. 
    </br></br> The queueing discipline utilized is first come, first served.
    <img src="../Images/parallel.PNG" alt="Parallel Servers" width="60%"  class="image-left">

    </br></br>
    <div class="help-colored-text"><b>Adjustable Parameters:</b></div>
    -Number of Servers
    </br>-Interarrival Time Distribution
    </br>-Service Time Distribution
    </br>-Number of Visible Queue Slots

    </br></br>
    <div class="help-colored-text"><b>Available Results:</b></div>
    <b>Parallel Servers System:</b>
    </br>-Mean Response Time and Standard Deviation of Response Time
    </br>-Throughput
    </br>-Jobs Completed
    </br>-Events Processed
    </br></br><b>Arrivals:</b>
    </br>-Mean Interarrival Time and Standard Deviation of Interarrival Time
    </br>-Number of Jobs That Have Arrived
    </br></br><b>Queue:</b>
    </br>-Current Queue Length
    </br>-Mean Queue Length
    </br></br><b>Individual Servers:</b>
    </br>-Mean Utilization
    </br>-Mean Service Time
    </br>-Standard Deviation of Service Time

    </br></br>
`;
const interactiveWorkstationsDescription = `
    <div class = "help-description-title"> Interactive Systems Model: </div>
    The interactive systems model is a closed system containing serveral workstations in parallel, 
    followed by a queue into number of servers in parallel. Every workstation has task that corresponds uniquely to that given workstation. 
    </br></br> The queueing discipline utilized is first come, first served.


    <img src="../Images/interactive.PNG" alt="Interactive System" width="60%"  class="image-left">

    </br></br>
    <div class="help-colored-text"><b>Adjustable Parameters:</b></div>
    -Number of Servers
    </br>-Number of Workstations
    </br>-Workstation Think Time Distribution
    </br>-Processor  Time Distribution



    </br></br>
    <div class="help-colored-text"><b>Available Results:</b></div>
    <b>Interactive System:</b>
    </br>-Mean Response Time and Standard Deviation of Response Time
    </br>-Throughput
   
    </br></br><b>Individual Workstations:</b>
    </br>-Mean Utilization
    </br>-Mean Think Time
    </br>-Standard Deviation of Think Time

    </br></br><b>Processor Queue:</b>
    </br>-Mean Queue Length
    </br>-Current Queue Length

    </br></br><b>Individual Servers:</b>
    </br>-Mean Utilization
    </br>-Mean Service Time
    </br>-Standard Deviation of Service Time
`;
const centralServerDescription = `
    <div class = "help-description-title"> Central Server Model: </div>
    The central server model consists of a number of CPU cores in parallel, followed by a disk controller, and a number of disks in parallel.
    </br>This is a closed system with a number of jobs already present within it. Each disk contains its own queue, likelihood for visitting, 
    and service time distribution. 
    The central server model contains one central processor and a number of jobs already present within the system. The jobs
    originate from the CPU. Jobs are forwarded into a disk controller, which directs the flow of jobs to a number of disks in parallel. 
    </br></br> The queueing discipline utilized is first come, first served.
    <img src="../Images/central.PNG" alt="Central System" width="60%"  class="image-left">

    </br></br>
    <div class="help-colored-text"><b>Adjustable Parameters:</b></div> 
    -Number of Parallel Cores
    </br>-Number of Disks / Servers
    </br>-Number of Initial Jobs

    </br>-Central Processor Distributions
    </br>-Disk Controller Distribution 
    </br>-Distributions Rates of the Individual Disks / Servers
    </br>-Number of Queue Slots

    </br></br>
    <div class="help-colored-text"><b>Available Results:</b></div>

    <b>Central Processor System:</b>
    </br>-Current Queue Length
    </br>-Mean Queue Length
    </br>-Mean Response Time

    </br></br><b>Individual CPU CORES:</b>
    </br>-Mean Utilization
    </br>-Mean Service Time

    </br></br><b>Disk Controller:</b>
    </br>-Mean Utilization
    </br>-Mean Service Time
    </br>-Mean Queue Length

    </br></br><b>Individual Disks:</b>
    </br>-Mean Utilization
    </br>-Mean Service Time
    </br>-Mean Queue Length
`;

//////
/////////////////////////////////////////////////////////////////////////
//CLASSES
////////////////////////////////////////////////////////////////////////

//Field Classes
class InputField{
    constructor(type, identifier, name, description, value){
        this.identifier = identifier;
        this.type = type;
        this.description = description;
        this.value = value;
        this.name = name;
    }
    generateHTML(){}
}
class TextField extends InputField{
    constructor(identifier, name, description){
        super("text", identifier, name, description, '');
    }
    generateHTML(){
        var label = `<label for="${this.identifier}" class="configuration-label">${this.description}</label>`;
        var input = `<input type="${this.type}" id="${this.identifier}" name="${this.name}" value="${this.value}" class="configuration-text-input">`;
        return label+input;
    }
}
class RadioButton extends InputField{
    constructor(identifier, name, description, value){
        super("radio", identifier, name, description, value);
    }
    generateHTML(){
        var label = `<label for="${this.identifier}" class="configuration-label">${this.description}</label>`;
        var input = `<input type="${this.type}" id="${this.identifier}" name="${this.name}" class="configuration-radio" value="${this.value}">`;
        return input + label;
    }
}
class Button extends InputField{
    constructor(identifier, description){
        super("button", identifier, name, description, null);
    }
    generateHTML(){
        var button = `<button id="${this.identifier}" class="configuration-selection-button">${this.description}</button>`;
        return button;
    }
}

//Section for a Single Component
class ConfigurationSection{
    constructor(identifier, fields, listenerFunction = null){
        this.identifier = identifier
        this.fields = fields;
        this.listenerFunction = listenerFunction;
    }
    //calls the listener function this must be done after the initial section creations
    callListener(){
        if(this.listenerFunction !== null){
            var outputFields = this.listenerFunction(this.identifier);
            if(typeof outputFields == "object"){
                this.fields = {...this.fields, ...outputFields};
            }
        }
    }
    generateHTML(location){
        this.fields.forEach(field => {
            location.innerHTML += field.generateHTML();
        });
        location.innerHTML += '<br>';
    }
}

//Model Configurations
class ModelConfiguration{
    constructor(identifier){
        this.identifier = identifier;
        this.sections = [];
    }
    callListeners(){
        for(var i = 0; i < this.sections.length; i++){
            this.sections[i].callListener();
        }
    }
    addSection(section){
        this.sections.push(section);
    }
    addSectionArray(sectionArray){
        for(var i = 0; i < sectionArray.length; i++){
            this.sections.push(sectionArray[i]);
        }
    }
    addResponsiveSection(responsiveSection){
        this.responsiveSections.push(responsiveSection);
    }
    writeContent(){
        this.sections.forEach(section => {
            this.location.innerHTML += section.generateHTML;      
        });
    }
}
class SingleServerConfiguration extends ModelConfiguration{
    constructor(){
        super("single-server");
        addTitle("Single Server Model");
        createCategoryStartDivision("configurationDivision", "Configuration Settings");
        this.addSection(createQueueSizeConfiguration("queue", "Queue Visual"));
        
        createCategoryStartDivision("distributionDivision", "Distributions");
        this.addSection(createArrivalConfiguration("arrival", "Interarrival Time"));
        this.addSection(createServerConfiguration("server", "Service Time"));
        this.addSection(addEndButtons());
        this.callListeners();
    }
}
class ParallelServersConfiguration extends ModelConfiguration{
    constructor(){
        super("parallel-servers");
        addTitle("Parallel Servers Model");
        createCategoryStartDivision("configurationDivision", "Configuration Settings");
        this.addSection(createServerCountInput("server-count", "Server Count "));
        this.addSection(createQueueSizeConfiguration("queue", "Queue Visual"));
        
        createCategoryStartDivision("distributionDivision", "Distributions");
        this.addSection(createArrivalConfiguration("arrival", "Interarrival Time"));
        this.addSection(createServerConfiguration("parallel-servers", "Service Time"));
        this.addSection(addEndButtons());
        this.callListeners();
        setDefaultValue("server-count", inputs["server-count"], document.getElementById("server-count"));
    }
}
class SingleFeedbackConfiguration extends ModelConfiguration{
    constructor(){
        super("single-server-feedback");
        addTitle("Single Server with Feedback Model");
        createCategoryStartDivision("configurationDivision", "Configuration Settings");
        this.addSection(createFeedbackConfiguration("feedback", "Feedback"));
        this.addSection(createQueueSizeConfiguration("queue", "Queue Visual"));

        createCategoryStartDivision("distributionDivision", "Distributions");
        this.addSection(createArrivalConfiguration("arrival", "Interarrival Time"));
        this.addSection(createServerConfiguration("server", "Service Time"));
        this.addSection(addEndButtons());
        this.callListeners();
    }
}
class WorkstationConfiguration extends ModelConfiguration{
    constructor(){
        super("workstations");
        addTitle("Interactive Systems Model");
        createCategoryStartDivision("configurationDivision", "Configuration Settings");
        this.addSection(createWorkstationSelections());

        createCategoryStartDivision("distributionDivision", "Distributions");
        this.addSection(createServerConfiguration("workstation", "Think Time"));
        this.addSection(createServerConfiguration("processor", "Service Time"));
        this.addSection(addEndButtons());
        this.callListeners();
        setDefaultValue("server-count", inputs["server-count"], document.getElementById("server-count"));
        setDefaultValue("workstation-count", inputs["workstation-count"], document.getElementById("workstation-count"));
    }
}
class CentralServerConfiguration extends ModelConfiguration{
    constructor(){
        super("central-server");
        addTitle("Central Server Model");
        createCategoryStartDivision("configurationDivision", "Configuration Settings");
        this.addSection(createCentralCountInputs());
        this.addSection(createQueueSizeConfiguration("queue", "Queue Visual:"));
        createCategoryStartDivision("distributionDivision", "Distributions");
        this.addSection(createServerConfiguration("cpu", "CPU Service Time"));
        this.addSection(createServerConfiguration("channel", "Disk Controller Service \xa0\xa0Time"));
        createParallelDiskInput(validations["maxDiskCount"]);
        clearDiskInputs();
        this.addSection(addEndButtons());
        drawDisks({"value": inputs["disk-count"]});
        this.callListeners();
    }
}

///////////////////////////////////////////////////////////////////////////////////
//Functions to Add Components to Model Configurations           
/////////////////////////////////////////////////////////////////////////////////
function createConfigurationGroup(identifier, location, className="configuration-group"){
    location.innerHTML += `<div id="${identifier}" class="${className}"></div>`; 
    return document.getElementById(`${identifier}`);
}
function createSubDivision(identifier, location, className = "configuration-subdivision"){
    location.innerHTML += `<div id="${identifier}" class="${className}"></div>`; 
    return document.getElementById(`${identifier}`);
}
function createSectionTitle(identifier, title, destination, className="configuration-component-title"){
    var section = createSubDivision(`${identifier}-title`, destination, className);
    section.innerHTML = `\xa0\xa0${title}`;
    return section;
}
function addTitle(title){
    //var titleBig = createSubDivision("title-big-sub", body, "configuration-title-big" );
    document.getElementById("model-title").innerHTML = title;
    //titleBig.innerHTML = title;
}
function createRadioButton(identifier, name, description, value){
    var label = `<label for="${identifier}">${description}</label>`;
    var input = `<input type="radio" id="${identifier}" name="${name}" value="${value}">`;
    return label+input;
}
function createtextField(identifier, name, description, value){
    var label = `<label for="${identifier}">${description}</label>`;
    var input = `<input type="text" id="${identifier}" name="${name}" value="${value} class="configuration-text-input">`;
 
    return label+input;
}
function createInputField(identifier, name){
    var configurationGroup = createConfigurationGroup(`${identifier}-configuration`, body);
    //createSectionTitle(`${identifier}-title`, name, configurationGroup);
    var inputDivision = createSubDivision(`${identifier}-input`,configurationGroup, "configuration-labelless-division"); 
    var componentInput = {identifier : new TextField(`${identifier}`, `${identifier}`, `${name}`)};
    writeHTML(componentInput, inputDivision);
    return new ConfigurationSection(`${identifier}`, componentInput, addUpdateListener);
}
function createServerCountInput(identifier, name){
    var configurationGroup = createConfigurationGroup(`${identifier}-configuration`, body);
    //createSectionTitle(`${identifier}-title`, name, configurationGroup);
    var inputDivision = createSubDivision(`${identifier}-input`,configurationGroup, "configuration-labelless-division"); 
    var componentInput = {identifier : new TextField(`${identifier}`, `${identifier}`, `${name} [1,8]: `)};
    writeHTML(componentInput, inputDivision);
    return new ConfigurationSection(`${identifier}`, componentInput, serverCountListener);
}
function createDiskWeightConfiguration(identifier){
    var weightIdentifier = `${identifier}-weight`;
    var configurationGroup = createConfigurationGroup(weightIdentifier, body, "disk-weight-group");
    createSectionTitle(`weightIdentifier-title`, "", configurationGroup, "disk-weight-title");
    var inputDivision = createSubDivision(`${weightIdentifier}-input`,configurationGroup, "disk-weight-input"); 
    var componentInput = {weightIdentifier : new TextField(`${weightIdentifier}`, `${weightIdentifier}`, `${name}`)};
    writeHTML(componentInput, inputDivision);
    return new ConfigurationSection(`${weightIdentifier}-input`, componentInput, diskWeightListener);
}
function createQueueSizeConfiguration(identifier, name){
    var configurationGroup = createConfigurationGroup(`queue-group`, body);
    //createSectionTitle(identifier, name, configurationGroup);
    var inputDivision = createSubDivision(`queue-input`,configurationGroup, "configuration-labelless-division"); 
    var queueInput = {"queueInput" : new TextField(`queue-size`, `queue-size`, 
        `Visible Queue Size [${validations.minQueueSize},${validations.maxQueueSize}]:`)};
    setDefaultQueueSize(queueInput.queueInput);
    writeHTML(queueInput, inputDivision);
    return new ConfigurationSection(`queue-size`, queueInput, queueListener);
}
function createFeedbackConfiguration(identifier, name){
    var configurationGroup = createConfigurationGroup(identifier, body);
    //createSectionTitle(identifier, name, configurationGroup);
    var inputDivision = createSubDivision(`${identifier}-feedback-input`,configurationGroup, "configuration-labelless-division"); 
    var feedbackInput = {"feedbackInput" : new TextField(`${identifier}-return-rate`, `${identifier}-return-rate`, "Return Rate:")};
    writeHTML(feedbackInput, inputDivision);
    inputDivision.innerHTML += "\xa0\xa0%";
    return new ConfigurationSection(`${identifier}-return-rate`, feedbackInput, feedbackListener);
}
function addInputListener(identifier, passedFunction){
    var component = document.getElementById(identifier);
    component.oninput = function(){
        passedFunction(component);
    }
}
function updateInputs(component){
    inputs[component.id] = component.value; 
    findConfigurationErrors();
}
function addUpdateListener(identifier){
    var component = document.getElementById(identifier);
    component.oninput = function(){
        updateInputs(component);
    }
}
function updateNumber(component){
    if (validateNumber(component))
        updateInputs(component);
}
function serverCountListener(component){
    if (validateRange(validations["minServerCount"], validations["maxServerCount"], component))
        updateInputs(component);
}

//Components With Distributions
function createServerConfiguration(identifier, title){
    var configurationGroup = createConfigurationGroup(identifier, body);
    createSectionTitle( identifier, title, configurationGroup);
    var buttons = createDistributionButtons(identifier, configurationGroup);
    var listener = createDistributionInputs;
    return new ConfigurationSection(identifier, buttons, listener);
}
function createArrivalConfiguration(identifier, title){
    var configurationGroup = createConfigurationGroup(identifier, body);
    createSectionTitle( identifier, title, configurationGroup);
    var arrivalOptions = createDistributionButtons(identifier, configurationGroup);
    return new ConfigurationSection(identifier, arrivalOptions, createDistributionInputs);
};
function createDistributionButtons(identifier, destination, className = "distribution-group"){   
    var distributionLocation = createSubDivision(`${identifier}-distribution`, destination, `${className}`);
    var buttonLocation = createSubDivision(`${identifier}-distribution-buttons`,distributionLocation);
    var addedButtons = { 
        "constant": new RadioButton(`${identifier}-distribution-constant`, `${identifier}-distribution-buttons`, 'Constant', 'constant'),
        "uniform": new RadioButton(`${identifier}-distribution-uniform`, `${identifier}-distribution-buttons`, 'Uniform', 'uniform'),
        "exponential": new RadioButton(`${identifier}-distribution-exponential`, `${identifier}-distribution-buttons`, 'Exponential', 'exponential')
    }
    writeHTML(addedButtons, buttonLocation);
    var textInputLocation = createSubDivision(`${identifier}-distribution-input`, distributionLocation, "distribution-input");
    return addedButtons;
}
function createDistributionInputs(identifier){
    var destination = document.getElementById(`${identifier}-distribution-input`);
    distributionSectionNames[`${identifier}`] = identifier;

    var textInputs = {
        "constant": {
            "value": new TextField(`${identifier}-constant-input`,`${identifier}-constant-input`, '| Value:') },
        "uniform": {
            "uniform-lower": new TextField(`${identifier}-uniform-lower`,`${identifier}-uniform-lower`, '|  Min:'),
            "uniform-upper": new TextField(`${identifier}-uniform-upper`,`${identifier}-uniform-upper`, 'Max:')},
        "exponential": { 
            "value": new TextField(`${identifier}-exponential-input`,`${identifier}-exponential-input`, '|  Mean Value:')}
    }
    setDefaultDistributionValues(identifier, textInputs);
    var inputType = inputs[`${identifier}-distribution-type`];
    if(inputType == "" || inputType == undefined){
        inputs[`${identifier}-distribution-type`] = "constant";
        inputType = inputs[`${identifier}-distribution-type`];
    }
    document.getElementById(`${identifier}-distribution-${inputType}`).checked = true;
    writeHTML(textInputs[inputType], destination);
    switch(inputType){
        case "constant":
            addInputListener(`${identifier}-constant-input`, distributionListener);
            break;
        case "uniform":
            addInputListener(`${identifier}-uniform-lower`, distributionListener);
            addInputListener(`${identifier}-uniform-upper`, distributionListener);
            break;
        case "exponential":
            addInputListener(`${identifier}-exponential-input`, distributionListener);
            break;
    }
    document.getElementById(`${identifier}-distribution-constant`).onclick = function() {
        writeHTML(textInputs.constant, destination);
        addInputListener(`${identifier}-constant-input`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'constant';
        fillDistributionField(identifier, "constant");
    };
    document.getElementById(`${identifier}-distribution-uniform`).onclick = function() {
        writeHTML(textInputs.uniform, destination);
        addInputListener(`${identifier}-uniform-lower`, distributionListener);
        addInputListener(`${identifier}-uniform-upper`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'uniform';
        fillDistributionField(identifier, "uniform");
        
    };
    document.getElementById(`${identifier}-distribution-exponential`).onclick = function() {
        writeHTML(textInputs.exponential, destination)
        addInputListener(`${identifier}-exponential-input`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'exponential';
        fillDistributionField(identifier, "exponential");
    };
    return textInputs;
}

function createWorkstationInputs(identifier){
    var destination = document.getElementById(`${identifier}-distribution-input`);
    distributionSectionNames[`${identifier}`] = identifier;

    var textInputs = {
        "constant": {
            "value": new TextField(`${identifier}-constant-input`,`${identifier}-constant-input`, '| Value:') },
        "uniform": {
            "uniform-lower": new TextField(`${identifier}-uniform-lower`,`${identifier}-uniform-lower`, '|  Min:'),
            "uniform-upper": new TextField(`${identifier}-uniform-upper`,`${identifier}-uniform-upper`, 'Max:')},
        "exponential": { 
            "value": new TextField(`${identifier}-exponential-input`,`${identifier}-exponential-input`, '|  Mean Value:')}
    }
    setDefaultDistributionValues(identifier, textInputs);
    var inputType = inputs[`${identifier}-distribution-type`];
    if(inputType == "" || inputType == undefined){
        inputs[`${identifier}-distribution-type`] = "constant";
        inputType = inputs[`${identifier}-distribution-type`];
    }
    document.getElementById(`${identifier}-distribution-${inputType}`).checked = true;
    writeHTML(textInputs[inputType], destination);
    switch(inputType){
        case "constant":
            addInputListener(`${identifier}-constant-input`, distributionListener);
            break;
        case "uniform":
            addInputListener(`${identifier}-uniform-lower`, distributionListener);
            addInputListener(`${identifier}-uniform-upper`, distributionListener);
            break;
        case "exponential":
            addInputListener(`${identifier}-exponential-input`, distributionListener);
            break;
    }
    document.getElementById(`${identifier}-distribution-constant`).onclick = function() {
        writeHTML(textInputs.constant, destination);
        addInputListener(`${identifier}-constant-input`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'constant';
        fillDistributionField(identifier, "constant");
    };
    document.getElementById(`${identifier}-distribution-uniform`).onclick = function() {
        writeHTML(textInputs.uniform, destination);
        addInputListener(`${identifier}-uniform-lower`, distributionListener);
        addInputListener(`${identifier}-uniform-upper`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'uniform';
        fillDistributionField(identifier, "uniform");
        
    };
    document.getElementById(`${identifier}-distribution-exponential`).onclick = function() {
        writeHTML(textInputs.exponential, destination)
        addInputListener(`${identifier}-exponential-input`, distributionListener);
        inputs[`${identifier}-distribution-type`] = 'exponential';
        fillDistributionField(identifier, "exponential");
    };
    return textInputs;
}
function fillDistributionField(identifier, distribution){
    //FILL IN FORM DATA
    switch(distribution){
        case "constant":
            var constantInput = document.getElementById(`${identifier}-constant-input`);
            if(inputs[constantInput.id] != undefined && inputs[constantInput.id] != null){
                constantInput.value = inputs[constantInput.id];
            } 
            break;
        case "uniform":
            var lower = document.getElementById(`${identifier}-uniform-lower`);
            var upper = document.getElementById(`${identifier}-uniform-upper`);
            if(inputs[lower.id] != undefined && inputs[lower.id] != null){
                 lower.value = inputs[lower.id];
            }
            if(inputs[upper.id] != undefined && inputs[upper.id] != null){
                upper.value = inputs[upper.id];
            }
            break;
        case "exponential":
            var exponentialInput = document.getElementById(`${identifier}-exponential-input`);
            if(inputs[exponentialInput.id] != undefined && inputs[exponentialInput.id] != null){
                exponentialInput.value = inputs[exponentialInput.id];
            }
            break; 
    }

}
function fillServerInput(identifier){
    var distribution = inputs[`${identifier}-distribution-type`];
    var checkedButton = document.getElementById(`${identifier}-distribution-${distribution}`);
    checkedButton.checked = true;
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', false, true);
    checkedButton.dispatchEvent(event);
    fillDistributionField(identifier, distribution);
}
//Single Server with Feedback Specific
function createFeedbackConfiguration(identifier, name){
    var configurationGroup = createConfigurationGroup(identifier, body);
    //createSectionTitle(identifier, name, configurationGroup);
    var inputDivision = createSubDivision(`${identifier}-feedback-input`,configurationGroup, "configuration-labelless-division"); 
    var feedbackInput = {"feedbackInput" : new TextField(`${identifier}-return-rate`, `${identifier}-return-rate`, "Feedback Probability:")};
    setDefaultFeedbackValue(feedbackInput.feedbackInput);
    writeHTML(feedbackInput, inputDivision);
    inputDivision.innerHTML += "\xa0\xa0%";
    return new ConfigurationSection(`${identifier}-return-rate`, feedbackInput, feedbackListener);
}
//Interactive Workstations Specific
function createWorkstationSelections(){
    var configurationGroup = createConfigurationGroup("component-counts", body);
    //createSectionTitle("component-counts", "", configurationGroup);
    var inputDivision = createSubDivision(`componentCount-input`,configurationGroup, "configuration-labelless-division");
    
    var inputs = {
        "workstationCount": new TextField("workstation-count", "workstation-count", "Number of Workstations[1,8]: "),
        "serverCount": new TextField("server-count", "server-count", "\xa0\xa0|  Number of Servers[1,8]:")
    };
    writeHTML(inputs, inputDivision);
    return new ConfigurationSection("componentCounts", inputs, countListener);
}
//Interactive Workstations Specific
function createWorkstationServerCount(){
    var configurationGroup = createConfigurationGroup("server-count-group", body);
    //createSectionTitle("server-count", "Server Count", configurationGroup);
    var inputDivision = createSubDivision(`server-count`,configurationGroup, "configuration-labelless-division");
    var serverCount = {"serverCount": new TextField("server-count", "server-count", "Quantity[1,8]:")};
    writeHTML(serverCount, inputDivision);
    return new ConfigurationSection("server-count", serverCount, serverCountListener);
}
function createWorkstationCount(){
    var configurationGroup = createConfigurationGroup("workstation-count-group", body);
    //createSectionTitle("workstation-count", "Workstation Count", configurationGroup);
    var inputDivision = createSubDivision(`workstation-count`,configurationGroup, "configuration-labelless-division");
    var workstationCount = {"workstationCount": new TextField("workstation-count", "workstation-count", "Quantity[1,8]:")};
    writeHTML(workstationCount, inputDivision);
    return new ConfigurationSection("workstation-count", workstationCount, workstationCountListener);
}
//Central Server Specific
function createCentralCountInputs(){
    var configurationGroup = createConfigurationGroup("component-counts", body);
    //createSectionTitle("component-counts", "", configurationGroup);
    var inputDivision = createSubDivision(`countInputs`,configurationGroup, "configuration-labelless-division");
    var diskInputs = {   
        "core-count": new TextField("core-count", "core-count", "Number of Cores[1,8]:"),
        "disk-count": new TextField("disk-count", "disk-count", "|  Number of Disks[1,8]:"),
        "job-count": new TextField("job-count", "job-count", "|  Number of Jobs:")
    };  
    diskInputs["disk-count"].value = inputs["disk-count"];
    diskInputs["job-count"].value = inputs["job-count"];
    diskInputs["core-count"].value = inputs["core-count"];
    writeHTML(diskInputs, inputDivision); 
    return new ConfigurationSection("component-counts", diskInputs, centralCountListener);
}
//Central Server Specific
function createDiskDistributionConfiguration(identifier, title){
    var configurationGroup = createConfigurationGroup(identifier, body, "disk-configuration-group");
    createSectionTitle( identifier, title, configurationGroup);
    var buttons = createDiskDistributionButtons(identifier, configurationGroup, "disk-distribution-group");
    var listener = createDistributionInputs;
    return new ConfigurationSection(identifier, buttons, listener);
}
function createDiskDistributionButtons(identifier, destination, className = "disk-distribution-group"){   
    var distributionLocation = createSubDivision(`${identifier}-distribution`, destination, `${className}`);
    var buttonLocation = createSubDivision(`${identifier}-distribution-buttons`,distributionLocation, "disk-distribution-group");
    var addedButtons = { 
        "constant": new RadioButton(`${identifier}-distribution-constant`, `${identifier}-distribution-buttons`, 'Constant', 'constant'),
        "uniform": new RadioButton(`${identifier}-distribution-uniform`, `${identifier}-distribution-buttons`, 'Uniform', 'uniform'),
        "exponential": new RadioButton(`${identifier}-distribution-exponential`, `${identifier}-distribution-buttons`, 'Exponential', 'exponential')
    }
    writeHTML(addedButtons, buttonLocation);
    var textInputLocation = createSubDivision(`${identifier}-distribution-input`, distributionLocation, "disk-distribution-input");
    return addedButtons;
}
//Category Divisions
function createCategoryStartDivision(identifier, title){
    var configurationGroup = createConfigurationGroup(identifier, body);
    createSectionTitle( identifier, title, configurationGroup, "configuration-category-start-division");
}
function createCategoryEndDivision(identifier){
    var configurationGroup = createConfigurationGroup(identifier, body);
    createSectionTitle( identifier, title, configurationGroup, "configuration-category-end-division");
}
function createCategoryEndDivision(identifier){

}
///////////////////////////////////////////////////////
// Input Handling and Validations
///////////////////////////////////////////////////////
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
function writeCookies(){
    for(var i = 0; keys = Object.keys(inputs), i < keys.length; i++){
        document.cookie = `${keys[i]}=${inputs[keys[i]]}; samesite=lax;`;
    }
}
function writeCookie(name, value){
    document.cookie = `${name} = ${value}; samesite=lax;`;
}
/*
function clearCookies(){
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
}
*/
function clearCookies(){
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;samesite=lax;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function validateCountInput(component){
    var result = component.value.replace(/\D|^0/, '');//.substr(0, component.value.length - 1);
    if (result == component.value) return true;
    else{
        if(component.value.length == 0)
            component.value = "";
        else 
            component.value = result;
        return false;
    }
}
function validateNumber(userInput){
    var value = userInput.value;
    if( isNumeric(value) ){
        return true;
    }
    else{
        if(value.length != 0)
            userInput.value = value.substr(0, value.length - 1);
        else
            userInput.value = "";
        return false;
    }
}
function isNumeric(numberToCheck){
    return !isNaN(numberToCheck - parseFloat(numberToCheck));
}
function validateWholeNumber(userInput){
    var result = userInput.value.replace(/^0|\D/, '');
    if (result == userInput.value) return true;
    else{
        userInput.value = result;
        return false;
    }
}
function validateSingleServer(){
    return (
        validateDistribution("arrival") && 
        validateDistribution("server") &&
        validateQueueSize()
    );
}
function validateParallelServer(){
    return (
        validateDistribution("arrival") &&
        validateDistribution("parallel-servers") &&
        checkRange(minServerCount, maxServerCount, inputs["server-count"]) &&
        validateQueueSize()
    );
}
function validateSingleFeedback(){
    return (
        validateDistrubtion("arrival") &&
        validateDistribution("server") &&
        checkRange(inputs["feedback-return-rate"]) &&
        validateQueueSize()
    );
}
function validateInteractive(){
    return (
        checkRange(minServerCount, maxServerCount, inputs["server-count"]) &&
        checkRange(minWorkstationCount, maxWorkstationCount, inputs["workstation-count"]) &&
        validateDistribution("workstation") &&
        validateDistribution("processor")
    );
}
function validateRange(min, max, component){
    var numericalValue = parseFloat(component.value);
    if ( isNumeric(component.value) && (min <= numericalValue) && (numericalValue <= max) )         
        return true;
    else{
        if(component.value.length != 0)
            component.value = component.value.substring(0, component.value.length-1);
    }
    return false;
}
function validateWholeNumberRange(min, max, component){
    var numericalValue = parseFloat(component.value);
    if ( validateWholeNumber(component) )
        return validateRange(min,max,component);
    return false;
}



////////////////////////////////////////////////////
// Listeners
///////////////////////////////////////////////////
function writeHTML(inputText, location){
    location.innerHTML = "";
    for(var key in inputText){
        location.innerHTML += inputText[key].generateHTML();
   }
}
function distributionListener(component){
    if (validateRange(0, Infinity, component)){
        updateInputs(component);
    }
}
function countListener(identifier){
    addInputListener("server-count", serverCountUpdate);
    addInputListener("workstation-count", workstationUpdate);
}
function serverCountListener(identifier){
    addInputListener(identifier, serverCountUpdate);
}
function workstationCountListener(identifier){
    addInputListener(identifier, workstationCountListener);
}
function serverCountUpdate(component){
    if(validateWholeNumberRange(validations["minServerCount"], validations["maxServerCount"], component))
        updateInputs(component);
}
function workstationUpdate(component){
    if(validateWholeNumberRange(validations["minWorkstationCount"], validations["maxWorkstationCount"], component))
        updateInputs(component);
}
function centralCountListener(identifier){
    addInputListener("job-count", jobUpdate);
    addInputListener("disk-count", diskUpdate),
    addInputListener("core-count", coreUpdate);
}
function coreUpdate(component){
    if(validateWholeNumberRange(validations["minCoreCount"], validations["maxCoreCount"], component))
        updateInputs(component);
}
function diskWeightListener(component){
    var inputIdentifier = component.id.replace("-input", "");
    if(validateNumber(component))
        inputs[`${inputIdentifier}`] = component.value;
}
function diskWeightUpdate(component){
    if(validateNumber(component.value))
        updateInputs(component);
}
function jobUpdate(component){
    if(validateWholeNumberRange(validations["minJobCount"], validations["maxJobCount"], component))
        updateInputs(component);
}
function diskUpdate(component){
    if(validateWholeNumberRange(validations["minDiskCount"], validations["maxDiskCount"], component))
        updateInputs(component);
    drawDisks(component);
}
function drawDisks(component){
    clearDiskInputs();
    for(var i = 0; i < component.value; i++){
        var identifier = `disk-${i+1}`;
        var configurationGroup = document.getElementById(identifier);
        createSectionTitle( identifier, `Disk ${i+1} Service Time`, configurationGroup, "disk-distribution-title");
        createDistributionButtons(identifier, configurationGroup, "disk-distribution-group");
        createDistributionInputs(identifier);
        fillServerInput(identifier);
        drawDiskWeightInput(identifier);
    }
}
function drawDiskWeightInput(identifier){
    var weightIdentifier = `${identifier}-weight`;
    var configurationGroup = document.getElementById(`${weightIdentifier}`);

    createSectionTitle(`${weightIdentifier}-title`, "", configurationGroup, "disk-weight-title");
    var inputDivision = createSubDivision(`${weightIdentifier}-division`,configurationGroup, "disk-weight-input"); 
    var componentInput = {"textInput" : new TextField(`${weightIdentifier}-input`, `${weightIdentifier}`, `Access Probability / Visits: `)};

    if(inputs[`${weightIdentifier}`] == null || inputs[`${weightIdentifier}`] == undefined)
        inputs[`${weightIdentifier}`] = defaultParameters["centralServer"]["disk-weight"];

    componentInput["textInput"].value = inputs[`${weightIdentifier}`];
    writeHTML(componentInput, inputDivision);
    addInputListener(`${weightIdentifier}-input`, diskWeightListener);
}
function clearDiskInputs(){
    for(var i = 0; i < validations["maxDiskCount"]; i++){
        var section = document.getElementById(`disk-${i+1}`)
        if(section != null)
            section.innerHTML ='';
        var weightSection = document.getElementById(`disk-${i+1}-weight`);
        if(weightSection != null)
            weightSection.innerHTML = ``;
    }
}
function createParallelDiskInput(count){
    var diskIdentifiers = [];
    var diskSections = [];
    for(var i = 0; i < count; i++){
        var identifier = `disk-${i+1}`;
        diskSections.push(createDiskDistributionConfiguration(identifier, `Disk ${i+1}`));
        diskIdentifiers.push(identifier);
        createDistributionInputs(identifier);
        diskSections.push(createDiskWeightConfiguration(identifier));
    }
    return diskSections;
}
function feedbackListener(identifier){
    var component = document.getElementById(identifier);
    component.oninput = function(){
        feedbackUpdate(component);
    }
}
function feedbackUpdate(component){
    if (validateRange(validations["minFeedbackRate"], validations["maxFeedbackRate"], component)){
        inputs["feedback-return-rate"] = component.value;
    };
}
function queueListener(identifier){
    var component = document.getElementById(identifier);
    component.oninput = function(){
        if(queueUpdate(component)) inputs["queue-size"] = component.value;
        findConfigurationErrors();
    }
}
function queueUpdate(component){
    if(component.value.length >2){
        component.value = component.value.substr(0, component.value.length-1);
    }
    return validateCountInput(component);
}
//////////////////////////////////////////////////
// Creating the Configuration Sections
/////////////////////////////////////////////////
function createConfiguration(){
    var configuration = undefined; 
    
    setDefaultParameters(selectedModel);
    switch(selectedModel){
        case "singleServer":
            configuration = new SingleServerConfiguration();
            break;
        case "parallelServers":
            configuration = new ParallelServersConfiguration();
            break;
        case "singleFeedback":
            configuration = new SingleFeedbackConfiguration();
            break;
        case "workstations":
            configuration = new WorkstationConfiguration();
            break;
        case "centralServer":
            configuration = new CentralServerConfiguration();
            break;
    }
    clearCookies();
    writeCookie("selectedModel", selectedModel);
    return configuration;
}

//End Buttons Are The Run / Select Model Buttons 
function addEndButtons(){
    addErrorSection();
    var buttons = {
        "select-button": new Button("select-button", "Select Model"),
        "run-button": new Button("run-button", "Run"),
        "details-button": new Button("details-button", "Description")
    } 
    var endButtonGroup = createConfigurationGroup("end-buttons", body);
    endButtonGroup.innerHTML += buttons[`run-button`].generateHTML();
    endButtonGroup.innerHTML += buttons[`select-button`].generateHTML();
    endButtonGroup.innerHTML += buttons[`details-button`].generateHTML();
    
    return new ConfigurationSection("endButtons", buttons, endButtonListener); 
}
function addErrorSection(){
   var errorOutput = createConfigurationGroup("error-output", body);
   errorOutput.style.color = "Red";
}
function writeConfigurationError(errorText){
    document.getElementById("error-output").innerHTML = errorText;
}
function clearConfigurationError(){
    document.getElementById("error-output").innerHTML = "";
}
function findConfigurationErrors(){
    var displayedErrors = "";
    if(!checkQueueSize())
        displayedErrors += "Invalid Queue Size"; 
    if(!checkDistributions()){
        if(displayedErrors !== "") displayedErrors += ", ";
        displayedErrors += "Invalid Distribution ";
    }
        
    writeConfigurationError(displayedErrors);
    return displayedErrors;
}
function runSimulation(){
    if( findConfigurationErrors() == ""){
        writeCookies();
        window.location.href = "../Pages/runTime.html";
    }
}
function addDescriptionSection(description){
    var overlay = document.getElementById("overlay");
    overlay.innerHTML = description;
    overlay.style.display = "block";
    overlay.innerHTML += `
    </br></br>
    <b>Click anywhere within the description to close.</b>
    `;
    overlay.onclick = function(){
        overlay.style.display = "none";
    }

}
function endButtonListener(){  
    var selectButton = document.getElementById("select-button");
    var runButton = document.getElementById("run-button");
    var detailsButton = document.getElementById("details-button");
    selectButton.onclick = function(){
        window.location.href = "../Pages/modelSelection.html";
    }
    runButton.onclick = runSimulation;
       
    
    detailsButton.onclick = function(){
        switch(selectedModel){
            case "singleServer":
                addDescriptionSection(singleServerDescription);
                break;
            case "parallelServers":
                addDescriptionSection(parallelServersDescription);
                break;
            case "singleFeedback":
                addDescriptionSection(singleFeedbackDescription);
                break;
            case "workstations":
                addDescriptionSection(interactiveWorkstationsDescription);
                break;
            case "centralServer":
                addDescriptionSection(centralServerDescription);
                break;
        }
    }
}
function checkQueueSize(){
    var queueSection = document.getElementById("queue-size");
    if (queueSection == null) return true;
    var currentSize = queueSection.value;
    if(currentSize < validations["minQueueSize"] || currentSize > validations["maxQueueSize"])
        return false;
    return true;
}
function checkDistributions(){
    for( var name in distributionSectionNames ){
        var distributionType = inputs[`${name}-distribution-type`];
        if(name == "workstation"){
            if(distributionType == 'uniform')
            if (parseFloat(inputs[`${name}-uniform-lower`]) > parseFloat(inputs[`${name}-uniform-upper`]) ){ 
                if(document.getElementById(`${name}-distribution-input`) !== undefined)
                    return false;
            }
            break;
        }
        switch(distributionType){
            case "uniform":
            /*
                if(parseFloat(inputs[`${name}-uniform-upper` == 0])){
                    return false;
                }
            */
                if (parseFloat(inputs[`${name}-uniform-lower`]) > parseFloat(inputs[`${name}-uniform-upper`]) ){ 
                    if(document.getElementById(`${name}-distribution-input`) !== undefined)
                        return false;
                }
                break;
            case "exponential":
                if(parseFloat(inputs[`${name}-exponential-input`]) == 0)
                    return false;
                break;
            case "constant":
                if(parseFloat(inputs[`${name}-constant-value`]) == 0 )
                    return false;
                break;
        }

    }

    return true;
}
createConfiguration();



