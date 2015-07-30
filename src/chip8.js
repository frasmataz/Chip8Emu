/**
 * Created by Fraser on 29/06/2015.
 */

function chip8() {
    this.mem = [];
    this.registers = [];
    this.framebuffer = [];
    this.stack = [];

    this.pc = 0x200;
    this.opcode = 0;
    this.I = 0;
    this.sp = 0;
    this.delaytimer = 0;
    this.soundtimer = 0;

    this.drawFlag = false;

    this.execute = function() {
        var address;
        var x, y, kk;

        if (this.opcode == 0x0) {
            this.pc+=2;
        } else if (this.opcode == 0x00E0) {
            //CLS -- 0x00E0 CLEAR SCREEN

        } else if (this.opcode == 0x00EE) {
            //RET -- 0x00EE RETURN FROM SUBROUTINE

        } else if (this.opcode >= 0x0000 && this.opcode < 0x0FFF) {
            //SYS -- 0x0nnn CALL SUBROUTINE AT nnn

            //NOT IMPLEMENTED
        } else if (this.opcode >= 0x1000 && this.opcode < 0x1FFF) {
            //JP -- 0x1nnn JUMP TO LOCATION nnn

            address = this.opcode & 0x0FFF;
            this.pc = address;

        } else if (this.opcode >= 0x2000 && this.opcode < 0x2FFF) {
            //CALL -- 0x2nnn CALL FUNCTION AT LOCATION nnn

            address = this.opcode & 0x0FFF; //Get address from this.opcode
            this.stack[this.sp] = this.pc; //Push current position onto stack
            ++this.sp; //Increment stack pointer
            this.pc = address; //Jump to address

        } else if (this.opcode >= 0x3000 && this.opcode < 0x3FFF) {
            //SE -- 0x3xkk SKIP NEXT INSTRUCTION IF Vx = kk

            x = (this.opcode & 0x0F00) >> 8;
            kk = this.opcode & 0x00FF;

            if (this.registers[x] === kk)
                this.pc += 4;
            else
                this.pc += 2;

        } else if (this.opcode >= 0x4000 && this.opcode < 0x4FFF) {
            //SNE -- 0x4xkk SKIP NEXT INSTRUCTION IF Vx != kk

            x = (this.opcode & 0x0F00) >> 8;
            kk = this.opcode & 0x00FF;

            if (this.registers[x] !== kk)
                this.pc += 4;
            else
                this.pc += 2;

        } else if (this.opcode >= 0x5000 && this.opcode < 0x5FFF) {
            //SE -- 0x5xy0 SKIP NEXT INSTRUCTION IF Vx = Vy

            x = (this.opcode & 0x0F00) >> 8;
            y = (this.opcode & 0x00F0) >> 4;

            if (this.registers[x] === this.registers[y])
                this.pc += 4;
            else
                this.pc += 2;

        } else if (this.opcode >= 0x6000 && this.opcode < 0x6FFF) {
            //LD -- 0x6xkk SET Vx = kk

            x = (this.opcode & 0x0F00) >> 8;
            kk = this.opcode & 0x00FF;

            this.registers[x] = kk;

            this.pc += 2;

        } else if (this.opcode >= 0x7000 && this.opcode < 0x7FFF) {
            //ADD -- 0x7xkk SET Vx += kk

            x = (this.opcode & 0x0F00) >> 8;
            kk = this.opcode & 0x00FF;

            this.registers[x] += kk;

            this.pc += 2;

        } else if (this.opcode >= 0x8000 && this.opcode < 0x8FFF) {
            //BITWISE OPERATIONS, WHOLE LOT OF STUFF NEEDS DONE HERE

        } else if (this.opcode >= 0x9000 && this.opcode < 0x9FFF) {
            //SNE -- 0x9xy0 SKIP NEXT INSTRUCTION IF Vx != Vy

            x = (this.opcode & 0x0F00) >> 8;
            y = (this.opcode & 0x00F0) >> 4;

            if (this.registers[x] !== this.registers[y])
                this.pc += 4;
            else
                this.pc += 2;

        } else if (this.opcode >= 0xA000 && this.opcode < 0xAFFF) {
            //LD -- 0xAnnn SET REGISTER I TO nnn

            this.I = this.opcode & 0x0FFF;
            this.pc += 2;

        } else if (this.opcode >= 0xB000 && this.opcode < 0xBFFF) {
            //JP -- 0xBnnn JUMP TO LOCATION nnn + V0

            this.pc = (this.opcode & 0x0FFF) + this.registers[0];
            this.pc += 2;

        } else if (this.opcode >= 0xC000 && this.opcode < 0xCFFF) {
            //RND -- 0xCxkk SET Vx = RANDOM BYTE && kk
            x = (this.opcode & 0x0F00) >> 8;
            kk = this.opcode & 0x00FF;
            this.registers[x] = (Math.floor(Math.random()*256) & kk)
            this.pc += 2;

        } else if (this.opcode >= 0xD000 && this.opcode < 0xDFFF) {
            //DRW -- 0xDxyn DISPLAY N BYTE SPRITE STARTING AT MEMORY LOCATION I
            //AT (Vx, Vy), set VF = COLLISION

        } else if (this.opcode >= 0xE000 && this.opcode < 0xEFFF) {
            //LD -- 0xExkk SET Vx = kk

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
