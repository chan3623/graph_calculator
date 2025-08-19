class GraphCalculator {
    constructor(id) {
        this.id = id;
        this._dotEquationList = [];
        this._linearEquationList = [];
        this._quadraticEquationList = [];
        this._calculusEquationList = [];
        this._circleEquationList = [];
        this._formulaList = [];
        this._calculate_memories = null;
        this.graphBtnId = null;
    }
    get dotEquationList() {
        return this._dotEquationList;
    }
    get linearEquationList() {
        return this._linearEquationList;
    }
    get quadraticEquationList() {
        return this._quadraticEquationList;
    }
    get calculusEquationList() {
        return this._calculusEquationList;
    }
    get circleEquationList() {
        return this._circleEquationList;
    }
    // 메세지 팝업
    viewMessage(message) {
        const viewMessage = $('#viewMessage').dom;
        const okBtn = $('#okBtn').dom;
        
        $('#viewMessageBox').style('display', 'block');
        viewMessage.innerText = message;
        okBtn.addEventListener('click', () => {
            $('#viewMessageBox').dom.removeAttribute('style');
        });
    }
    replaceValue() {
            // p5.js에서 사용할 그래프의 대한 정보를 내포한 변수 세팅
            let dot = { "equation": "", "x": 0, "y": 0, "color": "#333", "on": true, "btn": "graphOriginalBtn", "moveX": 0, "moveY": 0 };
            let linear = { "equation": "", "a": 0, "m": 0, "b": 0, "color": "#333", "on": true, "btn": "graphOriginalBtn", "moveX": 0, "moveY": 0 };
            let quadratic = { "equation": "", "a": 0, "b": 0, "c": 0, "d": 0, "color": "#333", "on": true, "btn": "graphOriginalBtn", "moveX": 0, "moveY": 0 };
            let circle = { "equation": "", "a": 0, "b": 0, "r": 0, "color": "#333", "on": true, "btn": "graphOriginalBtn", "moveX": 0, "moveY": 0 };
            let calculus = { "equation": "", "a": 0, "b": 0, "c": 0, "d": 0, "e": 0, "color": "#333", "on": true, "btn": "graphOriginalBtn", "moveX": 0, "moveY": 0 };
            const inputDom = $("#" + `${this._calculate_memories}`).dom;
            const distinction = inputDom.id.split("_")[0];

            // 입력값 계산해서 반환
            const evalCalc = (elementId) => {
                // 입력된 영역 아이디 변경하여 출력부분 영역 인식
                let test = $("#" + elementId).dom;
                const subValue = test.id.replace('subInput', 'subText');

                let expression = $("#" + elementId).elements("innerHTML");
                replaceList.forEach(v => {
                    expression = expression.replace(v["regex"], v["changeValue"]);
                });
                try{
                    // 입력 영역 숫자일 경우 값 인식하여 출력 영역에 값 삽입
                    if (typeof eval(expression) === "number") {
                        $("#" + elementId).style("border-bottom", "1px solid #5c82ff");
                        document.getElementById(subValue).innerHTML = `${eval(expression)}`;
                        document.getElementById(subValue).style.color = "#5c82ff";
                        return eval(expression);
                    }
                } catch (error){
                    console.error("NaN");
                }
                // 입력 영역 비어있을경우 출력 영역 제거
                if ($("#" + elementId).dom.innerText.length === 0) {
                    $("#" + elementId).dom.removeAttribute('style');
                    document.getElementById(subValue).innerHTML = ``;
                }
                // 입력 영역 계산되지 않는 값 및 숫자 이외를 입력할 경우 에러 메시지 출력 
                else{
                    $("#" + elementId).style("border-bottom", "1px solid red");
                    document.getElementById(subValue).innerHTML = "계산되지 않는 값입니다.";
                    document.getElementById(subValue).style.color = "red"; 

                }
            }

            // 각 리스트에 객체 추가
            const updateList = (listName, objectName) => {
                const existingIndex = listName.findIndex(item => item.equation === distinction);
                if (existingIndex >= 0) {
                    listName[existingIndex] = objectName;
                } else {
                    listName.push(objectName);
                }
            }

            // formula instance의 value 속성에 입력받은 값 저장
            this._formulaList.forEach(list => {
                const inputNum = inputDom.id.split('_')[0][inputDom.id.split('_')[0].length - 1];
                if (inputNum === list.id[list.id.length - 1]) {
                    switch (list.equation) {
                        case "radioDot":
                            list.inputValue["xValue"] = evalCalc(`${distinction}_dot_x`);
                            list.inputValue["yValue"] = evalCalc(`${distinction}_dot_y`);
                            break;
                        case "radioLine":
                            list.inputValue["aValue"] = evalCalc(`${distinction}_linear_a`);
                            list.inputValue["mValue"] = evalCalc(`${distinction}_linear_m`);
                            list.inputValue["bValue"] = evalCalc(`${distinction}_linear_b`);
                            break;
                        case "radioQuadratic":
                            list.inputValue["aValue"] = evalCalc(`${distinction}_quadratic_a`);
                            list.inputValue["bValue"] = evalCalc(`${distinction}_quadratic_b`);
                            list.inputValue["cValue"] = evalCalc(`${distinction}_quadratic_c`);
                            list.inputValue["dValue"] = evalCalc(`${distinction}_quadratic_d`);
                            break;
                        case "radioCircle":
                            list.inputValue["aValue"] = evalCalc(`${distinction}_circle_a`);
                            list.inputValue["bValue"] = evalCalc(`${distinction}_circle_b`);
                            list.inputValue["rValue"] = evalCalc(`${distinction}_circle_r`);
                            break;
                        case "radioCalculus":
                            list.inputValue["aValue"] = evalCalc(`${distinction}_calculus_a`);
                            list.inputValue["bValue"] = evalCalc(`${distinction}_calculus_b`);
                            list.inputValue["cValue"] = evalCalc(`${distinction}_calculus_c`);
                            list.inputValue["dValue"] = evalCalc(`${distinction}_calculus_d`);
                            list.inputValue["eValue"] = evalCalc(`${distinction}_calculus_e`);
                    }
                }
            })

            // formula instance의 속성 가져오기
            let graphColor = null;
            let graphOn = null;
            let graphBtn = null;
            let graphXValue = null;
            let graphYValue = null;
            let graphValue = null;
            this._formulaList.forEach(list => {
                const selectedSubList = document.getElementById(this._calculate_memories);
                const selectedSubListNum = this._calculate_memories.split('_')[0][this._calculate_memories.split('_')[0].length - 1];
                if ((selectedSubList && selectedSubListNum === list.id[list.id.length - 1])) {
                    graphColor = list.color;
                    graphOn = list.graphOn;
                    graphBtn = list.moveBtn;
                    graphXValue = list.moveValue["xValue"];
                    graphYValue = list.moveValue["yValue"];
                    graphValue = list.inputValue;
                }
            })

            if (inputDom.id.includes("dot")) {
                dot["equation"] = distinction;
                dot["x"] = graphValue.xValue;
                dot["y"] = graphValue.yValue;
                dot["color"] = "#" + graphColor;
                dot["on"] = graphOn;
                dot["btn"] = graphBtn;
                dot["moveX"] = graphXValue;
                dot["moveY"] = graphYValue;

                updateList(this._dotEquationList, dot);
                // console.log(dot);

            } else if (inputDom.id.includes("linear")) {
                linear["equation"] = distinction;
                linear["a"] = graphValue.aValue;
                linear["m"] = graphValue.mValue;
                linear["b"] = graphValue.bValue;
                // linear["equal"] = vo.equalValue === null ? "equal" : vo.equalValue;
                linear["color"] = "#" + graphColor;
                linear["on"] = graphOn;
                linear["btn"] = graphBtn;
                linear["moveX"] = graphXValue;
                linear["moveY"] = graphYValue;
                updateList(this._linearEquationList, linear);
                // console.log(linear);

            } else if (inputDom.id.includes("quadratic")) {
                quadratic["equation"] = distinction;
                quadratic["a"] = graphValue.aValue;
                quadratic["b"] = graphValue.bValue;
                quadratic["c"] = graphValue.cValue;
                quadratic["d"] = graphValue.dValue;
                quadratic["color"] = "#" + graphColor;
                quadratic["on"] = graphOn;
                quadratic["btn"] = graphBtn;
                quadratic["moveX"] = graphXValue;
                quadratic["moveY"] = graphYValue;

                updateList(this._quadraticEquationList, quadratic);
                // console.log(quadratic);

            } else if (inputDom.id.includes("circle")) {
                circle["equation"] = distinction;
                circle["a"] = graphValue.aValue;
                circle["b"] = graphValue.bValue;
                circle["r"] = graphValue.rValue;
                circle["color"] = "#" + graphColor;
                circle["on"] = graphOn;
                circle["btn"] = graphBtn;
                circle["moveX"] = graphXValue;
                circle["moveY"] = graphYValue;

                updateList(this._circleEquationList, circle);
                // console.log(circle);
            } else if (inputDom.id.includes("calculus")) {
                calculus["equation"] = distinction;
                calculus["a"] = graphValue.aValue;
                calculus["b"] = graphValue.bValue;
                calculus["c"] = graphValue.cValue;
                calculus["d"] = graphValue.dValue;
                calculus["e"] = graphValue.eValue;
                calculus["color"] = "#" + graphColor;
                calculus["on"] = graphOn;
                calculus["btn"] = graphBtn;
                calculus["moveX"] = graphXValue;
                calculus["moveY"] = graphYValue;

                updateList(this._calculusEquationList, calculus);
                // console.log(quadratic);

            }
        // } catch (e) {
        //     document.getElementById(this._calculate_memories).style.border = "1px solid red";
        // }
    }

    createButton(functions1, buttonBox1, functions2, buttonBox2) {
        // value button class
        class Button {
            constructor(id, btnId, btnValue, graphCalculator) {
                this.id = id;
                this.btnId = btnId;
                this.btnValue = btnValue;
                this.graphCalculator = graphCalculator;
            }
            // button dom 생성
            printButton(buttonBox) {
                document.getElementById(buttonBox).innerHTML += `<button type="button" id="${this.btnId}">${this.btnValue}</button>`;
            }
            // button value 출력
            printButtonValue() {
                // 버튼 입력값 출력 시, 변환해서 출력
                const transTextV = (value) => {
                    return transTextBtn[value] || value;
                }

                // click 이벤트
                document.getElementById(this.btnId).addEventListener('click', (event) => {
                    // 팝업 메세지
                    if (this.graphCalculator._formulaList.length === 0) {
                        this.graphCalculator.viewMessage('그래프 종류를 선택해서 추가해 주세요.');
                    }
                    if (this.graphCalculator._formulaList.length !== 0) {
                        // 커서 제어
                        const selectController = new GetSelection(`id_${this.graphCalculator._calculate_memories}`, this.graphCalculator._calculate_memories);

                        const cursorInfo = selectController.cursorPosition();
                        let transText = transTextV(event.target.innerHTML);

                        if (cursorInfo) {
                            const { startOffset, endOffset } = cursorInfo;
                
                            // 커서기준 앞 뒤 위치 가져오기
                            const textBefore = selectController._targetDOM.textContent.slice(0, startOffset);
                            const textAfter = selectController._targetDOM.textContent.slice(endOffset);
                            
                            // 새로운 텍스트 생성
                            const newText = textBefore + transText + textAfter;

                            // 바뀐 텍스트로 출력
                            selectController._targetDOM.innerHTML = newText;
                
                            // 커서 포지션 재설정
                            const newCursorPosition = startOffset + transText.length;
                            selectController.setCursorPosition(newCursorPosition);
                        } else {
                            selectController._targetDOM.innerHTML += transText;
                            selectController.setCursorPosition(selectController._targetDOM.textContent.length);
                        }

                        // 계산식 예외처리 & 값 저장
                        this.graphCalculator.replaceValue();
                    }
                });
            }
        }
        // button click event
        const buttonEvent = (functions, buttonBox) => {
            const btnList = [];
            functions.forEach(btn => {
                btnList.push(new Button(btn.name, btn.name, btn.value, this));
            });
            btnList.forEach(btn => {
                btn.printButton(buttonBox);
            });
            btnList.forEach(btn => {
                btn.printButtonValue();
            });
        }
        buttonEvent(functions1, buttonBox1);
        buttonEvent(functions2, buttonBox2);

        // other Button
        class EditButton {
            constructor(id, graphCalculator) {
                this.id = id;
                this.graphCalculator = graphCalculator;
            }
            // 텍스트 지우기 버튼
            clearText() {
                document.getElementById('clearBtn').addEventListener('click', () => {
                    // 커서 제어
                    const selectController = new GetSelection(`id_${this.graphCalculator._calculate_memories}`, this.graphCalculator._calculate_memories);

                    const cursorInfo = selectController.cursorPosition();
                    // 계산기 값 출력 DOM
                    const subInputDOM = $(`#${this.graphCalculator._calculate_memories}`).dom;
                    const subValue = subInputDOM.id.replace('subInput', 'subText');

                    if (cursorInfo) {
                        const { startOffset } = cursorInfo;
                        if (startOffset > 0) {
                            // 커서 하나 앞의 위치를 찾아서 분리 + 커서 뒤와 결합 -> 사이에 글자 없어짐
                            const textBefore = selectController._targetDOM.textContent.slice(0, startOffset - 1);
                            const textAfter = selectController._targetDOM.textContent.slice(startOffset);

                            // 없어지는 대로 출력
                            selectController._targetDOM.textContent = textBefore + textAfter;

                            // 계산기 값 입력 쪽도 같이 반영
                            $(`#${subValue}`).dom.innerHTML = selectController._targetDOM.textContent;
                            
                            selectController.setCursorPosition(startOffset - 1);
                        }                        
                    }

                    // 보더 없애기
                    if($(`#${this.graphCalculator._calculate_memories}`).dom.innerText.length === 0){
                        $(`#${this.graphCalculator._calculate_memories}`).dom.removeAttribute('style');
                    }
                });
            }
            // 커서 이동 함수
            moveCursor(direction) {
                const selectController = new GetSelection(`id_${this.graphCalculator._calculate_memories}`, this.graphCalculator._calculate_memories);
                
                const cursorInfo = selectController.cursorPosition();
                if (!cursorInfo) return;
        
                let { startOffset } = cursorInfo;
        
                if (direction === 'left' && startOffset > 0) {
                    startOffset--;
                } else if (direction === 'right' && startOffset < selectController._targetDOM.textContent.length) {
                    startOffset++;
                }
        
                // 커서 위치 재설정
                selectController.setCursorPosition(startOffset);
            }
            // 커서 이동 버튼 이벤트 설정
            clickMoveButton(){
                document.querySelector('.btn_icon_left').addEventListener('click', () => {
                    this.moveCursor('left');
                });
                
                document.querySelector('.btn_icon_right').addEventListener('click', () => {
                    this.moveCursor('right');
                });
            }
        }
        
        const editButton = new EditButton('editButton', this);
        editButton.clearText();
        editButton.clickMoveButton();
    }

    createContentEditable() {
        // list class 
        class Formula {
            constructor(id, count, equation, moveBtn, graphCalculator) {
                this.id = id;
                this.count = count;
                this.color = null;
                this.graphOn = true;
                this.equation = equation;
                this.inputValue = {};
                this.moveBtn = moveBtn;
                this.moveValue = { "xValue": 0, "yValue": 0 };
                this.graphCalculator = graphCalculator;
            }
            // list default color 지정
            assignColor() {
                this.color = colors[this.count % colors.length].color;
            }
            // list 생성
            createFormulaList() {
                this.assignColor();
                const memory = `
                    <li class="calculate_memories" id="memories${this.count}_on">
                        <div class="calculate_main">
                            <div class="color" style="background-color: #${this.color}"></div>
                            <div class="memory_content" id="memories${this.count}"></div>
                            <div class="btn_box">
                                <input id="check${this.count}" class="check_icon" name="graphOn" type="checkbox" checked disabled>
                                <label for="check${this.count}"> on </label>
                                <button class="btn_icon_delete cancel_btn" id="subInput${this.count}_deleteBtn" type="button">
                                    <span>삭제</span>
                                </button>
                            </div>
                        </div>
                        <div id="calculateSub" class="calculate_sub">
                        </div>
                    </li>
                    `;
                document.getElementById('memoriesList').innerHTML = memory + $('#memoriesList').elements("innerHTML");

                this.deleteList();
                this.selectedList();
            }
            // 리스트 방정식영역 선택시 박스 색상 표시
            selectedList() {
                document.querySelectorAll(".memory_content").forEach(v => {
                    v.addEventListener("click", () => {
                        //on클래스 삭제
                        document.querySelectorAll('.calculate_memories').forEach(li => {
                            li.classList.remove('on');
                        });
                        //선택된 박스 on클래스 추가
                        document.getElementById(`${v.id}_on`).classList.add("on");
                        //선택된 박스만 눈 체크박스 선택 가능, 이외는 선택 불가능 설정
                        document.querySelectorAll('.check_icon').forEach(icon => {
                            console.log(icon);
                            if (icon.closest(`#${v.id}_on`)) {
                                icon.disabled = (v.id) ? false : true;
                            } else {
                                icon.disabled = true;
                            }
                        });
                    });
                })
            }
            // list 삭제
            // 삭제버튼 클릭 시 실제 그래프가 삭제되기 위해 GraphCalculator클래스의 constructor의 배열의 요소를 삭제
            deleteList() {
                const equationList = [
                    { "equation": "_dotEquationList" },
                    { "equation": "_linearEquationList" },
                    { "equation": "_quadraticEquationList" },
                    { "equation": "_circleEquationList" },
                    { "equation": "_calculusEquationList" }
                ];
                document.getElementById('memoriesList').addEventListener('click', (e) => {
                    if (e.target && e.target.classList.contains('cancel_btn')) {
                        const clearBtnId = e.target.id.split("_")[0];
                        const clearBtnNum = e.target.id.replace(/[A-z]*/g, '');
                        // console.log(clearBtnNum);
                        console.log(this.graphCalculator);
                        equationList.forEach(v => {
                            for (let i in v) {
                                this.graphCalculator[`${v[i]}`].forEach((equationListValue, equationListIndex) => {
                                    if (equationListValue.equation === clearBtnId) {
                                        this.graphCalculator[`${v[i]}`].splice(equationListIndex, 1);
                                    };
                                });
                            }
                        })
                        e.target.parentNode.parentNode.parentNode.remove();

                        // formulaList 삭제
                        this.graphCalculator._formulaList = this.graphCalculator._formulaList.filter(eachInstance => {
                            return clearBtnNum !== eachInstance.id.replace(/[A-z]*/g, '');
                        });

                        console.log(this.graphCalculator._formulaList);
                    }
                });
            }
        }
        // list instance 시각화 및 속성 변경
        class FormulaEvent {
            constructor(id, graphCalculator) {
                this.id = id;
                this.graphCalculator = graphCalculator;
                this.count = 0;
                this.previousEqualValue = null;
            }
            settingMenuMessage() {
                document.querySelectorAll('.comn_message').forEach(eachBtn => {
                    eachBtn.addEventListener('click', () => {
                        // 팝업 메세지
                        if (this.graphCalculator._formulaList.length === 0) {
                            this.graphCalculator.viewMessage('그래프 종류를 선택해서 추가해 주세요.');
                        }
                    });
                });
            }
            // 각 list의 color 변경시 formula instance 속성에 재할당
            changeColor() {
                const radioButtons = document.querySelectorAll('input[name="color"]');
                radioButtons.forEach(radioValue => {
                    radioValue.addEventListener('change', (event) => {
                        const selectedColor = colors.find(color => color.name === event.target.id);
                        console.log(this.graphCalculator._calculate_memories)
                        if (this.graphCalculator._calculate_memories) {
                            const selectedSubList = document.getElementById(this.graphCalculator._calculate_memories);
                            const selectedSubListNum = this.graphCalculator._calculate_memories.split('_')[0][this.graphCalculator._calculate_memories.split('_')[0].length - 1];
                            this.graphCalculator._formulaList.forEach(list => {
                                if ((selectedSubList && selectedSubListNum === list.id[list.id.length - 1])) {
                                    const selectedListId = document.getElementById(`memories${selectedSubListNum}_on`);
                                    selectedListId.querySelector('.color').style.backgroundColor = `#${selectedColor.color}`;
                                    list.color = selectedColor.color;
                                    this.graphCalculator.replaceValue();
                                }
                            })
                        }
                    })
                })
            }
            // 각 list의 graph on/off 클릭시 해당 formula instance 속성에 재할당
            checkedGraphOn() {
                const graphOnList = document.querySelectorAll('input[name="graphOn"]');
                graphOnList.forEach(on => {
                    on.addEventListener('change', (event) => {
                        const graphOn = event.target.id[event.target.id.length - 1];
                        this.graphCalculator._formulaList.forEach(list => {
                            const listId = list.id[list.id.length - 1];
                            if (graphOn === listId) {
                                list.graphOn = on.checked;
                                this.graphCalculator.replaceValue();
                            }
                        })
                    });
                });
            }
            // 각 list의 이동, 대칭 버튼 클릭 시 해당 value를 formula instance 속성에 할당
            clickMoveBtn(btn) {
                document.getElementById(btn).addEventListener('click', () => {
                    this.graphCalculator._formulaList.forEach(list => {
                        const selectedSubListNum = this.graphCalculator._calculate_memories.split('_')[0][this.graphCalculator._calculate_memories.split('_')[0].length - 1];
                        if (selectedSubListNum === list.id[list.id.length - 1]) {
                            list.moveBtn = btn;
                            if (btn === "graphMoveBtn") {
                                try{
                                    let moveXEvalValue = document.getElementById("axis_x").value;
                                    let moveYEvalValue = document.getElementById("axis_y").value;
                                    replaceList.forEach(v => {
                                        moveXEvalValue = moveXEvalValue.replace(v["regex"], v["changeValue"]);
                                        moveYEvalValue = moveYEvalValue.replace(v["regex"], v["changeValue"]);
                                    });
                                    if(typeof eval(moveXEvalValue) === "number" && typeof eval(moveYEvalValue) === "number"){
                                        list.moveValue["xValue"] = eval(moveXEvalValue);
                                        list.moveValue["yValue"] = eval(moveYEvalValue);
                                    }
                                }catch(e){
                                    this.graphCalculator.viewMessage("잘못된 값을 입력하셨습니다.");
                                }
                            }
                            this.graphCalculator.replaceValue();
                        }
                    })
                })
            }
            // createBtn click method
            printFormulaList() {
                document.getElementById('createBtn').addEventListener('click', () => {
                    const selectGraphBtn = document.querySelector('input[name="graph"]:checked');
                    this.graphCalculator.graphBtnId = selectGraphBtn === null ? null : selectGraphBtn.id;

                    // 팝업 메세지
                    if (selectGraphBtn === null && this.graphCalculator.graphBtnId === null) {
                        this.graphCalculator.viewMessage('그래프 종류를 선택해서 추가해 주세요.');
                    }

                    if (this.graphCalculator.graphBtnId !== null) {
                        this.graphCalculator._formulaList.push(new Formula(`memories${this.count}`, this.count, this.graphCalculator.graphBtnId, "graphOriginalBtn", this.graphCalculator));
                        this.graphCalculator._formulaList[this.graphCalculator._formulaList.length - 1].createFormulaList();
                        console.log(this.graphCalculator._formulaList);
                        this.selectedRadio();                    
                        this.count++;

                        // 라디오 버튼 체크 상태 초기화
                        document.querySelectorAll('input[name="graph"]').forEach(rb => rb.checked = false);

                        this.addSubInputEvent();
                        this.changeColor();
                        this.checkedGraphOn();
                        this.clickMoveBtn("graphMoveBtn");
                        this.clickMoveBtn("graphXMoveBtn");
                        this.clickMoveBtn("graphYMoveBtn");
                        this.clickMoveBtn("graphXYMoveBtn");
                        this.clickMoveBtn("graphOriginalBtn");
                        this.changeInputValue();
                    }
                });
            }
            // 선택한 그래프 종류에 따라 생성
            selectedRadio(){
                if (this.graphCalculator.graphBtnId == 'radioDot') { // 점 선택
                    const subText = `
                        <div class="calculate_input">
                            <span class="sub_txt">x = </span>
                            <div class="sub_input" id="subInput${this.count}_dot_x" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_dot_x"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">y = </span>
                            <div class="sub_input" id="subInput${this.count}_dot_y" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_dot_y"></div>
                        </div>
                    `;
                    document.getElementById('calculateSub').innerHTML += subText;
                    document.getElementById(`memories${this.count}`).innerHTML = "(x, y)";
                    const inputElement = document.getElementById(`subInput${this.count}_dot_x`);
                    inputElement.focus();
                    this.graphCalculator._calculate_memories = inputElement.id;
                    this.selectAdd();
                } else if (this.graphCalculator.graphBtnId === 'radioLine') { // 직선 선택 
                    const subText = `
                        <div class="calculate_input">
                            <span class="sub_txt">a = </span>
                            <div class="sub_input" id="subInput${this.count}_linear_a" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_linear_a"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">m = </span>
                            <div class="sub_input" id="subInput${this.count}_linear_m" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_linear_m"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">b = </span>
                            <div class="sub_input" id="subInput${this.count}_linear_b" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_linear_b"></div>
                        </div>
                    `;
                    document.getElementById('calculateSub').innerHTML += subText;
                    document.getElementById(`memories${this.count}`).innerHTML = "ay = mx + b";
                    const inputElement = document.getElementById(`subInput${this.count}_linear_a`);
                    inputElement.focus();
                    this.graphCalculator._calculate_memories = inputElement.id;
                    this.selectAdd();
                } else if (this.graphCalculator.graphBtnId == 'radioQuadratic') { // 포물선 선택 
                    const subText = `
                        <div class="calculate_input">
                            <span class="sub_txt">a = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_quadratic_a" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_quadratic_a"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">b = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_quadratic_b" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_quadratic_b"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">c = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_quadratic_c" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_quadratic_c"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">d = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_quadratic_d" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_quadratic_d"></div>
                        </div>
                    `;
                    document.getElementById('calculateSub').innerHTML += subText;
                    document.getElementById(`memories${this.count}`).innerHTML = "ay = bx<sup>2</sup> + cx + d";
                    const inputElement = document.getElementById(`subInput${this.count}_quadratic_a`);
                    inputElement.focus();
                    this.graphCalculator._calculate_memories = inputElement.id;
                    this.selectAdd();
                } else if (this.graphCalculator.graphBtnId == 'radioCircle') { // 원 선택 
                    const subText = `
                        <div class="calculate_input">
                            <span class="sub_txt">a = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_circle_a" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_circle_a"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">b = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_circle_b" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_circle_b"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">r = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_circle_r" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_circle_r"></div>
                        </div>
                    `;
                    document.getElementById('calculateSub').innerHTML += subText;
                    document.getElementById(`memories${this.count}`).innerHTML = "(x - a)<sup>2</sup> + (y - b)<sup>2</sup> = r<sup>2</sup>";
                    const inputElement = document.getElementById(`subInput${this.count}_circle_a`);
                    inputElement.focus();
                    this.graphCalculator._calculate_memories = inputElement.id;
                    this.selectAdd();
                } else if (this.graphCalculator.graphBtnId == 'radioCalculus'){ // 3차 방정식
                    const subText = `
                        <div class="calculate_input">
                            <span class="sub_txt">a = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_calculus_a" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_calculus_a"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">b = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_calculus_b" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_calculus_b"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">c = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_calculus_c" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_calculus_c"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">d = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_calculus_d" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_calculus_d"></div>
                        </div>
                        <div class="calculate_input">
                            <span class="sub_txt">e = </span>
                            <div class="sub_input input${this.count}" id="subInput${this.count}_calculus_e" contenteditable="true"></div>
                            <div class="sub_value" id="subText${this.count}_calculus_e"></div>
                        </div>
                    `;
                    document.getElementById('calculateSub').innerHTML += subText;
                    document.getElementById(`memories${this.count}`).innerHTML = "ay = bx<sup>3</sup> + cx<sup>2</sup> + dx + e";
                    const inputElement = document.getElementById(`subInput${this.count}_calculus_a`);
                    inputElement.focus();
                    this.graphCalculator._calculate_memories = inputElement.id;
                    this.selectAdd();
                }
            }
            // 선택 list 배경색상
            selectAdd() {
                //on클래스 삭제
                document.querySelectorAll('.calculate_memories').forEach(li => {
                    li.classList.remove('on');
                });
                //선택된 박스 on클래스 추가
                document.getElementById(`memories${this.count}_on`).classList.add("on"); //memories0_on
                // 라디오 버튼 체크 상태 초기화
                document.querySelectorAll('input[name="color"]').forEach(rb => rb.checked = false);

                $("#axis_x").attribute("value", "")
                $("#axis_y").attribute("value", "");

                //선택된 박스만 눈 체크박스 선택 가능, 이외는 선택 불가능 설정
                document.querySelectorAll('.check_icon').forEach(icon => {
                    if (icon.closest(`#memories${this.count}_on`)) {
                        icon.disabled = (`memories${this.count}_on`) ? false : true;
                    } else {
                        icon.disabled = true;
                    }
                });
            }
            // sub input 클릭 이벤트
            addSubInputEvent() {
                document.querySelectorAll(".sub_input").forEach(input => {
                    input.addEventListener("click", () => {
                        const idParts = input.id.split('_');
                        const parentId = `memories${idParts[0].replace('subInput', '')}_on`;
                        const parentElement = document.getElementById(parentId);
                        this.graphCalculator._calculate_memories = input.id;
                        // 리스트 선택시 'on' className을 주어 박스 색상 표시
                        if (parentElement) {
                            document.querySelectorAll('.calculate_memories').forEach(li => {
                                li.classList.remove('on');
                            });
                            parentElement.classList.add("on");
                        } else {
                            console.error(`Element with id ${parentId} not found`);
                        }
                        // 라디오 버튼 체크 상태 초기화
                        document.querySelectorAll('input[name="color"]').forEach(rb => rb.checked = false);
                        // 이동 값 입력받는 input 초기화
                        $("#axis_x").attribute("value", "")
                        $("#axis_y").attribute("value", "");
                        // 선택된 박스만 그래프 on / off 선택 가능, 이외는 선택 불가능 설정
                        document.querySelectorAll('.check_icon').forEach(icon => {
                            if (icon.closest(`#${parentId}`)) {
                                icon.disabled = (this.graphCalculator._calculate_memories === input.id) ? false : true;
                            } else {
                                icon.disabled = true;
                            }
                        });
                    });
                });
            }
            // 실시간 input event
            changeInputValue() {
                let isTabKeydown = false; // 탭을 눌렀는지 여부

                // input 이벤트
                document.querySelectorAll(".sub_input").forEach((eachDOM) => {
                    console.log(eachDOM);
                    eachDOM.addEventListener("input", () => {
                        // 커서 제어 세팅
                        const selectController = new GetSelection(`id_${this.graphCalculator._calculate_memories}`, this.graphCalculator._calculate_memories);

                        const cursorPosition = selectController.cursorPosition();
                        // 현재 커서 위치
                        let startOffset = cursorPosition ? cursorPosition.startOffset : 0;
                        let transText = eachDOM.innerHTML;

                        // 글자 변환
                        replaceText.forEach(replaceItem => {
                            const regex = new RegExp(replaceItem.regex, 'g');
                            const changeValue = replaceItem.changeValue;
                            let match;
                            // match로 배열 또는 null을 반환
                            // 배열 구성 -> match[0] : 찾아낸 문자열 / index: 첫번째 찾은 인덱스
                            while ((match = regex.exec(transText)) !== null) {
                                const matchIndex = match.index;

                                // 바뀐 텍스트와 기존 텍스트의 길이가 같을 때,
                                if (matchIndex === startOffset) {
                                    startOffset = matchIndex + changeValue.length;
                                // 바뀐 텍스트의 길이가 기존 텍스트보다 짧거나 길 때,
                                } else {
                                    startOffset += (changeValue.length - match[0].length);
                                }
                                
                                // 텍스트 변환하기
                                // 변환할 텍스트 앞문자까지 + 변환 텍스트 + 나머지 뒷 문자
                                transText = transText.slice(0, matchIndex) + changeValue + transText.slice(matchIndex + match[0].length);
                                // lastIndex(다음 검색이 시작될 인덱스) 속성 업데이트 -> 첫번째 변환 텍스트 다음으로 
                                regex.lastIndex = matchIndex + changeValue.length;
                            }
                        });

                        // 변환된 텍스트를 설정
                        eachDOM.innerHTML = transText;
                        // 커서 위치 복원
                        selectController.setCursorPosition(startOffset);

                        // 계산식 예외처리 & 값 저장
                        this.graphCalculator.replaceValue();
                    });

                    
                    // Enter, Tab 키 이벤트
                    eachDOM.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                        else if(e.key === "Tab"){
                            isTabKeydown = true;
                        }
                    });

                    // 현재 DOM 감지(tab)
                    eachDOM.addEventListener("focus", () => {
                        this.graphCalculator._calculate_memories = eachDOM.id;
                        if(isTabKeydown === true){
                            const selectController = new GetSelection(`id_${this.graphCalculator._calculate_memories}`, this.graphCalculator._calculate_memories);
                            selectController.setCursorPosition(selectController._targetDOM.textContent.length);
                        }
                        isTabKeydown = false;
                    });
                });
            }
        }
        const formulaEvent = new FormulaEvent('formulaEvent', this);
        formulaEvent.printFormulaList();
        formulaEvent.settingMenuMessage();
    }
    effect(){
        class Effect{
            constructor(id){
                this.id = id;
            }
            // side open
            containerOpen(){
                if(document.getElementById('moreBtn')){
                    document.getElementById('moreBtn').addEventListener('click', (event) => {
                        document.getElementById('calculatorContainer').style.transition = "transform .2s linear";
                        document.getElementById('calculatorContainer').classList.add('open');
                        document.getElementById('graphContainer').classList.add('decrease');
                        event.target.id = 'hiddenBtn';
                        this.containerClose();
                    })
                }
            }
            // side close
            containerClose(){
                if(document.getElementById('hiddenBtn')){
                    document.getElementById('hiddenBtn').addEventListener('click', (event) => {
                        document.getElementById('calculatorContainer').style.transition = "transform .2s linear";
                        document.getElementById('calculatorContainer').classList.remove('open');
                        document.getElementById('graphContainer').classList.remove('decrease');
                        setTimeout(() => {
                            document.getElementById('calculatorContainer').style.transition = "none";
                        }, 500);
                        event.target.id = 'moreBtn';
                        this.containerOpen();
                    })
                }
            }
            // pop toggle
            menuOpen(){
                if(document.getElementById('menuBtn')){
                    document.getElementById('menuBtn').addEventListener('click', () => {
                        document.getElementById('popupBox').classList.toggle('close');
                    })
                }
            }
        }
        const effect = new Effect('effect');
        effect.containerOpen();
        effect.menuOpen();
    }
}

const myC = new GraphCalculator("myC");
myC.createButton(functions1, "buttonBox1", functions2, "buttonBox2");
myC.createContentEditable();
myC.effect();