var descriptionDivision = document.getElementById("description-block");

function placeNavigationButtons(){
    var destination = document.getElementById("help-navigation");
}

function writeDescription(identifier, descriptionText){
    document.getElementById(identifier).onclick = function(){
        descriptionDivision.innerHTML = `<div class = "help-description-inner-body"> ${descriptionText} </div>`;
    };
}


const aboutDescription =`
    <div class = "help-description-title"> About </div>

    Welcome to Queueing Model Animation and Simulation System (QAS)!

   
    QAS is a a simulation and visualization program written to help develop a greater understanding of queueing theory.
    The program contains five queueing systems with user-defined parameters. Systems are evaluated using event-driven simulation
    and a visualization is presented to the user.
    
    </br></br>
    <div class = "help-description-title"> Simulation: </div>
    This program contains an event-driven simulator. The simulator portion will repeatedly process the next event to occur 
    and does not directly correspond to real passing time. This eliminates errors created by system scheduling or machine
    differences. 

    There is a simulation time initialized at zero. 
    As events occur in the system the time is forwarded to the time of the next event and any new events that must be created as a response
    are then pushed onto the event queue. This process is repeated, and results are calculated as the events are processed.

    </br> </br>
    <div class = "help-description-title"> Visualization: </div>
    Visualization occurs based on real time and is rendered onto an HTML canvas. 
    The update rate set changes the speed that items occur on screen-- this can be thought of as 
    scaled time. When the appropriate amount of time passes the simulator will be told to advance.
    The simulator does not need to do any work until that time is reached. 
    This time is modular and may be slowed down, sped up, paused, or even forgone completely in favor of pure simulation for faster result
    calculations. 

`;

const terminologyDescription =`
    <div class = "help-description-title"> Terminology: </div>

    <b> Queue: </b> A container for jobs be processed stored in a retrievable and definite order. </br> 
    <b> Job / Task: </b> A singular component requesting service. </br> 
    <b> Server: </b> An element which processes a job. </br> 
    <b> Arrival Time: </b> The time at which a job enters the starting point of a system. </br> 
    <b> Interarrival Time: </b> The time between two consecutive arrivals. </br> 
    <b> Response Time: </b> The time it takes for a job completes one cycle of processing within a system. </br> 
    <b> Server Utilization: </b> The fraction of time a service element is busy over total time. </br> 
    <b> Throughput: </b> Average time for a job to complete one cycle per unit of time. </br> 
    <b> Open System: </b> A system allowing for arrivals into the system and departures with no chance of   
        returning after a jov is processed. </br> 
    <b> Closed System: </b> A system where jobs may return for further processing after departure. </br> 
    <b> Distribution: </b> The spread of a component based on mathematical formulae. </br> 
    <b> Distribution Types: </b>
        </br> \u00a0\u00a0\u00a0\u00a0 M- Markov (Poisson, exponential)
        </br> \u00a0\u00a0\u00a0\u00a0 D- Deterministic (Constant)
        </br> \u00a0\u00a0\u00a0\u00a0 U- Uniform (Evenly spread between two points)
        </br> \u00a0\u00a0\u00a0\u00a0 G- General
        </br> \u00a0\u00a0\u00a0\u00a0 GI- General Independent
`;

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

const modelSelectionDescription = `
    <div class = "help-description-title"> Model Selection: </div>
    In the model selection page it is possible to choose between one of five models: Single Server, Single Server with Feedback,
    Parallel Servers, Interactive Workstations, or Central Server. To move on and begin configuration simply click on one of the models.
    To return to the main menu the header "QAS" in the top left corner may be clicked.

    <img src="../Images/model_selection.PNG" alt="Model Selection" width="60%"  class="image-left">

`;
const modelConfigurationDescription = `
    <div class = "help-description-title"> Model Configurations: </div>
    Configurations are unique to the specific model chosen. Fill out the fields as desired-- most invalid inputs will automatically be incapable of
    entry. This is not possible for all fields, but if the run button is pressed with invalid inputs an error will be displayed. After being
    satisfied with the configuration options select the run button to see the model in action. Alternatively, if a different model is desired
    the select model button may be pressed.

    </br></br>
    <div class = "help-description-title"> Input: </div>
    Invalid inputs for most components will not be possible. For some this is not possible to regulate, but a notification will occur 
    explaining what fields are invalid if the run button is pressed.
    </br></br>

    <b>Distribution Rates:</b> 
    </br> The distribution configurations contain the distribution type and values for that given distribution.
    </br>The choices here are:
    </br>\u00a0\u00a0\u00a0\u00a0 -Constant: a set unchanging value
    </br>\u00a0\u00a0\u00a0\u00a0 -Uniform: a random value between the lower and upper bound, evenly distributed
    </br>\u00a0\u00a0\u00a0\u00a0 -Exponential: Poisson Distribution, with a configurable mean. 
    <img src="../Images/distributions.PNG" alt="Distribution Inputs" maxwidth="60%"  class="image-left">

    </br></br><b> Count or Number Input: </b>
    </br>  Various models have numerical inputs such as server count or amount of queue slots visible. These components have a valid
    range indicated and cannot be set outside of this range. 
    <img src="../Images/count_input.PNG" alt="Count Input" maxwidth="60%"  class="image-left">
    </br></br>


    
`;
const modelRuntimeDescription = `
    <div class = "help-description-title"> Runtime: </div>

    <b>Navigation Buttons:</b>
    </br> The navigation buttons may be seen in the top of the page above the model. They are "Select Model", "Change Parameters", and
    "Restart Current Model". The select model button returns to the model selection page. The change parameters button will take you back
    to the configuration page for the model that is currently displayed. The restart model button will clear the model, results, and begin
    freshly with the same parameters
    <img src="../Images/navigation_menu.PNG" alt="Navigation Menu" width="60%"  class="image-left">


    </br></br>
    <b>Speed Controls:</b>
    </br>The Speed controls can be found at the bottom of the page below the shown model. The choices here are related to the speed at which the
    model will run. There is a slider to control the animation rate. The maximum speed button forgoes animations completely in order to run significantly faster calculations. The single step
    option will pause the model then process a single event every time the button is pressed.
    <img src="../Images/speed_controls.PNG" alt="Speed Controls" width="60%"  class="image-left">

    </br></br>
    <b>Results:</b>
    </br>Results for the shown model will appear on the right-hand side of the screen. 
    <img src="../Images/result_example.PNG" alt="Results Example" maxwidth="60%"  class="image-left">
`;

writeDescription("about-button", aboutDescription);
writeDescription("terminology-button", terminologyDescription);
writeDescription("single-server", singleServerDescription);
writeDescription("single-feedback", singleFeedbackDescription);
writeDescription("parallel-servers", parallelServersDescription);
writeDescription("interactive-workstations", interactiveWorkstationsDescription);
writeDescription("central-server", centralServerDescription);
writeDescription("model-selection", modelSelectionDescription);
writeDescription("model-configuration", modelConfigurationDescription);
writeDescription("model-runtime", modelRuntimeDescription);



descriptionDivision.innerHTML = `<div class = "help-description-inner-body"> ${aboutDescription} </div>`;