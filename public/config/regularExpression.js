const replaceList = [
    {"regex" : /(?:\b(?:eval|console|alert|prompt|confirm|while|for|if|document\.[a-zA-Z]+\.|window\.[a-zA-Z]+\.|setTimeout|setInterval)\b)|\bfunction\s*\(|\b\s*=\s*(?:[^>]|\/)/g, "changeValue" : false},
    {"regex" : /sin\(([^)]+)\)/g, "changeValue" : 'Math.sin($1)'},
    {"regex" : /cos\(([^)]+)\)/g, "changeValue" : 'Math.cos($1)'},
    {"regex" : /tan\(([^)]+)\)/g, "changeValue" : 'Math.tan($1)'},

    {"regex" : /×/g, "changeValue" : '*'},
    {"regex" : /÷/g, "changeValue" : '/'},
    {"regex" : /−/g, "changeValue" : '-'},

    {"regex" : /(\d+)√\(([^)]+)\)(\d+)/g, "changeValue" : '$1*(Math.sqrt($2))*$3'},
    {"regex" : /(\d+)√\(([^)]+)\)/g, "changeValue" : '$1*(Math.sqrt($2))'},
    {"regex" : /√\(([^)]+)\)(\d+)/g, "changeValue" : 'Math.sqrt($1)*($2)'},
    {"regex" : /√\(([^)]+)\)/g, "changeValue" : 'Math.sqrt($1)'},

    {"regex" : /(\d+)π(\d+)/g, "changeValue" : '$1*Math.PI*$2'},
    {"regex" : /(\d+)π/g, "changeValue" : '$1*Math.PI'},
    {"regex" : /π(\d+)/g, "changeValue" : 'Math.PI*$1'},
    {"regex" : /π/g, "changeValue" : 'Math.PI'},
    
    {"regex" : /\|([^|]+)\|/g, "changeValue" : 'Math.abs($1)'},
    {"regex" : /\|([^|]+)\|/g, "changeValue" : 'Math.abs($1)'},

    {"regex" : /(\d+)\^(\d+)/g, "changeValue" : 'Math.pow(($1), ($2))'}
];

const transTextBtn = {
    '∣a∣': '|',
    '√': "√(",
    'sin': 'sin(',
    'cos': 'cos(',
    'tan': 'tan(',
    '*': "×",
    'aⁿ': '^'
};

const transTextKeyboard = {
    '*': "×",
    ',': " "
};

const replaceText = [
    // {"regex" : /\bsin\b/, "changeValue" : `Sin(`},
    {"regex": /pi/, "changeValue" : 'π'},
    {"regex": /root/, "changeValue" : '√('},
    {"regex": /<=/, "changeValue": '≤'},
    {"regex": />=/, "changeValue": '≥'}
]