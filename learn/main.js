var add = document.getElementById("add");
var sub = document.getElementById("sub");
var mul = document.getElementById("mul");
var div = document.getElementById("div");
var num = document.getElementById("num");
var min = document.getElementById("min");
var max = document.getElementById("max");
var columns = document.getElementById("columns");
var gen = document.getElementById("gen");
var questions = document.getElementsByClassName("questions")[0];
var daan = document.getElementsByClassName("daan")[0];

var operators = ["+", "-", "×", "÷"];
var functions = [
    function(a, b) { return a + b; },
    function(a, b) { return a - b; },
    function(a, b) { return a * b; },
    function(a, b) { return a / b; }
];


function findIncrementToBeDivisibleBy3(number) {
    const remainder = number % 3;
    if (remainder === 0) {
        return 0; // 已经可以被3整除
    } else if (remainder === 1) {
        return 2; // 需要增加2才能被3整除
    } else {
        return 1; // 需要增加1才能被3整除
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateMixedOperation(a, b, c, op1, op2, func1, func2) {
    // 判断运算符优先级
    const isMulDiv1 = op1 === '×' || op1 === '÷';
    const isMulDiv2 = op2 === '×' || op2 === '÷';
    
    let result;
    if (isMulDiv1 && !isMulDiv2) {
        // 如果第一个是乘除，第二个是加减
        const intermediateResult = func1(a, b);
        result = func2(intermediateResult, c);
    } else if (!isMulDiv1 && isMulDiv2) {
        // 如果第一个是加减，第二个是乘除
        const intermediateResult = func2(b, c);
        result = func1(a, intermediateResult);
    } else {
        // 如果都是乘除或都是加减，从左到右计算
        const intermediateResult = func1(a, b);
        result = func2(intermediateResult, c);
    }
    return result;
}


function generateQuestions() {
    questions.innerHTML = "";
    daan.innerHTML = "";
    questions.style.gridTemplateColumns = `repeat(${columns.value}, 1fr)`;
    daan.style.gridTemplateColumns = `repeat(${columns.value}, 1fr)`;    
    
    var answers = []; // 新增：用于存储答案
    var selectedOperators = [];
    if (add.checked) selectedOperators.push(0);
    if (sub.checked) selectedOperators.push(1);
    if (mul.checked) selectedOperators.push(2);
    if (div.checked) selectedOperators.push(3);
    
    var questionNum = parseInt(num.value);
    var minValue = parseInt(min.value);
    var maxValue = parseInt(max.value);
    
    if (selectedOperators.length == 0) {
        alert("请至少选择一个运算符！");
        return;
    }
    
    if (minValue >= maxValue) {
        alert("最小值应该小于最大值！");
        return;
    }

    var generatedQuestions = new Set(); // 新增：用于存储已生成的题目

    for (var i = 0; i < questionNum; i++) {
        let questionText; // 新增：用于存储题目文本
        let result;

        if (document.querySelector('input[value="mix"]').checked) {
            // 生成混合运算题
            var numOperators = randomInt(1, 2); // 随机使用1-2个运算符
            numOperators = 2
            var a = randomInt(minValue, maxValue);
            var b = randomInt(minValue, maxValue);
            var c = randomInt(minValue, maxValue);
            
            // 随机选择运算符
            var op1Index = randomInt(0, selectedOperators.length - 1);
            var op2Index = randomInt(0, selectedOperators.length - 1);
            var op1 = operators[selectedOperators[op1Index]];
            var op2 = operators[selectedOperators[op2Index]];
            var func1 = functions[selectedOperators[op1Index]];
            var func2 = functions[selectedOperators[op2Index]];
            
            // 计算结果
            if (numOperators === 1) {
                result = func1(a, b);
                questionText = `${a} ${op1} ${b} = `;
            } else {
                result = calculateMixedOperation(a, b, c, op1, op2, func1, func2);
                questionText = `${a} ${op1} ${b} ${op2} ${c} = `;
            }
        } else {
            var opIndex = randomInt(0, selectedOperators.length - 1);
            var op = operators[selectedOperators[opIndex]];
            var func = functions[selectedOperators[opIndex]];
                
            var a, b;
            do {
                a = randomInt(minValue, maxValue);
                b = randomInt(minValue, maxValue);
                result = func(a, b);
            } while (!Number.isInteger(result) || result <= 0);
                
            questionText = `${a} ${op} ${b} = `;
        }

        // 检查题目是否重复
        if (generatedQuestions.has(questionText)) {
            i--; // 重新生成这道题
            continue;
        }

        // 确保结果是正整数
        if (Number.isInteger(result) && result > 0) {
            var questionItem = document.createElement("div");
            questionItem.className = "question-item";
            questionItem.textContent = questionText;
            questions.appendChild(questionItem);
            answers.push(result);
            generatedQuestions.add(questionText); // 添加到已生成的题目集合
        } else {
            // 如果结果不合适，重新生成这道题
            i--;
            continue;
        }
    }

    //显示答案
    var answersContainer = document.createElement("div");
    answersContainer.className = "answers";
    answersContainer.innerHTML = "<h3>答案：</h3><p>" + answers.map((ans, index) => `${index + 1}. ${ans}`).join("&nbsp;&nbsp;&nbsp;&nbsp;") + "</p>";
    daan.appendChild(answersContainer);
}


gen.addEventListener("click", generateQuestions);


 // 添加打印相关函数
 function showPrintPreview() {
    const printPreview = document.getElementById('printPreview');
    const printQuestions = document.getElementById('printQuestions');
    const questions = document.getElementsByClassName('question-item');
    console.log(questions);
    // 清空之前的题目
    printQuestions.innerHTML = '';
    
    // 复制题目到打印预览
    Array.from(questions).forEach((question, index) => {
        const printQuestion = document.createElement('div');
        printQuestion.className = 'print-question';
        printQuestion.innerHTML = `${question.textContent}`;
        printQuestions.appendChild(printQuestion);
    });
    
    // 显示打印预览
    printPreview.style.display = 'block';
}

function closePrintPreview() {
    document.getElementById('printPreview').style.display = 'none';
}

function exportToWord() {
    const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
    const questions = document.getElementsByClassName('question-item');
    const width = 100/columns.value;
    let html = `
        ${header}
        <head>
            <meta charset="utf-8">
            <style>
                @page { 
                    size: A4; 
                    margin: 2cm; 
                    mso-page-orientation: portrait;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 10px; 
                }
                .questions-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .questions-table td {
                    width: ${width}%;
                    vertical-align: top;
                    padding: 5px;
                }
                .question {
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
        <div class="header">
            <h2>FoxStarCommunity<br>小学数学练习题</h2>
            <div style="margin: 20px 0;">
                <span style="margin-right: 30px;">姓名：_________</span>
                <span style="margin-right: 30px;">日期：_________</span>
                <span>得分：_________</span>
            </div>
        </div>
    `;

    const totalQuestions = questions.length;
    const numColumns = parseInt(columns.value);
    const numRows = Math.ceil(totalQuestions / numColumns);

    html += '<table class="questions-table">';
    
    // 按行生成内容
    for (let row = 0; row < numRows; row++) {
        html += '<tr>';
        for (let col = 0; col < numColumns; col++) {
            const questionIndex = row * numColumns + col; // 横向计数
            html += '<td>';
            if (questionIndex < totalQuestions) {
                html += `
                    <div class="question">
                        ${questions[questionIndex].textContent}
                    </div>
                `;
            }
            html += '</td>';
        }
        html += '</tr>';
    }

    html += '</table></body></html>';

    // 创建 Blob 并下载
    const blob = new Blob([html], { 
        type: 'application/msword;charset=utf-8'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'FoxStarCommunity-数学练习题.doc';
    link.click();
    URL.revokeObjectURL(link.href);
}

const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
        
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});


generateQuestions();

function printSelectedValue() {
 const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
const questions = document.getElementsByClassName('question-item');
const answers = document.getElementsByClassName('answers');
const width = 100/columns.value;
let html = `
${header}
<head>
<meta charset="utf-8">
<style>
    @page { 
        size: A4; 
        margin: 2cm; 
        mso-page-orientation: portrait;
    }
    .header { 
        text-align: center; 
        margin-bottom: 10px; 
    }
    .questions-table {
        width: 100%;
        border-collapse: collapse;
    }
    .questions-table td {
        width: ${width}%;
        vertical-align: top;
        padding: 5px;
    }
    .question {
        margin-bottom: 5px;
    }
</style>
</head>
<body>
<div class="header">
    <h3>FoxStarCommunity<br>小学数学练习题</h3>
    <div style="margin: 20px 0;">
        <span style="margin-right: 30px;">姓名：_________</span>
        <span style="margin-right: 30px;">日期：_________</span>
        <span>得分：_________</span>
    </div>
</div>
`;

const totalQuestions = questions.length;
    const numColumns = parseInt(columns.value);
    const numRows = Math.ceil(totalQuestions / numColumns);

    html += '<table class="questions-table">';
    
    // 按行生成内容
    for (let row = 0; row < numRows; row++) {
        html += '<tr>';
        for (let col = 0; col < numColumns; col++) {
            const questionIndex = row * numColumns + col; // 横向计数
            html += '<td>';
            if (questionIndex < totalQuestions) {
                html += `
                    <div class="question">
                        ${questions[questionIndex].textContent}
                    </div>
                `;
            }
            html += '</td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    const selectedValue = html;
    // 创建一个iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write();
    page_h = 890
    if(numColumns==4){
        page_h = 1100
    }else{
        page_h = 890
    }
    // 将变量值分割成多个部分，每个部分作为一个分页
    var pages = splitIntoPages(selectedValue, 2100,page_h);
    console.log(pages);
    pages.forEach(function(page) {
      doc.write('<div class="print-content">' + page + '</div>');
    });
    
    doc.write('</body></html>');
    doc.close();
    
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    
    document.body.removeChild(iframe);
  }
  
  // 分割函数，将长文本分割成适合打印的页面
  function splitIntoPages(text, pageHeight, pageWidth) {
    var pages = [];
    var pageContent = '';
    var currentHeight = 0;
  
    var words = text.split(' ');
    for (var i = 0; i < words.length; i++) {
      var word = words[i] + ' ';
      var testLine = pageContent + word;
      if (currentHeight === 0 || (calculateHeight(testLine, pageWidth) <= pageHeight)) {
        pageContent += word;
        currentHeight += 10; // 行距25px
      } else {
        pages.push(pageContent);
        pageContent = word;
        currentHeight = 10; // 新行开始
      }
    }
    if (pageContent) {
      pages.push(pageContent);
    }
  
    return pages;
  }
  
  // 计算文本高度的函数（这里简化处理，实际可能需要更复杂的布局计算）
  function calculateHeight(text, pageWidth) {
    // 这里简化处理，假设每个字符占据的宽度大约为字体大小的一半
    var charWidth = 16 / 2;
    var lineWidth = text.length * charWidth;
    var lines = Math.ceil(lineWidth / pageWidth);
    return lines * 10; // 行距25px
  }