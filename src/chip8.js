/**
 * Created by Fraser on 29/06/2015.
 */

function chip8() {
    this.mem = [];
    this.registers = [];
    this.stack = [];
    this.framebuffer = [];

    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;
    this.delaytimer = 0;
    this.soundtimer = 0;

    this.drawFlag = false;

    for (var i = 0; i < 64*32; i++) {
        this.framebuffer[i] = 0;
    }

    for (var i = 0; i < 8; i++) {
        this.registers[i]=0;
    }

    this.execute = function() {
        drawFlag = false;
        var address;
        var x, y, kk;

        x = (this.opcode & 0x0F00) >> 8;
        y = (this.opcode & 0x00F0) >> 4;
        kk = this.opcode & 0x00FF;
        address = this.opcode & 0x0FFF;

        var opcodeClass = (this.opcode & 0xF000) >> 12

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

                this.stack[this.sp] = this.pc; //Push current position onto stack
                ++this.sp; //Increment stack pointer
                this.pc = address; //Jump to address
                break;

            case 0x3:
                //SE -- 0x3xkk SKIP NEXT INSTRUCTION IF Vx = kk

                if (this.registers[x] == kk)
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x4:
                //SNE -- 0x4xkk SKIP NEXT INSTRUCTION IF Vx != kk

                if (this.registers[x] !== kk)
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x5:
                //SE -- 0x5xy0 SKIP NEXT INSTRUCTION IF Vx = Vy

                if (this.registers[x] === this.registers[y])
                    this.pc += 4;
                else
                    this.pc += 2;
                break;

            case 0x6:
                //LD -- 0x6xkk SET Vx = kk

                this.registers[x] = kk;
                this.pc += 2;

                break;

            case 0x7:
                //ADD -- 0x7xkk SET Vx += kk

                this.registers[x] += kk;
                this.pc += 2;

                break;

            case 0x8:
                //BITWISE OPERATIONS, WHOLE LOT OF STUFF NEEDS DONE HERE
                break;

            case 0x9:
                //SNE -- 0x9xy0 SKIP NEXT INSTRUCTION IF Vx != Vy

                if (this.registers[x] !== this.registers[y])
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

                this.pc = (this.opcode & 0x0FFF) + this.registers[0];
                this.pc += 2;

                break;

            case 0xC:
                //RND -- 0xCxkk SET Vx = RANDOM BYTE && kk

                this.registers[x] = (Math.floor(Math.random()*256) & kk)
                this.pc += 2;

                break;

            case 0xD:
                //DRW -- 0xDxyn DISPLAY N BYTE SPRITE STARTING AT MEMORY LOCATION I
                //AT (Vx, Vy), set VF = COLLISION

                n = this.opcode & 0x000F;

                x = (this.registers[x]);
                y = (this.registers[y]);


                for (var i = 0; i < n; i++) {
                    byte = this.mem[this.I+i];
                    startOfRow = ((i+y) * 64) + x - 4;

                    for (var j = 0; j < 8; j++) {
                        this.framebuffer[startOfRow+j] = this.framebuffer[startOfRow+j] ^ ((byte & Math.pow(2,j)) >> j);
                    }
                }

                this.pc += 2;
                this.drawFlag = true;

                break;

            case 0xE:

                break;

            case 0xF:

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
    };
}
