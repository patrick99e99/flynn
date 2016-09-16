// flynnMain
//------------
// This must be the first flynn script loaded

if (typeof Flynn == "undefined") {
  var Flynn = {};  // Create namespace
}

Flynn.DevPacingMode = {
    NORMAL:  0,
    SLOW_MO: 1,
    FPS_20:  2,
};

//------------
// Colors 
//------------
Flynn.Colors = {
    BLACK:        "#000000",
    BLUE:         "#2020FF",
    WHITE:        "#FFFFFF",
    GREEN:        "#00FF00",
    YELLOW:       "#FFFF00",
    RED:          "#FF0000",
    CYAN:         "#00FFFF",
    MAGENTA:      "#FF00FF",
    CYAN_DK:      "#008080",
    
    ORANGE:       "#E55300",
    BROWN:        "#8B4513",
    YELLOW_DK:    "#808000",
    GRAY:         "#808080",
    GRAY_DK:      "#404040",

    LIGHTSKYBLUE: "#87CEFA",
    DODGERBLUE:   "#1E90FF",
    LIGHTBLUE:    "#ADD8E6",
};

//------------
// Keyboard input 
//------------
Flynn.KeyboardMap = {
    '0':        48,
    '1':        49,
    '2':        50,
    '3':        51,
    '4':        52,
    '5':        53,
    '6':        54,
    '7':        55,
    '8':        56,
    '9':        57,

    'a':        65,
    'b':        66,
    'c':        67,
    'd':        68,
    'e':        69,
    'f':        70,
    'g':        71,
    'h':        72,
    'i':        73,
    'j':        74,
    'k':        75,
    'l':        76,
    'm':        77,
    'n':        78,
    'o':        79,
    'p':        80,
    'q':        81,
    'r':        82,
    's':        83,
    't':        84,
    'u':        85,
    'v':        86,
    'w':        87,
    'x':        88,
    'y':        89,
    'z':        90,

    "'":        222,
    ',':        188,
    '-':        189,
    '.':        190,
    '/':        191,
    ';':        186,
    '=':        187,
    '[':        219,
    '\\':       220,
    ']':        221,
    '`':        192,

    'tab':      9,
    'enter':    13,
    'shift':    16,
    'control':  17,
    'option':   18,
    'escape':   27,
    'spacebar': 32,
    'left':     37,
    'up':       38,
    'right':    39,
    'down':     40,
    'command':  91,

    'f1':       112,
    'f2':       113,
    'f3':       114,
    'f4':       115,
    'f5':       116,
    'f6':       117,
    'f7':       118,
    'f8':       119,
    'f9':       120,
    'f10':      121,
    'f11':      122,
    'f12':      123,

    'ICADE_up':    -1,
    'ICADE_down':  -2,
    'ICADE_left':  -3,
    'ICADE_right': -4,
    'ICADE_T1':    -5,
    'ICADE_T2':    -6,
    'ICADE_T3':    -7,
    'ICADE_T4':    -8,
    'ICADE_B1':    -9,
    'ICADE_B2':    -10,
    'ICADE_B3':    -11,
    'ICADE_B4':    -12,
};

