/**
 * Created by Fraser on 26/06/2015.
 */

var table;
var emu = new chip8();
var delay = 0;
var Vcells = [];
var display = document.getElementById('display');
var context = display.getContext('2d');
var DISPLAY_HEIGHT = 32;
var DISPLAY_WIDTH = 64;
var prevMem;

function load (file) {
    var reader = new FileReader();
    emu = new chip8();

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
    }

    reader.readAsBinaryString(file);


    document.onkeydown = function(e) {
        emu.keystatus[emu.keycodes.indexOf(e.keyCode)] = true;
    };

    document.onkeyup = function(e) {
        emu.keystatus[emu.keycodes.indexOf(e.keyCode)] = false;
    };
};

updateLoop = function() {
    emu.emulateCycle();
    updateScreen();
    setTimeout(updateLoop,delay);
};

updateScreen = function() {

    if(emu.mem != prevMem) {
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

    if (emu.drawFlag) {
        for (var x=0; x<DISPLAY_WIDTH; x++) {
            for (var y=0; y<DISPLAY_HEIGHT; y++) {
                var pixel = emu.framebuffer[(y*DISPLAY_WIDTH)+x];

                if (pixel === 0)
                    context.fillStyle = 'black';
                else
                    context.fillStyle = 'white';

                context.fillRect(x*10, y*10, (x+1)*10, (y+1)*10);
            }
        }
    }

    prevMem = emu.mem;
};
