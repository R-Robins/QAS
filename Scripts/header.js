document.body.innerHTML += `<button id="home" class="help-navigation-button" >QAS Home</button>`;
    //<button id="selection" class="help-navigation-button" >Model Selection</button>`;

var titleButton = document.getElementById("home");
titleButton.onclick = function(){
    window.location.href = "../index.html";
}
/*
var titleButton = document.getElementById("selection");
titleButton.onclick = function(){
    window.location.href = "../Pages/modelSelection.html";
}
*/