//------------
// Vector Font 
//------------
Flynn.Font = {
    UnimplementedChar: [0,6,0,0,4,0,4,6,0,6,4,0,4,6,0,0,0,6],
    PenUp: 9999,
    CharacterHeight: 6,
    CharacterWidth: 4,
    CharacterGap: 2
};
Flynn.Font.CharacterSpacing = Flynn.Font.CharacterWidth + Flynn.Font.CharacterGap;
Flynn.Font.Points = {
    UNIMPLEMENTED_CHAR: Flynn.Font.UnimplementedChar,
    PEN_UP: Flynn.Font.PenUp,
    
    ASCII: [
        [1,0,2,5,1.5,5,1.5,6,2.5,6,2.5,5,2,5,3,0,1,0],               // !
        [1,0,1,1,Flynn.Font.PenUp,Flynn.Font.PenUp,3,0,3,1],         // "
        [1,5,1,1,1,2,0,2,4,2,3,2,3,1,3,5,3,                          // #
            4,4,4,0,4,1,4,1,5],
        [0,6,3,6,4,5,4,4,3,3,1,3,0,2,0,1,1,0,4,0,2,0,2,6],           // $        
        [0,6,4,0,2,3,2,1,0,1,0,3,4,3,4,5,2,5,2,3,0,6],               // %  
        [4,6,1,2,1,1,2,0,3,1,3,2,0,4,0,5,1,6,2,6,4,4],               // &  
        [2,0,2,1,2,0],                                               // '  
        [4,6,3,6,2,5,2,1,3,0,4,0],                                   // (  
        [1,0,2,0,3,1,3,5,2,6,1,6],                                   // )  
        [0,1,2,3,2,1,2,3,4,1,2,3,4,3,2,3,4,5,2,3,                    // *
            2,5,2,3,0,5,2,3,0,3],
        [2,5,2,1,2,3,0,3,4,3,2,3,2,5],                               // +  
        [2,5,1,6,2,5],                                               // ,  
        [1,3,3,3],                                                   // -  
        [1.5,6,1.5,5,2.5,5,2.5,6,1.5,6],                             // .  
        [1,6,3,0,1,6],                                               // /  
        [0,0,0,6,4,6,4,0,0,0],                                       // 0
        [2,0,2,6],                                                   // 1
        [0,0,4,0,4,3,0,3,0,6,4,6],                                   // 2
        [0,0,4,0,4,3,0,3,4,3,4,6,0,6],                               // 3
        [0,0,0,3,4,3,4,0,4,6],                                       // 4
        [4,0,0,0,0,3,4,3,4,6,0,6],                                   // 5
        [0,0,0,6,4,6,4,3,0,3],                                       // 6
        [0,0,4,0,4,6],                                               // 7
        [0,3,4,3,4,6,0,6,0,0,4,0,4,3],                               // 8
        [4,3,0,3,0,0,4,0,4,6],                                       // 9
        [2,1,1.5,1.5,2,2,2.5,1.5,2,1,                                // :
            Flynn.Font.PenUp, Flynn.Font.PenUp,
            2,4,1.5,4.5,2,5,2.5,4.5,2,4],
        [2,1,1.5,1.5,2,2,2.5,1.5,2,1,                                // ;
            Flynn.Font.PenUp, Flynn.Font.PenUp,
            1.5,4,2.5,4,1.5,6,1.5,4],
        [4,1,0,3,4,5,0,3,4,1],                                       // <  
        [0,1.5,4,1.5,Flynn.Font.PenUp,Flynn.Font.PenUp,0,4.5,4,4.5], // = 
        [0,1,4,3,0,5,4,3,0,1],                                       // >  
        [0,2,0,1,1,0,3,0,4,1,4,2,2,3,2,6,2,3,4,2,4,
            1,3,0,1,0,0,1,0,2],                                      // ?  
        [3,4,3,2,1,2,1,4,4,4,4,2,3,1,1,1,0,2,0,4,1,5,3,5],           // @
        [0,6,0,2,2,0,4,2,4,4,0,4,4,4,4,6],                           // A
        [0,3,0,6,2,6,3,5,3,4,2,3,0,3,0,0,2,0,3,1,3,2,2,3],           // B
        [4,0,0,0,0,6,4,6],                                           // C
        [0,0,0,6,2,6,4,4,4,2,2,0,0,0],                               // D
        [4,0,0,0,0,3,3,3,0,3,0,6,4,6],                               // E
        [4,0,0,0,0,3,3,3,0,3,0,6],                                   // F
        [4,2,4,0,0,0,0,6,4,6,4,4,2,4],                               // G
        [0,0,0,6,0,3,4,3,4,0,4,6],                                   // H
        [0,0,4,0,2,0,2,6,4,6,0,6],                                   // I
        [4,0,4,6,2,6,0,4],                                           // J
        [3,0,0,3,0,0,0,6,0,3,3,6],                                   // K
        [0,0,0,6,4,6],                                               // L
        [0,6,0,0,2,2,4,0,4,6],                                       // M
        [0,6,0,0,4,6,4,0],                                           // N
        [0,0,4,0,4,6,0,6,0,0],                                       // O
        [0,6,0,0,4,0,4,3,0,3],                                       // P
        [0,0,0,6,2,6,3,5,4,6,2,4,3,5,4,4,4,0,0,0],                   // Q
        [0,6,0,0,4,0,4,3,0,3,1,3,4,6],                               // R
        [4,0,0,0,0,3,4,3,4,6,0,6],                                   // S
        [0,0,4,0,2,0,2,6],                                           // T
        [0,0,0,6,4,6,4,0],                                           // U
        [0,0,2,6,4,0],                                               // V
        [0,0,0,6,2,4,4,6,4,0],                                       // W
        [0,0,4,6,2,3,4,0,0,6],                                       // X
        [0,0,2,2,4,0,2,2,2,6],                                       // Y
        [0,0,4,0,0,6,4,6],                                           // Z
        [3,0,1,0,1,6,3,6],                                           // [  
        [1,0,3,6],                                                   // /  
        [1,0,3,0,3,6,1,6],                                           // ]  
        [1,1,2,0,3,1],                                               // ^ 
        [0,6,4,6],                                                   // _
        [1.5,0,2.5,1],                                               // `
    ],
};