/**
 * Created by Fraser on 29/06/2015.
 */

function chip8() {
    this.keycodes = [88,49,50,51,81,87,69,65,83,68,90,67,52,82,70,86];
    this.keystatus = [];
    this.mem = [];
    this.V = [];
    this.stack = [];
    this.framebuffer = [];

    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;
    this.delaytimer = 0;
    this.soundtimer = 0;

    this.lastDelayTick = (new Date).getTime();

    this.drawFlag = false;
    this.ramUpdateFlag = false;

    for (var i = 0; i < 0x10; i++) {
        this.keystatus[i] = false;
    }

    for (var i = 0; i < 64*32; i++) {
        this.framebuffer[i] = 0;
    }

    for (var i = 0; i < 0x10; i++) {
        this.V[i] = 0x0;
    }

    for (var i = 0; i < 0x1000; i++) {
        this.mem[i] = 0x0;
    }


    this.decdt = function() {
        if (this.delaytimer > 0) {
            this.delaytimer--;
        }

        this.lastDelayTick = (new Date).getTime();
    };

    this.execute = function() {
        this.drawFlag = false;
        this.ramUpdateFlag=false;
        var address;
        var x, y, kk;

        x = (this.opcode & 0x0F00) >> 8;
        y = (this.opcode & 0x00F0) >> 4;
        kk = this.opcode & 0x00FF;
        address = this.opcode & 0x0FFF;

        var opcodeClass = (this.opcode & 0xF000) >> 12;

        switch (opcodeClass) {

            case 0x0:
                if (this.opcode == 0x0) {
                    this.pc+=2;
                } else if (this.opcode == 0x00E0) {
                    //CLS -- 0x00E0 CLEAR SCREEN

                    for (var i = 0; i < 64*32; i++) {
                        this.framebuffer[i] = 0;
                    }

                    this.pc+=2;

                } else if (this.opcode == 0x00EE) {
                    //RET -- 0x00EE RETURN FROM SUBROUTINE
                    this.pc = this.stack.pop();


                } else if (this.opcode >= 0x0000 && this.opcode < 0x0FFF) {
                    //SYS -- 0x0nnn CALL SUBROUTINE AT nnn

                    //NOT IMPLEMENTED
                }

                break;

            case 0x1:
                //JP -- 0x1nnn JUMP TO LOCATION nnn

                this.pc = address;
                break;

            case 0x2:
                //CALL -- 0x2nnn CALL FUNCTION AT LOCATION nnn

                this.stack.push(this.pc+2); //Push current position onto stack
                this.pc = address; //Jump to address
                break;

            case 0x3:
                //SE -- 0x3xkk SKIP NEXT INSTRUCTION IF Vx = kk

                if (this.V[x] == kk)
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x4:
                //SNE -- 0x4xkk SKIP NEXT INSTRUCTION IF Vx != kk

                if (this.V[x] !== kk)
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x5:
                //SE -- 0x5xy0 SKIP NEXT INSTRUCTION IF Vx = Vy

                if (this.V[x] === this.V[y])
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x6:
                //LD -- 0x6xkk SET Vx = kk

                this.V[x] = kk;
                this.pc += 2;

                break;

            case 0x7:
                //ADD -- 0x7xkk SET Vx += kk

                this.V[x] += kk;
                this.pc += 2;

                break;

            case 0x8:
                //BITWISE OPERATIONS, WHOLE LOT OF STUFF NEEDS DONE HERE

                var mode = this.opcode & 0x000F;

                switch (mode) {
                    case 0x0:
                        this.V[x] = this.V[y];
                        break;
                    case 0x1:
                        this.V[x] = this.V[x] | this.V[y];
                        break;
                    case 0x2:
                        this.V[x] = this.V[x] & this.V[y];
                        break;
                    case 0x3:
                        this.V[x] = this.V[x] ^ this.V[y];
                        break;
                    case 0x4:
                        var result = this.V[x] + this.V[y];

                        if (result > 0xFF) {
                            this.V[0xF] = 1;
                            result -= 0xFF;
                        } else {
                            this.V[0xF] = 0;
                        }

                        this.V[x] = result;
                        break;
                    case 0x5:
                        if (this.V[x] > this.V[y])
                            this.V[0xF] = 1;
                        else
                            this.V[0xF] = 0;

                        (this.V[x] -= this.V[y]) & 0xFF;

                        break;
                    case 0x6:
                        this.V[0xF] = (this.opcode & 0x0001);
                        this.V[x] = Math.floor(this.V[x] / 2);
                        break;
                    case 0x7:
                        if (this.V[y] > this.V[x])
                            this.V[0xF] = 1;
                        else
                            this.V[0xF] = 0;

                        this.V[x] = (this.V[y] - this.V[x]) & 0xFF;
                        break;
                    case 0xE:
                        if (this.V[x] & 0x80)
                            this.V[0xF] = 1;
                        else
                            this.V[0xF] = 0;

                        this.V[x] = (this.V[x] *= 2) & 0xFF;

                        break;
                }

                this.pc += 2;

                break;

            case 0x9:
                //SNE -- 0x9xy0 SKIP NEXT INSTRUCTION IF Vx != Vy

                if (this.V[x] !== this.V[y])
                    this.pc += 4;
                else
                    this.pc += 2;

                break;

            case 0xA:
                //LD -- 0xAnnn SET REGISTER I TO nnn

                this.I = this.opcode & 0x0FFF;
                this.pc += 2;

                break;

            case 0xB:
                //JP -- 0xBnnn JUMP TO LOCATION nnn + V0

                this.pc = (this.opcode & 0x0FFF) + this.V[0];
                this.pc += 2;

                break;

            case 0xC:
                //RND -- 0xCxkk SET Vx = RANDOM BYTE && kk

                this.V[x] = (Math.floor(Math.random()*256) & kk)
                this.pc += 2;

                break;

            case 0xD:
                //DRW -- 0xDxyn DISPLAY N BYTE SPRITE STARTING AT MEMORY LOCATION I
                //AT (Vx, Vy), set VF = COLLISION

                var n = this.opcode & 0x000F;

                var dx = (this.V[x]);
                var dy = (this.V[y]);

                var overflowtest = true;

                while (overflowtest) {
                    overflowtest = false;
                    if(dx >= 64) {
                        dx -= 64;
                        overflowtest = true;
                    }
                    if(dx < 0) {
                        dx += 64;
                        overflowtest = true;
                    }
                    if(dy >= 32) {
                        dy -= 32;
                        overflowtest = true;
                    }
                    if(dy < 0) {
                        dy += 32;
                        overflowtest = true;
                    }
                }

                for (var i = 0; i < n; i++) {
                    var byte = this.mem[this.I+i];
                    var startOfRow = ((i+dy) * 64) + dx - 1;
                    var collide = false;

                    for (var j = 0; j < 8; j++) {
                        if ((this.framebuffer[startOfRow+(8-j)] == 1) && (((byte & Math.pow(2,j) == 1)) >> j)) {
                            collide = true;
                        }

                        this.framebuffer[startOfRow+(8-j)] ^= ((byte & Math.pow(2,j)) >> j);
                    }
                }

                if (collide) {
                    this.V[0xF] = 1;
                    console.log("COLLIDE");
                }
                else
                    this.V[0xF] = 0;

                // for (var i = 0; i < n; i++) {
                //     var byte = this.mem[this.I + i]
                //     var buffer = (64 * (this.V[y] + i)) + this.V[x];
                //
                //     for (var j = 0; j < 8; j++) {
                //         this.framebuffer[buffer + j] ^= (Math.pow(2,j) & (byte >> j) >> j);
                //     }
                // }

                this.pc += 2;
                this.drawFlag = true;

                break;

            case 0xE:

                var mode = this.opcode & 0x00FF;

                switch (mode) {
                    case 0x9E:
                        if (this.keystatus[this.V[x]])
                            this.pc+=4;
                        else
                            this.pc+=2;
                        break;

                    case 0xA1:
                        if (!(this.keystatus[this.V[x]]))
                            this.pc+=4;
                        else
                            this.pc+=2;
                        break;
                }

                break;

            case 0xF:
                var mode = this.opcode & 0x00FF;

                switch (mode) {
                    case 0x07:
                        //Vx == DT
                        this.V[x] = this.delaytimer;
                        break;

                    case 0x0A:
                        //WAIT FOR KEY PRESS, VALUE INTO Vx
                        var keyPressed = -1;
                        for (var i = 0; i < 0x10; i++) {
                            if (this.keystatus[i]) {
                                keyPressed = i;
                            }
                        }

                        if (keyPressed != -1)
                            this.V[x] = keyPressed;
                        else
                            this.pc -= 2; //CANCEL OUT PC STEP LATER
                                          //...i know.. it's awful
                        break;

                    case 0x15:
                        //DT = Vx
                        this.delaytimer = this.V[x];
                        break;

                    case 0x18:
                        //ST = Vx
                        this.soundtimer = this.V[x];
                        break;

                    case 0x1E:
                        //I = I + Vx
                        this.I += this.V[x];
                        break;

                    case 0x29:
                        //I = position of built-in char Vx
                        this.I = this.V[x] * 5;
                        break;

                    case 0x33:
                        //Store BCD of Vx in I, I+1 and I+2
                        this.mem[this.I] = Math.floor(this.V[x] / 100) % 10;
                        this.mem[this.I+1] = Math.floor(this.V[x] / 10) % 10;
                        this.mem[this.I+2] = Math.floor(this.V[x] / 1) % 10;

                        this.ramUpdateFlag=true;
                        break;

                    case 0x55:
                        //Store registers in memory starting at I
                        for (var i = 0x0; i < 0x10; i++) {
                            this.mem[this.I+i] = this.V[x+i];
                        }

                        this.ramUpdateFlag=true;
                        break;

                    case 0x65:
                        //Read registers from memory starting at I
                        for (var i = 0x0; i < 0x10; i++) {
                            this.V[x+i] = this.mem[this.I+i];
                        }

                        break;
                }

                this.pc+=2;
                break;
        }
    };

    this.emulateCycle = function() {
        //Fetch the next opcode.  Opcodes are two bytes long, so we need to merge two bytes to get it.
        //if (this.mem[pc] == null)
        //    this.mem[pc] = 0x00;
        //
        //if (this.mem[pc+1] == null)
        //    this.mem[pc+1] = 0x00;

        this.opcode = this.mem[this.pc] << 8 | this.mem[this.pc+1];
        this.execute();

        if ((new Date).getTime() > (this.lastDelayTick + 17)) {
            this.decdt();
        }
    };

    this.setupSprites = function() {

        this.mem[0x00] = 0xF0;
        this.mem[0x01] = 0x90;
        this.mem[0x02] = 0x90; // 0
        this.mem[0x03] = 0x90;
        this.mem[0x04] = 0xF0;

        this.mem[0x05] = 0x20;
        this.mem[0x06] = 0x60;
        this.mem[0x07] = 0x20; // 1
        this.mem[0x08] = 0x20;
        this.mem[0x09] = 0x70;

        this.mem[0x0A] = 0xF0;
        this.mem[0x0B] = 0x10;
        this.mem[0x0C] = 0xF0; // 2
        this.mem[0x0D] = 0x80;
        this.mem[0x0E] = 0xF0;

        this.mem[0x0F] = 0xF0;
        this.mem[0x10] = 0x10;
        this.mem[0x11] = 0xF0; // 3
        this.mem[0x12] = 0x10;
        this.mem[0x13] = 0xF0;

        this.mem[0x14] = 0x90;
        this.mem[0x15] = 0x90;
        this.mem[0x16] = 0xF0; // 4
        this.mem[0x17] = 0x10;
        this.mem[0x18] = 0x10;

        this.mem[0x19] = 0xF0;
        this.mem[0x1A] = 0x80;
        this.mem[0x1B] = 0xF0; // 5
        this.mem[0x1C] = 0x10;
        this.mem[0x1D] = 0xF0;

        this.mem[0x1E] = 0xF0;
        this.mem[0x1F] = 0x80;
        this.mem[0x20] = 0xF0; // 6
        this.mem[0x21] = 0x90;
        this.mem[0x22] = 0xF0;

        this.mem[0x23] = 0xF0;
        this.mem[0x24] = 0x10;
        this.mem[0x25] = 0x20; // 7
        this.mem[0x26] = 0x40;
        this.mem[0x27] = 0x40;

        this.mem[0x28] = 0xF0;
        this.mem[0x29] = 0x90;
        this.mem[0x2A] = 0xF0; // 8
        this.mem[0x2B] = 0x90;
        this.mem[0x2C] = 0xF0;

        this.mem[0x2D] = 0xF0;
        this.mem[0x2E] = 0x90;
        this.mem[0x2F] = 0xF0; // 9
        this.mem[0x30] = 0x10;
        this.mem[0x31] = 0xF0;

        this.mem[0x32] = 0xF0;
        this.mem[0x33] = 0x90;
        this.mem[0x34] = 0xF0; // A
        this.mem[0x35] = 0x90;
        this.mem[0x36] = 0x90;

        this.mem[0x37] = 0xE0;
        this.mem[0x38] = 0x90;
        this.mem[0x39] = 0xE0; // B
        this.mem[0x3A] = 0x90;
        this.mem[0x3B] = 0xE0;

        this.mem[0x3C] = 0xF0;
        this.mem[0x3D] = 0x80;
        this.mem[0x3E] = 0x80; // C
        this.mem[0x3F] = 0x80;
        this.mem[0x40] = 0xF0;

        this.mem[0x41] = 0xE0;
        this.mem[0x42] = 0x90;
        this.mem[0x43] = 0x90; // D
        this.mem[0x44] = 0x90;
        this.mem[0x45] = 0xE0;

        this.mem[0x46] = 0xF0;
        this.mem[0x47] = 0x80;
        this.mem[0x48] = 0xF0; // E
        this.mem[0x49] = 0x80;
        this.mem[0x4A] = 0xF0;

        this.mem[0x4B] = 0xF0;
        this.mem[0x4C] = 0x80;
        this.mem[0x4D] = 0xF0; // F
        this.mem[0x4E] = 0x80;
        this.mem[0x4F] = 0x80;
    };

    this.setupSprites();
}
