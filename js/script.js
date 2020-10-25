// JavaScript Document

class Node {
    name; //String
    startEarly; //int up left
    startLate; //int down left
    endEarly; //int up right
    endLate; //int down right
    value;
    slack;

    precesors = []; // Node[]
    sucesors = []; // Node[]
    precesorChars; // String[]

    constructor(name, precesorChars, value) {
        this.name = name;
        this.precesorChars = precesorChars;
        this.value = value;
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
        this.start = new Node("Start", [], 0);
        this.end = new Node("End", [], 0);
        this.nodesList = [];
    }

    addNodes(data) {
        for (var i = 0; i < data.length; i++) {
            this.nodesList.push(new Node(data[i]["name"], data[i]["precesors"].split(","), data[i]["value"]));
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

    calculate() {
        for (var i = 0; i < this.nodesList.length; i++) {
            if (this.nodesList[i].precesors.length == 1) {
                this.nodesList[i].startEarly = this.nodesList[i].precesors[0].endEarly;
                this.nodesList[i].endEarly = this.nodesList[i].startEarly + this.nodesList[i].value;
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
                    this.nodesList[i].endEarly = this.nodesList[i].startEarly + this.nodesList[i].value;
                }
            }
        }

        if (this.end.precesors.length == 1) {
            this.end.startEarly = this.end.precesors[0].endEarly;
            this.end.endEarly = this.end.startEarly + this.end.value;
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
                this.end.endEarly = this.end.startEarly + this.end.value;
            }
        }
    }

    calculate2() {
        for (var i = 0; i < this.nodesList.length; i++) {
            //AQUI VAMOS
        }
    }
}

var graph = new Graph();
var data = [];
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
graph.setEdges();
graph.calculate();

console.log(graph.start);
console.log(graph.nodesList);
console.log(graph.end);