var single = document.getElementById("single-server");
var feedback = document.getElementById("single-feedback");
var parallel = document.getElementById("parallel-servers");
var workstations = document.getElementById("workstations");
var center = document.getElementById("central-server");

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
clearCookies();
single.onclick = function(){ 
    document.cookie = `selectedModel = singleServer; samesite = lax`;
    window.location.href = "../Pages/modelConfiguration.html";
}

feedback.onclick = function() {
    document.cookie = `selectedModel = singleFeedback;samesite = lax`;
    window.location.href = "../Pages/modelConfiguration.html";
}
parallel.onclick = function() {
    document.cookie = `selectedModel = parallelServers;samesite = lax`;
    window.location.href = "../Pages/modelConfiguration.html";
}
workstations.onclick = function() {
    document.cookie = `selectedModel = workstations;samesite = lax`;
    window.location.href = "../Pages/modelConfiguration.html";
}
center.onclick = function() {
    document.cookie = `selectedModel = centralServer;samesite = lax`;
    window.location.href = "../Pages/modelConfiguration.html";
}