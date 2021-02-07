/**
 * Created by Fraser on 29/06/2015.
 */

function chip8() {
    this.keycodes = [88,49,50,51,81,87,69,65,83,68,90,67,52,82,70,86];
    this.keystatus = [];
    this.mem = [];
    this.V = [];
    this.stack = new Array(16);
    this.framebuffer = createArray(64, 32);

    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;
    this.delaytimer = 0;
    this.soundtimer = 0;

    this.lastDelayTick = (new Date).getTime();

    this.ramUpdateFlag = false;

    for (var i = 0; i < 0x10; i++) {
        this.keystatus[i] = false;
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

        if (this.soundtimer > 0) {
            this.soundtimer--;
        }

        this.lastDelayTick = (new Date).getTime();
    };

    this.execute = function(opcode) {
        this.ramUpdateFlag=false; //
        var addr;
        var x, y, kk, n;

        x = (opcode & 0x0F00) >> 8;
        y = (opcode & 0x00F0) >> 4;
        kk = opcode & 0x00FF;
        n = opcode & 0x000F;
        addr = opcode & 0x0FFF;

        // Decode instruction
        if ((opcode & 0xF000) === 0x0000) {
            if (opcode === 0x00E0) {
                this.CLS();
            } else if (opcode === 0x00EE) {
                this.RET();
            } else {
                this.SYS_addr(addr);
            }
        } else if ((opcode & 0xF000) === 0x1000) {
            this.JP_addr(addr);
        } else if ((opcode & 0xF000) === 0x2000) {
            this.CALL_addr(addr);
        } else if ((opcode & 0xF000) === 0x3000) {
            this.SE_Vx_byte(x, kk);
        } else if ((opcode & 0xF000) === 0x4000) {
            this.SNE_Vx_byte(x, kk);
        } else if ((opcode & 0xF000) === 0x5000) {
            this.SE_Vx_Vy(x, y);
        } else if ((opcode & 0xF000) === 0x6000) {
            this.LD_Vx_byte(x, kk);
        } else if ((opcode & 0xF000) === 0x7000) {
            this.ADD_Vx_byte(x, kk);
        } else if ((opcode & 0xF000) === 0x8000) {
            if ((opcode & 0x000F) === 0x0) {
                this.LD_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x1) {
                this.OR_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x2) {
                this.AND_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x3) {
                this.XOR_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x4) {
                this.ADD_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x5) {
                this.SUB_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x6) {
                this.SHR_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0x7) {
                this.SUBN_Vx_Vy(x, y);
            } else if ((opcode & 0x000F) === 0xE) {
                this.SHL_Vx_Vy(x, y);
            } else {
                // Invalid opcode
                console.log("INVALID OPCODE: " + opcode.toString(16))
            }
        } else if ((opcode & 0xF000) === 0x9000) {
            this.SNE_Vx_Vy(x, y);
        } else if ((opcode & 0xF000) === 0xA000) {
            this.LD_I_addr(addr);
        } else if ((opcode & 0xF000) === 0xB000) {
            this.JP_V0_addr(addr);
        } else if ((opcode & 0xF000) === 0xC000) {
            this.RND_Vx_byte(x, kk);
        } else if ((opcode & 0xF000) === 0xD000) {
            this.DRW_Vx_Vy_nibble(x, y);
        } else if ((opcode & 0xF000) === 0xE000) {
            if ((opcode & 0x00FF) === 0x9E) {
                this.SKP_Vx(x);
            } else if ((opcode & 0x00FF) === 0xA1) {
                this.SKNP_Vx(x);
            } else {
                // Invalid opcode
                console.log("INVALID OPCODE: " + opcode.toString(16))
            }
        } else if ((opcode & 0xF000) === 0xF000) {
            if ((opcode & 0x00FF) === 0x07) {
                this.LD_Vx_DT(x);
            } else if ((opcode & 0x00FF) === 0x0A) {
                this.LD_Vx_K(x);
            } else if ((opcode & 0x00FF) === 0x15) {
                this.LD_DT_Vx(x);
            } else if ((opcode & 0x00FF) === 0x18) {
                this.LD_ST_Vx(x);
            } else if ((opcode & 0x00FF) === 0x1E) {
                this.ADD_I_Vx(x);
            } else if ((opcode & 0x00FF) === 0x29) {
                this.LD_F_Vx(x);
            } else if ((opcode & 0x00FF) === 0x33) {
                this.LD_B_Vx(x);
            } else if ((opcode & 0x00FF) === 0x55) {
                this.LD_I_Vx(x);
            } else if ((opcode & 0x00FF) === 0x65) {
                this.LD_Vx_I(x);
            } else {
                // Invalid opcode
                console.log("INVALID OPCODE: " + opcode.toString(16))
            }
        } else {
            // Invalid opcode
            console.log("INVALID OPCODE: " + opcode.toString(16))
        }
    }

    this.emulateCycle = function() {
        //Fetch the next opcode.  Opcodes are two bytes long, so we need to merge two bytes to get it.
        //if (this.mem[pc] == null)
        //    this.mem[pc] = 0x00;
        //
        //if (this.mem[pc+1] == null)
        //    this.mem[pc+1] = 0x00;

        let opcode = this.mem[this.pc] << 8 | this.mem[this.pc+1];
        this.execute(opcode);

        if ((new Date).getTime() > (this.lastDelayTick + 17)) {
            this.decdt();
        }
    };

    // OPCODE IMPLEMENTATIONS

    this.CLS = function() {
        debugLog(`CLS`);
    };

    this.RET = function() {
        debugLog(`RET`);
    };

    this.SYS_addr = function(addr) {
        debugLog(`SYS addr; addr=${addr.toString(16)}`);
    };

    this.JP_addr = function(addr) {
        debugLog(`JP addr; addr=${addr.toString(16)}`);
    };

    this.CALL_addr = function(addr) {
        debugLog(`CALL addr; addr=${addr.toString(16)}`);
    };

    this.SE_Vx_byte = function(x, byte) {
        debugLog(`SE Vx, byte; x=${x.toString(16)}, byte=${byte.toString(16)}`);
    };

    this.SNE_Vx_byte = function(x, byte) {
        debugLog(`SNE Vx, byte; x=${x.toString(16)}, byte=${byte.toString(16)}`);
    };

    this.SE_Vx_Vy = function(x, y) {
        debugLog(`SE Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.LD_Vx_byte = function(x, byte) {
        debugLog(`LD Vx, byte; x=${x.toString(16)}, byte=${byte.toString(16)}`);
    };

    this.ADD_Vx_byte = function(x, byte) {
        debugLog(`ADD Vx, byte; x=${x.toString(16)}, byte=${byte.toString(16)}`);
    };

    this.LD_Vx_Vy = function(x, y) {
        debugLog(`LD Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.OR_Vx_Vy = function(x, y) {
        debugLog(`OR Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.AND_Vx_Vy = function(x, y) {
        debugLog(`AND Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.XOR_Vx_Vy = function(x, y) {
        debugLog(`XOR Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.ADD_Vx_Vy = function(x, y) {
        debugLog(`ADD Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.SUB_Vx_Vy = function(x, y) {
        debugLog(`SUB Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.SHR_Vx_Vy = function(x, y) {
        debugLog(`SHR Vx {, Vy}; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.SUBN_Vx_Vy = function(x, y) {
        debugLog(`SUBN Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.SHL_Vx_Vy = function(x, y) {
        debugLog(`SHL Vx {, Vy}; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.SNE_Vx_Vy = function(x, y) {
        debugLog(`SNE Vx, Vy; x=${x.toString(16)}, y=${y.toString(16)}`);
    };

    this.LD_I_addr = function(addr) {
        debugLog(`LD I, addr; addr=${addr.toString(16)}`);
    };

    this.JP_V0_addr = function(addr) {
        debugLog(`JP V0, addr; addr=${addr.toString(16)}`);
    };

    this.RND_Vx_byte = function(x, byte) {
        debugLog(`RND Vx, byte; x=${x.toString(16)}, byte=${byte.toString(16)}`);
    };

    this.DRW_Vx_Vy_nibble = function(x, y, nibble) {
        debugLog(`RND Vx, byte; x=${x.toString(16)}, y=${y.toString(16)}, nibble=${nibble.toString(16)}`);
    };

    this.SKP_Vx = function(x) {
        debugLog(`SKP Vx; x=${x.toString(16)}`);
    };

    this.SKNP_Vx = function(x) {
        debugLog(`SKNP Vx; x=${x.toString(16)}`);
    };

    this.LD_Vx_DT = function(x) {
        debugLog(`LD Vx, DT; x=${x.toString(16)}`);
    };

    this.LD_Vx_K = function(x) {
        debugLog(`LD Vx, K; x=${x.toString(16)}`);
    };

    this.LD_DT_Vx = function(x) {
        debugLog(`LD DT, Vx; x=${x.toString(16)}`);
    };

    this.LD_ST_Vx = function(x) {
        debugLog(`LD ST, Vx; x=${x.toString(16)}`);
    };

    this.ADD_I_Vx = function(x) {
        debugLog(`ADD I, Vx; x=${x.toString(16)}`);
    };

    this.LD_F_Vx = function(x) {
        debugLog(`LD F, Vx; x=${x.toString(16)}`);
    };

    this.LD_B_Vx = function(x) {
        debugLog(`LD B, Vx; x=${x.toString(16)}`);
    };

    this.LD_I_Vx = function(I, x) {
        debugLog(`LD [I], Vx; I=${I.toString(16)}, x=${x.toString(16)}`);
    };

    this.LD_Vx_I = function(x) {
        debugLog(`LD Vx, [I]; x=${x.toString(16)}, I=${I.toString(16)}`);
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

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function debugLog(msg) {
    let debugLogEnabled = true;

    if (debugLogEnabled) {
        console.log(msg);
    }
}