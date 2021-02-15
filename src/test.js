runTest = function() {
    //00EE RET
    emu = new chip8();
    emu.mem[0x200] = 0x00;
    emu.mem[0x201] = 0xEE;
    emu.stack[0] = 0xABC;
    emu.sp = 1;

    emu.emulateCycle();
    if (
        (emu.sp === 0)              &&
        (emu.pc === 0xABE)
    )
        console.log("RET test pass");
    else {
        console.log("RET test failed, expected pc=0xABC && sp=0");
        printRegs();
    }

    //1nnn JP addr
    emu = new chip8();
    emu.mem[0x200] = 0x1A;
    emu.mem[0x201] = 0xBC;

    emu.emulateCycle();
    if (
        (emu.pc === 0xABC)
    )
        console.log("JP addr test pass");
    else {
        console.log("JP addr test failed, expected pc=0xABC");
        printRegs();
    }

    //2nnn CALL addr
    emu = new chip8();
    emu.mem[0x200] = 0x2A;
    emu.mem[0x201] = 0xBC;

    emu.emulateCycle();
    if (
        (emu.pc === 0xABC)          &&
        (emu.sp === 1)              &&
        (emu.stack[0] === 0x200)
    )
        console.log("CALL addr test pass");
    else {
        console.log("CALL addr test failed, expected pc=0xABC, sp=1, stack[0]=0x200");
        printRegs();
    }

    //3xkk SE Vx, byte
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0x32;
    emu.mem[0x201] = 0x42;
    emu.V[2] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SE Vx, byte test 1 pass");
    else {
        console.log("SE Vx, byte test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0x32;
    emu.mem[0x201] = 0x42;
    emu.V[2] = 0x43;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SE Vx, byte test 2 pass");
    else {
        console.log("SE Vx, byte test 2 failed, expected pc=0x202");
        printRegs();
    }

    //4xkk SNE Vx, byte
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0x42;
    emu.mem[0x201] = 0x42;
    emu.V[2] = 0x43;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SNE Vx, byte test 1 pass");
    else {
        console.log("SNE Vx, byte test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0x42;
    emu.mem[0x201] = 0x42;
    emu.V[2] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SNE Vx, byte test 2 pass");
    else {
        console.log("SNE Vx, byte test 2 failed, expected pc=0x202");
        printRegs();
    }

    //5xy0 SE Vx, Vy
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0x52;
    emu.mem[0x201] = 0x30;
    emu.V[2] = 0x42;
    emu.V[3] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SE Vx, Vy test 1 pass");
    else {
        console.log("SE Vx, Vy test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0x52;
    emu.mem[0x201] = 0x30;
    emu.V[2] = 0x42;
    emu.V[3] = 0x43;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SE Vx, Vy test 2 pass");
    else {
        console.log("SE Vx, Vy test 2 failed, expected pc=0x202");
        printRegs();
    }

    //6xkk LD Vx, byte
    emu = new chip8();
    emu.mem[0x200] = 0x62;
    emu.mem[0x201] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x42)
    )
        console.log("LD Vx, byte test pass");
    else {
        console.log("LD Vx, byte test failed, expected pc=0x202, V2=0x42");
        printRegs();
    }

    //7xkk ADD Vx, byte
    emu = new chip8();
    emu.mem[0x200] = 0x72;
    emu.mem[0x201] = 0x42;
    emu.V[2] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x84)
    )
        console.log("ADD Vx, byte test pass");
    else {
        console.log("ADD Vx, byte test failed, expected pc=0x202, V2=0x84");
        printRegs();
    }

    //8xy0 LD Vx, Vy
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x30;
    emu.V[3] = 0x42;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x42)
    )
        console.log("LD Vx, Vy test pass");
    else {
        console.log("LD Vx, Vy test failed, expected pc=0x202, V2=0x42");
        printRegs();
    }

    //8xy1 OR Vx, Vy
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x31;
    emu.V[2] = 0b10101010;  // I knew base-2 literals would come in useful one day.
    emu.V[3] = 0b11110000;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0b11111010)
    )
        console.log("OR Vx, Vy test pass");
    else {
        console.log("OR Vx, Vy test failed, expected pc=0x202, V2=0xFA");
        printRegs();
    }

    //8xy2 AND Vx, Vy
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x32;
    emu.V[2] = 0b10101010;
    emu.V[3] = 0b11110000;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0b10100000)
    )
        console.log("AND Vx, Vy test pass");
    else {
        console.log("AND Vx, Vy test failed, expected pc=0x202, V2=0xA0");
        printRegs();
    }

    //8xy3 XOR Vx, Vy
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x33;
    emu.V[2] = 0b10101010;
    emu.V[3] = 0b11110000;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0b01011010)
    )
        console.log("XOR Vx, Vy test pass");
    else {
        console.log("XOR Vx, Vy test failed, expected pc=0x202, V2=0x5A");
        printRegs();
    }

    //8xy4 ADD Vx, Vy
    //Test no carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x34;
    emu.V[2] = 0x12;
    emu.V[3] = 0x34;
    emu.V[0xF] = 0x01;  // Check carry flag clears

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x46)         &&
        (emu.V[0xF] === 0x00)
    )
        console.log("ADD Vx, Vy test 1 pass");
    else {
        console.log("ADD Vx, Vy test 1 failed, expected pc=0x202, V2=0x46, VF=0x00");
        printRegs();
    }

    //Test carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x34;
    emu.V[2] = 0xF0;
    emu.V[3] = 0x15;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x05)         &&
        (emu.V[0xF] === 0x01)
    )
        console.log("ADD Vx, Vy test 2 pass");
    else {
        console.log("ADD Vx, Vy test 2 failed, expected pc=0x202, V2=0x05, VF=0x01");
        printRegs();
    }

    //8xy5 SUB Vx, Vy
    //Test no carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x35;
    emu.V[2] = 0x85;
    emu.V[3] = 0x05;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x80)         &&
        (emu.V[0xF] === 0x01)
    )
        console.log("SUB Vx, Vy test 1 pass");
    else {
        console.log("SUB Vx, Vy test 1 failed, expected pc=0x202, V2=0x80, VF=0x01");
        printRegs();
    }

    //Test carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x35;
    emu.V[2] = 0x10;
    emu.V[3] = 0x20;
    emu.V[0xF] = 0x01;  // Check carry flag clears

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0xF0)         &&
        (emu.V[0xF] === 0x00)
    )
        console.log("SUB Vx, Vy test 2 pass");
    else {
        console.log("SUB Vx, Vy test 2 failed, expected pc=0x202, V2=0xF0, VF=0x00");
        printRegs();
    }

    //8xy6 SHR Vx, Vy
    //Test no carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x36;
    emu.V[2] = 0xAC;
    emu.V[0xF] = 0x01;  // Check carry flag clears

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x56)         &&
        (emu.V[0xF] === 0x00)
    )
        console.log("SHR Vx, Vy test 1 pass");
    else {
        console.log("SHR Vx, Vy test 1 failed, expected pc=0x202, V2=0x56, VF=0x00");
        printRegs();
    }

    //Test carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x36;
    emu.V[2] = 0xCF;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x67)         &&
        (emu.V[0xF] === 0x01)
    )
        console.log("SHR Vx, Vy test 2 pass");
    else {
        console.log("SHR Vx, Vy test 2 failed, expected pc=0x202, V2=0x67, VF=0x01");
        printRegs();
    }

    //8xy7 SUBN Vx, Vy
    //Test no carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x37;
    emu.V[2] = 0x30;
    emu.V[3] = 0x20;
    emu.V[0xF] = 0x01;  // Check carry flag clears

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0xF0)         &&
        (emu.V[0xF] === 0x00)
    )
        console.log("SUBN Vx, Vy test 1 pass");
    else {
        console.log("SUBN Vx, Vy test 1 failed, expected pc=0x202, V2=0xF0, VF=0x00");
        printRegs();
    }

    //Test carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x37;
    emu.V[2] = 0x20;
    emu.V[3] = 0x30;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x10)         &&
        (emu.V[0xF] === 0x01)
    )
        console.log("SUBN Vx, Vy test 2 pass");
    else {
        console.log("SUBN Vx, Vy test 2 failed, expected pc=0x202, V2=0x10, VF=0x01");
        printRegs();
    }

    //8xyE SHL Vx, Vy
    //Test no carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x3E;
    emu.V[2] = 0x5C;
    emu.V[0xF] = 0x01;  // Check carry flag clears

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0xB8)         &&
        (emu.V[0xF] === 0x00)
    )
        console.log("SHL Vx, Vy test 1 pass");
    else {
        console.log("SHL Vx, Vy test 1 failed, expected pc=0x202, V2=0xB8, VF=0x00");
        printRegs();
    }

    //Test carry
    emu = new chip8();
    emu.mem[0x200] = 0x82;
    emu.mem[0x201] = 0x3E;
    emu.V[2] = 0xAC;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x58)         &&
        (emu.V[0xF] === 0x01)
    )
        console.log("SHL Vx, Vy test 2 pass");
    else {
        console.log("SHL Vx, Vy test 2 failed, expected pc=0x202, V2=0x58, VF=0x01");
        printRegs();
    }

    //9xy0 SNE Vx, Vy
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0x92;
    emu.mem[0x201] = 0x30;
    emu.V[2] = 0x42;
    emu.V[3] = 0x43;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SNE Vx, Vy test 1 pass");
    else {
        console.log("SNE Vx, Vy test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0x92;
    emu.mem[0x201] = 0x30;
    emu.V[2] = 0x43;
    emu.V[3] = 0x43;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SNE Vx, Vy test 2 pass");
    else {
        console.log("SNE Vx, Vy test 2 failed, expected pc=0x202");
        printRegs();
    }

    //Annn LD I, addr
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0xA1;
    emu.mem[0x201] = 0x23;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.I === 0x123)
    )
        console.log("LD I, addr test pass");
    else {
        console.log("LD I, addr test failed, expected pc=0x202, I=0x123");
        printRegs();
    }

    //Bnnn JP V0, addr
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0xB1;
    emu.mem[0x201] = 0x23;
    emu.V[0] = 0x12;

    emu.emulateCycle();
    if (
        (emu.pc === 0x135)
    )
        console.log("JP V0, addr test pass");
    else {
        console.log("JP V0, addr test failed, expected pc=0x135");
        printRegs();
    }

    //Skipping RND Vx, byte because eeeeehhhhh

    //Dnnn DRW Vx, Vy, n
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0xD2;
    emu.mem[0x201] = 0x32;
    emu.mem[0x202] = 0xA4;
    emu.mem[0x203] = 0x02;
    emu.mem[0x204] = 0xD2;
    emu.mem[0x205] = 0x32;
    emu.V[2] = 0;    // Draw sprite at coordinates x50/x80
    emu.V[3] = 0;
    emu.I = 0x400;      //Sprite memory pointer
    emu.mem[0x400] = 0b10101010
    emu.mem[0x401] = 0b11000011
    emu.mem[0x402] = 0b11101010
    emu.mem[0x403] = 0b10000011

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)                    &&
        (emu.framebuffer[0][0] === true)      &&
        (emu.framebuffer[0][7] === false)     &&
        (emu.framebuffer[1][0] === true)      &&
        (emu.framebuffer[1][7] === true)      &&
        (emu.V[0xF] === 0)
    )
        console.log("DRW Vx, Vy, n test 1 pass");
    else {
        console.log("DRW Vx, Vy, n test 1 failed.");
        console.log(emu.framebuffer)
        printRegs();
    }

    emu.emulateCycle();
    emu.emulateCycle();
    if (
        (emu.pc === 0x206)                    &&
        (emu.framebuffer[0][1] === true)      &&
        (emu.framebuffer[0][2] === false)     &&
        (emu.framebuffer[1][1] === true)      &&
        (emu.framebuffer[1][2] === false)      &&
        (emu.V[0xF] === 1)
    )
        console.log("DRW Vx, Vy, n test 2 pass");
    else {
        console.log("DRW Vx, Vy, n test 2 failed.");
        console.log(emu.framebuffer)
        printRegs();
    }

    //Ex9E SKP Vx
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0xE2;
    emu.mem[0x201] = 0x9E;
    emu.V[0x02] = 0x03
    emu.keystatus[3] = true;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SKP Vx test 1 pass");
    else {
        console.log("SKP Vx test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0xE2;
    emu.mem[0x201] = 0x9E;
    emu.V[2] = 0x03;
    emu.keystatus[3] = false;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SKP Vx test 2 pass");
    else {
        console.log("SKP Vx test 2 failed, expected pc=0x202");
        printRegs();
    }

    //ExA1 SKNP Vx
    //Test true case
    emu = new chip8();
    emu.mem[0x200] = 0xE2;
    emu.mem[0x201] = 0xA1;
    emu.V[0x02] = 0x03
    emu.keystatus[3] = false;

    emu.emulateCycle();
    if (
        (emu.pc === 0x204)
    )
        console.log("SKNP Vx test 1 pass");
    else {
        console.log("SKNP Vx test 1 failed, expected pc=0x204");
        printRegs();
    }

    //Test false case
    emu = new chip8();
    emu.mem[0x200] = 0xE2;
    emu.mem[0x201] = 0xA1;
    emu.V[2] = 0x03;
    emu.keystatus[3] = true;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)
    )
        console.log("SKNP Vx test 2 pass");
    else {
        console.log("SKNP Vx test 2 failed, expected pc=0x202");
        printRegs();
    }

    //Fx07 LD Vx, DT
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x07;
    emu.delaytimer = 0x12;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x12)
    )
        console.log("LD Vx, DT test pass");
    else {
        console.log("LD Vx, DT test failed, expected pc=0x202, v2=0x12");
        printRegs();
    }

    //Fx0A LD Vx, K
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x0A;

    //Test waiting for keypress
    emu.emulateCycle();
    emu.emulateCycle();
    emu.emulateCycle();

    if (
        (emu.pc === 0x200)
    )
        console.log("LD Vx, K test 1 pass");
    else {
        console.log("LD Vx, K test 1 failed, expected pc=0x200");
        printRegs();
    }

    //Test key now pressed
    emu.keystatus[5] = true;
    emu.emulateCycle();

    if (
        (emu.pc === 0x202)          &&
        (emu.V[2] === 0x05)
    )
        console.log("LD Vx, K test 2 pass");
    else {
        console.log("LD Vx, K test 2 failed, expected pc=0x202, v2=5");
        printRegs();
    }

    //Fx0A LD DT, Vx
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x15;
    emu.V[2] = 0x12;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.delaytimer === 0x12)
    )
        console.log("LD DT, Vx test pass");
    else {
        console.log("LD DT, Vx test failed, expected pc=0x202, DT=0x12");
        printRegs();
    }

    //Fx0A LD ST, Vx
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x18;
    emu.V[2] = 0x12;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.soundtimer === 0x12)
    )
        console.log("LD ST, Vx test pass");
    else {
        console.log("LD ST, Vx test failed, expected pc=0x202, ST=0x12");
        printRegs();
    }

    //Fx1E ADD I, Vx
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x1E;
    emu.V[2] = 0x10;
    emu.I = 0x123

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.I === 0x133)
    )
        console.log("ADD I, Vx test pass");
    else {
        console.log("ADD I, Vx test failed, expected pc=0x202, I=0x133");
        printRegs();
    }

    //Fx29 LD F, Vx
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x29;
    emu.V[2] = 0x0A;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.I === 0x032)
    )
        console.log("LD F, Vx test pass");
    else {
        console.log("LD F, Vx test failed, expected pc=0x202, I=0x133");
        printRegs();
    }

    //Fx33 LD B, Vx
    emu = new chip8();
    emu.mem[0x200] = 0xF2;
    emu.mem[0x201] = 0x33;
    emu.V[2] = 0xFE;
    emu.I = 0x400;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.mem[0x400] === 2)      &&
        (emu.mem[0x401] === 5)      &&
        (emu.mem[0x402] === 4)
    )
        console.log("LD B, Vx test pass");
    else {
        console.log("LD B, Vx test failed, expected pc=0x202, mem[400]=0x2, mem[401]=0x5, mem[402]=0x4");
        printRegs();
    }

    //Fx55 LD [I], Vx
    //Test copy all
    emu = new chip8();
    emu.mem[0x200] = 0xFF;
    emu.mem[0x201] = 0x55;
    emu.V[0x0] = 0xAB;
    emu.V[0x8] = 0xCD;
    emu.V[0xF] = 0xEF;
    emu.I = 0x400;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.mem[0x400] === 0xAB)   &&
        (emu.mem[0x408] === 0xCD)   &&
        (emu.mem[0x40F] === 0xEF)   &&
        (emu.mem[0x410] === 0x00)
    )
        console.log("LD [I], Vx test 1 pass");
    else {
        console.log("LD [I], Vx test 1 failed, expected pc=0x202, mem[400]=0xAB, mem[408]=0xCD, mem[40F]=0xEF");
        printRegs();
    }

    //Test copy only some
    emu = new chip8();
    emu.mem[0x200] = 0xF8;
    emu.mem[0x201] = 0x55;
    emu.V[0x0] = 0xAB;
    emu.V[0x8] = 0xCD;
    emu.V[0x9] = 0xEF;
    emu.I = 0x400;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.mem[0x400] === 0xAB)   &&
        (emu.mem[0x408] === 0xCD)   &&
        (emu.mem[0x409] === 0x00)
    )
        console.log("LD [I], Vx test 2 pass");
    else {
        console.log("LD [I], Vx test 2 failed, expected pc=0x202, mem[400]=0xAB, mem[408]=0xCD, mem[409]=0x00");
        printRegs();
    }

    //Fx65 LD Vx, [I]
    //Test copy all
    emu = new chip8();
    emu.mem[0x200] = 0xFF;
    emu.mem[0x201] = 0x65;
    emu.mem[0x400] = 0xAB;
    emu.mem[0x408] = 0xCD;
    emu.mem[0x40F] = 0xEF;
    emu.I = 0x400;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[0x0] === 0xAB)       &&
        (emu.V[0x8] === 0xCD)       &&
        (emu.V[0xF] === 0xEF)
    )
        console.log("LD Vx, [I] test 1 pass");
    else {
        console.log("LD Vx, [I] test 1 failed, expected pc=0x202, V0=0xAB, V8=0xCD, VF=0xEF");
        printRegs();
    }

    //Fx65 LD Vx, [I]
    //Test only copy some
    emu = new chip8();
    emu.mem[0x200] = 0xF8;
    emu.mem[0x201] = 0x65;
    emu.mem[0x400] = 0xAB;
    emu.mem[0x408] = 0xCD;
    emu.mem[0x409] = 0xEF;
    emu.I = 0x400;

    emu.emulateCycle();
    if (
        (emu.pc === 0x202)          &&
        (emu.V[0x0] === 0xAB)       &&
        (emu.V[0x8] === 0xCD)       &&
        (emu.V[0x9] === 0x00)
    )
        console.log("LD Vx, [I] test 2 pass");
    else {
        console.log("LD Vx, [I] test 2 failed, expected pc=0x202, V0=0xAB, V8=0xCD, V9=0x00");
        printRegs();
    }
}