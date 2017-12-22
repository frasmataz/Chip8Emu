/**
 * Created by Fraser on 26/06/2015.
 */

var table;
var emu = new chip8();
var frameskip = 32;
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

runTest = function() {
    //1nnn JP addr
    emu = new chip8();
    emu.mem[0x200]=0x11;
    emu.mem[0x201]=0x00;
    emu.emulateCycle();
    if (emu.pc == 0x100)
        console.log("JP addr test pass");
    else {
        console.log("JP addr test failed, expected pc=0x100");
        printRegs();
    }
    emu={}

    //2nnn CALL addr
    emu = new chip8();
    emu.mem[0x200]=0x21;
    emu.mem[0x201]=0x00;
    emu.emulateCycle();
    if (emu.pc == 0x100 && emu.stack[0]==0x200 && emu.sp == 1)
        console.log("CALL addr test pass");
    else {
        console.log("CALL addr test failed, expected pc=0x100,stack[0]=0x200,sp=1");
        printRegs();
    }
    emu={}

    //3xkk SE Vx, byte
    emu = new chip8();
    emu.mem[0x200]=0x30;
    emu.mem[0x201]=0x42;
    emu.V[0]=0x42;
    emu.emulateCycle();
    if (emu.pc == 0x204)
        console.log("SE Vx, byte test pass");
    else {
        console.log("SE Vx, byte test failed, expected pc=0x204");
        printRegs();
    }
    emu={}

    //4xkk SNE Vx, byte
    emu = new chip8();
    emu.mem[0x200]=0x40;
    emu.mem[0x201]=0x42;
    emu.V[0]=0x43;
    emu.emulateCycle();
    if (emu.pc == 0x204)
        console.log("SNE Vx, byte test pass");
    else {
        console.log("SNE Vx, byte test failed, expected pc=0x204");
        printRegs();
    }
    emu={}

    //5xy0 SE Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x50;
    emu.mem[0x201]=0x10;
    emu.V[0]=0x42;
    emu.V[1]=0x42;
    emu.emulateCycle();
    if (emu.pc == 0x204)
        console.log("SE Vx, Vy test pass");
    else {
        console.log("SE Vx, Vy test failed, expected pc=0x204");
        printRegs();
    }
    emu={}

    //6xkk LD Vx, byte
    emu = new chip8();
    emu.mem[0x200]=0x60;
    emu.mem[0x201]=0x42;
    emu.emulateCycle();
    if (emu.V[0] == 0x42)
        console.log("LD Vx, byte test pass");
    else {
        console.log("LD Vx, byte test failed, expected V0=0x42");
        printRegs();
    }
    emu={}

    //7xkk ADD Vx, byte
    emu = new chip8();
    emu.mem[0x200]=0x70;
    emu.mem[0x201]=0x42;
    emu.V[0]=0x42;
    emu.emulateCycle();
    if (emu.V[0] == 0x84)
        console.log("ADD Vx, byte test pass");
    else {
        console.log("ADD Vx, byte test failed, expected V[0]=0x84");
        printRegs();
    }
    emu={}

    //8xy0 LD Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x10;
    emu.V[1]=0x42;
    emu.emulateCycle();
    if (emu.V[0] == 0x42)
        console.log("LD Vx, Vy test pass");
    else {
        console.log("LD Vx, Vy test failed, expected V[0]=0x42");
        printRegs();
    }
    emu={}

    //8xy1 OR Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x11;
    emu.V[0]=0x3C;
    emu.V[1]=0x33;
    emu.emulateCycle();
    if (emu.V[0] == 0x3F)
        console.log("OR Vx, Vy test pass");
    else {
        console.log("OR Vx, Vy test failed, expected V[0]=0x3F");
        printRegs();
    }
    emu={}

    //8xy2 AND Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x12;
    emu.V[0]=0x3C;
    emu.V[1]=0x33;
    emu.emulateCycle();
    if (emu.V[0] == 0x30)
        console.log("AND Vx, Vy test pass");
    else {
        console.log("AND Vx, Vy test failed, expected V[0]=0x30");
        printRegs();
    }
    emu={}

    //8xy3 XOR Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x13;
    emu.V[0]=0x3C;
    emu.V[1]=0x33;
    emu.emulateCycle();
    if (emu.V[0] == 0x0F)
        console.log("XOR Vx, Vy test pass");
    else {
        console.log("XOR Vx, Vy test failed, expected V[0]=0x0F");
        printRegs();
    }
    emu={}

    //8xy4 ADD Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x14;
    emu.V[0]=0xD2;
    emu.V[1]=0xD2;
    emu.emulateCycle();
    if (emu.V[0] == 0xA4  && emu.V[15] == 0x01)
        console.log("ADD Vx, Vy test pass");
    else {
        console.log("ADD Vx, Vy test failed, expected V[0]=0xA4,V[F]=0x01");
        printRegs();
    }
    emu={}

    //8xy5 SUB Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x15;
    emu.V[0]=0x3C;
    emu.V[1]=0x33;
    emu.emulateCycle();
    if (emu.V[0] == 0x09 && emu.V[15] == 0x01)
        console.log("SUB Vx, Vy test pass");
    else {
        console.log("SUB Vx, Vy test failed, expected V[0]=0x09,V[F]=0x01");
        printRegs();
    }
    emu={}

    //8xy6 SHR Vx {, Vy}
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x16;
    emu.V[0]=0x15;
    emu.emulateCycle();
    if (emu.V[0] == 0x0A && emu.V[15] == 0x01)
        console.log("SHR Vx {, Vy} test pass");
    else {
        console.log("SHR Vx {, Vy} test failed, expected V[0]=0x0A,V[F]=0x01");
        printRegs();
    }
    emu={}

    //8xy7 SUBN Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x17;
    emu.V[0]=0x15;
    emu.V[1]=0x42;
    emu.emulateCycle();
    if (emu.V[0] == 0x2D && emu.V[15] == 0x01)
        console.log("SUBN Vx, Vy test pass");
    else {
        console.log("SUBN Vx  Vy test failed, expected V[0]=0x2D,V[F]=0x01");
        printRegs();
    }
    emu={}

    //8xyE SHL Vx {, Vy}
    emu = new chip8();
    emu.mem[0x200]=0x80;
    emu.mem[0x201]=0x1E;
    emu.V[0]=0xCD;
    emu.emulateCycle();
    if (emu.V[0] == 0x9A && emu.V[15] == 0x01)
        console.log("SUBN Vx {, Vy} test pass");
    else {
        console.log("SUBN Vx {, Vy} test failed, expected V[0]=0x9A,V[F]=0x01");
        printRegs();
    }
    emu={}

    //9xy0 SNE Vx, Vy
    emu = new chip8();
    emu.mem[0x200]=0x90;
    emu.mem[0x201]=0x10;
    emu.V[0]=0x42;
    emu.V[1]=0x43;
    emu.emulateCycle();
    if (emu.pc == 0x204)
        console.log("SNE Vx, Vy test pass");
    else {
        console.log("SUBN Vx, Vy test failed, expected pc=0x204");
        printRegs();
    }
    emu={}

    //Annn LD I, addr
    emu = new chip8();
    emu.mem[0x200]=0xA1;
    emu.mem[0x201]=0x23;
    emu.emulateCycle();
    if (emu.I == 0x123)
        console.log("LD I, addr test pass");
    else {
        console.log("LD I, addr test failed, expected I=0x123");
        printRegs();
    }
    emu={}

    //Bnnn JP V0, addr
    emu = new chip8();
    emu.mem[0x200]=0xB1;
    emu.mem[0x201]=0x23;
    emu.V[0]=0x42
    emu.emulateCycle();
    if (emu.pc == 0x165)
        console.log("JP V0, addr test pass");
    else {
        console.log("JP V0, addr test failed, expected I=0x165");
        printRegs();
    }
    emu={}

    //Cxkk RND Vx, byte
    //NO TEST

    //Dxyn DRW Vx, Vy, nibble
    //NO TEST

    //Ex9E SKP Vx
    //NO TEST

    //ExA1 SKNP Vx
    //NO TEST

    //Fx07 LD Vx, DT
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x07;
    emu.delaytimer=0x42;
    emu.emulateCycle();
    if (emu.V[0] == 0x42)
        console.log("LD Vx, DT test pass");
    else {
        console.log("LD Vx, DT test failed, expected V[0]=0x42");
        printRegs();
    }
    emu={}

    //Fx0A LD Vx, K
    //NO TEST

    //Fx15 LD DT, Vx
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x15;
    emu.V[0]=0x42;
    emu.emulateCycle();
    if (emu.delaytimer == 0x42)
        console.log("LD DT, Vx test pass");
    else {
        console.log("LD DT, Vx test failed, expected V[0]=0x42");
        printRegs();
    }
    emu={}

    //Fx18 LD ST, Vx
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x18;
    emu.V[0]=0x42;
    emu.emulateCycle();
    if (emu.soundtimer == 0x42)
        console.log("LD ST, Vx test pass");
    else {
        console.log("LD ST, Vx test failed, expected V[0]=0x42");
        printRegs();
    }
    emu={}

    //Fx1E ADD I, Vx
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x1E;
    emu.I=0x02
    emu.V[0]=0x42;
    emu.emulateCycle();
    if (emu.I == 0x44)
        console.log("ADD I, Vx test pass");
    else {
        console.log("ADD I, Vx test failed, expected V[0]=0x44");
        printRegs();
    }
    emu={}

    //Fx29 LD F, Vx
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x29;
    emu.V[0]=0x02;
    emu.emulateCycle();
    if (emu.I == 0x0A)
        console.log("LD F, Vx test pass");
    else {
        console.log("LD F, Vx test failed, expected I=0x0A");
        printRegs();
    }
    emu={}

    //Fx33 LD B, Vx
    emu = new chip8();
    emu.mem[0x200]=0xF0;
    emu.mem[0x201]=0x33;
    emu.V[0]=0x7B;
    emu.I=0x300;
    emu.emulateCycle();
    if (emu.mem[0x300] == 0x01 && emu.mem[0x301] == 0x02 && emu.mem[0x302] == 0x03)
        console.log("LD B, Vx test pass");
    else {
        console.log("LD B, Vx test failed, expected mem[0x300 - 0x302] = 0x01, 0x02, 0x03");
        printRegs();
        console.log("mem[0x300-0x302] = " + emu.mem[0x300].toString(16) + ", " +emu.mem[0x301].toString(16) + ", " + emu.mem[0x302].toString(16) );
    }
    emu={}

    //Fx55 LD [I], Vx
    emu = new chip8();
    emu.mem[0x200]=0xFF;
    emu.mem[0x201]=0x55;
    for (var i=0; i<16; i++)
        emu.V[i]=i;

    emu.I=0x300;
    emu.emulateCycle();

    var testpass=true;

    for (var i=0; i<16; i++)
        if (emu.mem[emu.I+i]!=i)
            testpass=false;

    if (testpass)
        console.log("LD [I], Vx test pass");
    else {
        console.log("LD [I], Vx test failed, expected I=0x0A");
        printRegs();
    }
    emu={}

    //Fx55 LD Vx, [I]
    emu = new chip8();
    emu.mem[0x200]=0xFF;
    emu.mem[0x201]=0x65;
    for (var i=0; i<16; i++)
        emu.mem[0x300+i]=i;

    emu.I=0x300;
    emu.emulateCycle();

    var testpass=true;

    for (var i=0; i<16; i++)
        if (emu.V[i]!=i)
            testpass=false;

    if (testpass)
        console.log("LD Vx, [I] test pass");
    else {
        console.log("LD Vx, [I] test failed, expected I=0x0A");
        printRegs();
    }
    emu={}
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
}

doReset = function(newFile) {
    file = newFile;
    reset = true;

    if(!running) {
        running = true;
        load();
    }
};

updateLoop = function() {
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
            var pixel = emu.framebuffer[(y*DISPLAY_WIDTH)+x];

            if (pixel === 0)
                context.fillStyle = 'black';
            else
                context.fillStyle = 'white';

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
