
function outputNumber(number){
    if(isNaN(number) )
        return "--";
    else return number;
}
//Generates headings from array or map
function generateTableHeadings(tableHeadings){
    var output = "<tr>";
    if(Array.isArray(tableHeadings)){
        tableHeadings.forEach(element => {
            output += `<th>${element}</th>`;
        });
    }
    else{
        for(var key in tableHeadings){
            output += `<th>${outputNumber(tableHeadings[key])}</th>`;
        }
    }
    return output += "</tr>"
}
//Generates rows from array or map
function generateTableData(tableData){
    var output = "<tr>"
    if(Array.isArray(tableData)){
        tableData.forEach(element => {
            output += `<td>${element}</td>`;
        });
    }
    else{
        for(var key in tableData){
            output += `<td>${outputNumber(tableData[key])}</td>`;
        }
    }
    return output += "</tr>";
}
//Generates headings followed by rows from headings / data
function generateTable(tableHeadings, tableData){
    var output = generateTableHeadings(tableHeadings);
    output += generateTableData(tableData);
    return output;
}
function generateLabeledRow(label, data){
    var output = "";
    output += `<tr>`
    output += `<td>${label}</td>`;
    output += `<td>${outputNumber(data)}</td>`;
    output += `</tr>`;
    return output;
}
function generateOutputTables(tableHeadings, tableData){
    var output = "";
    output+= `<th>${tableData[0]}</th> `;
    
    for(var i = 1; i < tableHeadings.length; i++){
        output += `<tr>`
        output += `<td>${tableHeadings[i]}</td>`;
        output += `<td>${outputNumber(tableData[i])}</td>`;
        output += `</tr>`;
    }
    return output;
}
function generateTinyTable(tableData){
    var output = "<tr>"
    if(Array.isArray(tableData)){
        tableData.forEach(element => {
            output += `<td class="tiny-table-data">${outputNumber(element)}</td>`;
        });
    }
    else{
        for(var key in tableData){
            output += `<td class="tiny-table-data">${outputNumber(tableData[key])}</td>`;
        }
    }
    return output += "</tr>";
}
function generateTinyHeadings(tableHeadings){
    var output = "<tr>"
    if(Array.isArray(tableHeadings)){
        tableHeadings.forEach(element => {
            output += `<th class="tiny-table-heading">${element}</th>`;
        });
    }
    else{
        for(var key in tableHeadings){
            output += `<th class="tiny-table-heading">${outputNumber(tableHeadings[key])}</th>`;
        }
    }
    return output += "</tr>";
}
function simulationToTable(){
    var generalHeadings = ["Current Time", "Jobs Completed", "Response Time"];
    var generalData = [currentTime, tasksCompleted, cumulativeResponseTime / tasksCompleted];
    var output = "<tr>";
    generalHeadings.forEach(element => {
        output += `<th>${element}</th>`;
    });
    output += "</tr><tr>"
    generalData.forEach(element => {
        output += `<td>${element}</td>`;
    });
    output += "</tr>";
    return output;
}


//for output
function addTableRow(tableIdentifier, textResults){
    var table = document.getElementById(tableIdentifier);
    var output = "<tr>";
    textResults.forEach(element => {
        output += `<td>${element}</td>`;
    });
    output += "</tr>";
    table.innerHTML += output;
}
function addTableHeading(tableIdentifier, textResults){
    var table = document.getElementById(tableIdentifier);
    var output = "<tr>";
    textResults.forEach(element => {
        output += `<th>${element}</th>`;
    });
    output += "</tr>";
    table.innerHTML += output;
}
function addTable(identifier, location){
    var destination = document.getElementById(location);
    destination.innerHTML += `<table id="${identifier}"></table>`;
}
function createTableSection(tableIdentifier){
    document.body.innerHTML += `<div id="${tableIdentifier}Div"></div>`;
    addTable(`${tableIdentifier}`, `${tableIdentifier}Div`);
    return document.getElementById(tableIdentifier);
}
