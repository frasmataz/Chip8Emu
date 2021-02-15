var table;
var emu = new chip8();
var frameskip = 1;
var delay = 0;
var Vcells = [];
var display = document.getElementById('display');
var context = display.getContext('2d');
var DISPLAY_HEIGHT = 32;
var DISPLAY_WIDTH = 64;
var prevMem;
var colorDisplay = true;
var firstCycle;
var reset = false;
var file = null;
var running = false;

var regDisplay = document.getElementById('registerCanvas');
var regContext = regDisplay.getContext('2d');
var pcDisplay = document.getElementById('pcCanvas');
var pcContext = pcDisplay.getContext('2d');
var iDisplay = document.getElementById('iCanvas');
var iContext = iDisplay.getContext('2d');
var ramDisplay = document.getElementById('ramCanvas');
var ramContext = ramDisplay.getContext('2d');

function load () {
    var reader = new FileReader();
    emu = new chip8();
    firstCycle = true;

    reader.onload = function(e) {
        var rawData = reader.result;

        for (var l = 0; l<rawData.length; l++)
        {
            emu.mem[l+0x200] = rawData.charCodeAt(l);
        }

        table = document.getElementById("romTable");

        for (var k = 0; k<16; k++) {
            Vcells.push(document.getElementById("V" + k.toString(16).toUpperCase() + "cell"));
        }

        updateLoop();
    };

    reader.readAsBinaryString(file);

    document.onkeydown = function(e) {
        emu.keystatus[emu.keycodes.indexOf(e.keyCode)] = true;
    };

    document.onkeyup = function(e) {
        emu.keystatus[emu.keycodes.indexOf(e.keyCode)] = false;
    };
}

printRegs = function() {
    console.log("PC="+emu.pc.toString(16));
    console.log("I="+emu.I.toString(16));
    console.log("SP="+emu.sp);
    for (var i=0; i<16; i++) {
        console.log("V"+i.toString(16)+"="+emu.V[i].toString(16));
    }
    for (var i=0; i<16; i++) {
        if(emu.stack[i] != null)
            console.log("stack["+i+"]="+emu.stack[i].toString(16));
        else
            console.log("stack["+i+"]=NULL");
    }
    console.log(emu.mem);
}

doReset = function(newFile) {
    file = newFile;
    reset = true;

    if(!running) {
        running = true;
        load();
    }
};

sleepFor = function( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

updateLoop = function() {
    sleepFor(100);
    for (var i=0; i < frameskip; i++) {
        emu.emulateCycle();
    }

    updateScreen();

    if(reset) {
        reset = false;
        load();
    } else {
        setTimeout(updateLoop, delay);
    }
};

speedup = function() {
    if (frameskip * 2 <= 4096)
        frameskip = frameskip * 2;

    document.getElementById('speedlabel').innerHTML = "Speed: " + frameskip;
};

speeddown = function() {
    if (frameskip / 2 >= 1)
        frameskip = frameskip / 2;

    document.getElementById('speedlabel').innerHTML = "Speed: " + frameskip;
};

updateScreen = function() {
    for (var x=0; x<DISPLAY_WIDTH; x++) {
        for (var y=0; y<DISPLAY_HEIGHT; y++) {
            if (emu.framebuffer[y][x])
                context.fillStyle = 'white';
            else
                context.fillStyle = 'black';

            context.fillRect(x*10, y*10, (x+1)*10, (y+1)*10);
        }
    }

    if (colorDisplay) {
        var byte;
        var r;
        var g;
        var b;

        for (var v = 0; v < 16; v++) {
            byte = emu.V[v];
            r = (((byte & 0xC0) >> 6) + 1) * 64;
            g = (((byte & 0x38) >> 3) + 1) * 32;
            b = ((byte & 0x07) + 1) * 32;

            regContext.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            regContext.fillRect(v * 40, 0, (v + 1) * 40, 40);
        }

        byte = emu.pc;
        r = (((byte & 0xC0) >> 6) + 1) * 64;
        g = (((byte & 0x38) >> 3) + 1) * 32;
        b = ((byte & 0x07) + 1) * 32;

        pcContext.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        pcContext.fillRect(0, 0, (v + 1) * 40, 40);

        byte = emu.I;
        r = (((byte & 0xC0) >> 6) + 1) * 64;
        g = (((byte & 0x38) >> 3) + 1) * 32;
        b = ((byte & 0x07) + 1) * 32;

        iContext.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        iContext.fillRect(0, 0, (v + 1) * 40, 40);

        if(emu.ramUpdateFlag || firstCycle) {
            for (var a = 0; a < 0x1000; a++) {
                byte = emu.mem[a];

                r = (((byte & 0xC0) >> 6) + 1) * 64;
                g = (((byte & 0x38) >> 3) + 1) * 32;
                b = ((byte & 0x07) + 1) * 32;


                ramContext.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                ramContext.fillRect((a % 32) * 20, Math.floor(a / 32) * 20, 20, 20);
            }
        }
    } else {
        if(emu.ramUpdateFlag || firstCycle) {
            var newTbody = document.createElement('tbody');

            for (var i = 0; i < 0x1000; i+=16) {
                var newRow = newTbody.insertRow(newTbody.rows.length);

                var cell1 = newRow.insertCell(0);
                cell1.innerHTML = ("000" + i.toString(16)).substr(-3).toUpperCase();

                for (var j = 0; j < 16; j++) {
                    var cell2 = newRow.insertCell(j+1);
                    if (emu.mem[i+j] != null)
                        cell2.innerHTML = ("0" + emu.mem[i+j].toString(16)).substr(-2).toUpperCase();
                    else
                        cell2.innerHTML = '00';
                }

                var oldTbody = table.getElementsByTagName('tbody');
                table.replaceChild(newTbody, oldTbody[0]);
            }
        }

        var pccell = document.getElementById("pccell");
        pccell.innerHTML = ("000" + emu.pc.toString(16)).substr(-3).toUpperCase();
        var Icell = document.getElementById("Icell");
        Icell.innerHTML = emu.I.toString(16).toUpperCase();

        for (var k = 0; k<16; k++) {
            if (emu.V[k] != null)
                Vcells[k].innerHTML = ("0" + emu.V[k].toString(16)).substr(-2).toUpperCase();
            else
                Vcells[k].innerHTML = "00";
        }
    }

    if(firstCycle) {
        firstCycle=false;
        document.getElementById('speedlabel').innerHTML = "Speed: " + frameskip;
    }

};
