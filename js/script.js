// JavaScript Document

class Node {
    name; //String
    startEarly; //int up left
    startLate; //int down left
    endEarly; //int up right
    endLate; //int down right
    time;
    slack;

    precesors = []; // Node[]
    sucesors = []; // Node[]
    precesorChars; // String[]

    constructor(name, precesorChars, time) {
        this.name = name;
        this.precesorChars = precesorChars;
        this.time = time;
        this.startEarly = 0;
        this.startLate = 0;
        this.endEarly = 0;
        this.endLate = 0;
        this.slack = 0;
    }
}

class Graph {

    start; //Node
    end; //Node
    nodesList; // Node []

    constructor() {
        this.start = new Node("Inicio", [], 0);
        this.end = new Node("Fin", [], 0);
        this.nodesList = [];
    }

    addNodes(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            this.nodesList.push(new Node(data[i]["name"], data[i]["precesors"].split(","), data[i]["time"]));
        }
    }

    setEdges() {
        for (var i = 0; i < this.nodesList.length; i++) {
            if (this.nodesList[i].precesorChars == "") {
                this.nodesList[i].precesors.push(this.start);
                this.start.sucesors.push(this.nodesList[i]);
            } else {
                for (var j = 0; j < this.nodesList[i].precesorChars.length; j++) {
                    for (var k = 0; k < this.nodesList.length; k++) {
                        if (this.nodesList[k].name == this.nodesList[i].precesorChars[j]) {
                            this.nodesList[i].precesors.push(this.nodesList[k]);
                            this.nodesList[k].sucesors.push(this.nodesList[i]);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < this.nodesList.length; i++) {
            if (this.nodesList[i].sucesors.length == 0) {
                this.nodesList[i].sucesors.push(this.end);
                this.end.precesors.push(this.nodesList[i]);
            }
        }
    }

    calculateEarly() {
        for (var i = 0; i < this.nodesList.length; i++) {
            if (this.nodesList[i].precesors.length == 1) {
                this.nodesList[i].startEarly = this.nodesList[i].precesors[0].endEarly;
                this.nodesList[i].endEarly = this.nodesList[i].startEarly + this.nodesList[i].time;
            } else {
                var max = 0;
                var pos = null;
                for (var j = 0; j < this.nodesList[i].precesors.length; j++) {
                    if (this.nodesList[i].precesors[j].endEarly > max) {
                        max = this.nodesList[i].precesors[j].endEarly;
                        pos = j;
                    }
                }
                if (pos != null) {
                    this.nodesList[i].startEarly = this.nodesList[i].precesors[pos].endEarly;
                    this.nodesList[i].endEarly = this.nodesList[i].startEarly + this.nodesList[i].time;
                }
            }
        }

        if (this.end.precesors.length == 1) {
            this.end.startEarly = this.end.precesors[0].endEarly;
            this.end.endEarly = this.end.startEarly + this.end.time;
        } else {
            var max = 0;
            var pos = null;
            for (var j = 0; j < this.end.precesors.length; j++) {
                if (this.end.precesors[j].endEarly > max) {
                    max = this.end.precesors[j].endEarly;
                    pos = j;
                }
            }
            if (pos != null) {
                this.end.startEarly = this.end.precesors[pos].endEarly;
                this.end.endEarly = this.end.startEarly + this.end.time;
            }
        }
    }

    calculateLate() {
        for (var i = 0; i < this.nodesList.length; i++) {
            //AQUI VAMOS
        }
    }

    getDataMatrix() {
        var matrix = [];

        for (var i = 0; i < this.nodesList.length; i++) {
            var row = [];

            var precesorsTemp = [];
            for (var j = 0; j < this.nodesList[i].precesors.length; j++) {
                precesorsTemp.push(this.nodesList[i].precesors[j].name);
            }

            row["name"] = this.nodesList[i].name;
            row["precesors"] = precesorsTemp.join(",");
            row["time"] = this.nodesList[i].time;
            row["slack"] = this.nodesList[i].slack;
            row["startEarly"] = this.nodesList[i].startEarly;
            row["startLate"] = this.nodesList[i].startLate;
            row["endEarly"] = this.nodesList[i].endEarly;
            row["endLate"] = this.nodesList[i].endLate;

            matrix.push(row);
        }

        return matrix;
    }

    reset() {
        this.start = new Node("Inicio", [], 0);
        this.end = new Node("Fin", [], 0);
        this.nodesList = [];
    }
}

var graph = new Graph();
var dataTable = [];

function setDataRow() {
    var row = [];
    row["name"] = $('#name').val();
    row["precesors"] = $('#precesors').val();
    row["time"] = parseInt($('#time').val());
    dataTable.push(row);
    $('#name').val("");
    $('#precesors').val("");
    $('#time').val("");
    printIniTable();
}

function printIniTable() {
    $('#iniTable').empty();
    for (var i = 0; i < dataTable.length; i++) {
        $('#iniTable').append(
            "<tr><td>" + dataTable[i]["name"] + "</td>" +
            "<td>" + dataTable[i]["precesors"] + "</td>" +
            "<td>" + dataTable[i]["time"] + "</td></tr>"
        );
    }
}

function processIniTable() {
    graph.reset();
    graph.addNodes(dataTable);
    graph.setEdges();
    graph.calculateEarly();

    //console.log(graph.start);
    //console.log(graph.nodesList);
    //console.log(graph.end);
    printFinalTable()
}

function printFinalTable() {
    $('#finalTable').empty();
    var matrix = graph.getDataMatrix();
    for (var i = 0; i < matrix.length; i++) {
        var string =
            "<td>" + matrix[i]["name"] + "</td>" +
            "<td>" + matrix[i]["precesors"] + "</td>" +
            "<td>" + matrix[i]["time"] + "</td>" +
            "<td>" + matrix[i]["slack"] + "</td>" +
            "<td>" + matrix[i]["startEarly"] + "</td>" +
            "<td>" + matrix[i]["startLate"] + "</td>" +
            "<td>" + matrix[i]["endEarly"] + "</td>" +
            "<td>" + matrix[i]["endLate"] + "</td>";

        $('#finalTable').append(
            "<tr>" + string + "</tr>"
        );
    }
    printGraph();
}

function printGraph() {

    // create an array with nodes
    var matrix = graph.getDataMatrix();
    var nodes = [];
    for (var i = 0; i < matrix.length; i++) {
        nodes.push({
            id: matrix[i]["name"],
            level: 2,
            label:
                "Actividad " + matrix[i]["name"] + "\n" +
                "Duración:" + matrix[i]["time"] + "\n" +
                "Holgura:" + matrix[i]["slack"] + "\n" +
                "Inicio Temprano:" + matrix[i]["startEarly"] + "\n" +
                "Inicio Tardio:" + matrix[i]["startLate"] + "\n" +
                "Fin Temprano:" + matrix[i]["endEarly"] + "\n" +
                "Fin Tardio:" + matrix[i]["endLate"]
        });
    }
    nodes.push({
        id: graph.start.name,
        label: graph.start.name,
        color: { background: '#631919' },
        level: 1,
    });
    nodes.push({
        id: graph.end.name,
        label: graph.end.name,
        color: { background: '#631919' },
        level: 3,
    });
    nodes = new vis.DataSet(nodes);

    // create an array with edges
    var edges = [];
    for (var i = 0; i < graph.nodesList.length; i++) {
        for (var j = 0; j < graph.nodesList[i].sucesors.length; j++) {

            edges.push({
                from: graph.nodesList[i]["name"],
                to: graph.nodesList[i].sucesors[j].name
            });
        }
    }

    for (var i = 0; i < graph.start.sucesors.length; i++) {

        edges.push({
            from: graph.start.name,
            to: graph.start.sucesors[i].name
        });
    }
    edges = new vis.DataSet(edges);

    // create a network
    //var container = $('#mynetwork');
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        edges: {
            arrows: {
                to: { enabled: true }
            }
        },
        nodes: {
            shape: 'database',
            physics: false,
            color: {
                border: '#007bff',
                background: '#19631C',
            },
            font: {
                color: '#ffffff',
                bold: {
                    color: '#ffffff',
                },
            },
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            hideNodesOnDrag: false,
            hover: false,
            hoverConnectedEdges: false,//
            keyboard: {
                enabled: false,
                speed: { x: 10, y: 10, zoom: 0.02 },
                bindToWindow: true
            },
            multiselect: false,
            navigationButtons: false,
            selectable: false,//
            selectConnectedEdges: false,//
            tooltipDelay: 10,
            zoomSpeed: 1,
            zoomView: true
        }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);
}
/*
data[0] = [];
data[0]["name"] = "A";
data[0]["precesors"] = "";
data[0]["value"] = 3;
data[1] = [];
data[1]["name"] = "B";
data[1]["precesors"] = "A";
data[1]["value"] = 3;
data[2] = [];
data[2]["name"] = "C";
data[2]["precesors"] = "A";
data[2]["value"] = 7;
data[3] = [];
data[3]["name"] = "D";
data[3]["precesors"] = "C";
data[3]["value"] = 2;
data[4] = [];
data[4]["name"] = "E";
data[4]["precesors"] = "B,D";
data[4]["value"] = 4;
data[5] = [];
data[5]["name"] = "F";
data[5]["precesors"] = "D";
data[5]["value"] = 3;
data[6] = [];
data[6]["name"] = "G";
data[6]["precesors"] = "E,F";
data[6]["value"] = 7;
graph.addNodes(data);
*/

