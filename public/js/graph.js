class Graph {
    constructor(id, step) {
        this.id = id;
        this.step = step; // 그리드 간격
        this.scaleFactor = 1.2; // 확대 축소 비율
        this.scaledStep = 0;
        this.scaleNum = 4;
        this.scaleStepIndex = 1;
        this.graduation = [1, 2, 5];
        this.stepArray = [20, 25, 20];
        this.centerX = 0; // 그래프 중심 X 좌표
        this.centerY = 0; // 그래프 중심 Y 좌표
        this.graphWidth = 0;
        this.graphHeight = 0;
        this.restartCt = 1;
        this.zoomCt = 0;
        this.testArray = 0;
        this.fiexdct = 0;
        this.basicScale = 50;
        this.ct = 1;
        this.dragging = false; // 드래그 상태 여부
        this.calValues;
        this.calValues_version2;
    }
    initObserver() {
        const container = document.getElementById(this.id);
        const resizeObserver = new ResizeObserver(() => {
            this.updateCanvasSize();
            this.p.redraw();
        });
        resizeObserver.observe(container);
    }
    //화면 새로 인식
    updateCanvasSize() {
        const container = document.getElementById(this.id);
        const canvasWidth = container.clientWidth;
        const canvasHeight = container.clientHeight;
        //console.log(canvasWidth, ":", canvasHeight);

        //화면 비율 변화 감지
        this.p.resizeCanvas(canvasWidth, canvasHeight);
        // 그래프 중심 좌표 재계산
        this.centerX = this.p.width / 2;
        this.centerY = this.p.height / 2;
    }
    createGraph() {
        new p5((p) => {
            p.setup = () => {
                //p는 p5에 모든 객체를 담고있음
                this.p = p;
                // 그래프를 표시할 요소 선택 및 크기 설정
                const container = document.getElementById(this.id);
                p.createCanvas(container.clientWidth, container.clientHeight).parent(container);
                p.noFill(0);
                this.updateCanvasSize();
                // 그래프 중심 좌표 계산
                this.centerX = p.width / 2;
                this.centerY = -p.height / 2;
                this.initObserver(); // ResizeObserver 초기화
                const resetButton = document.getElementById('centerBtn');
                resetButton.addEventListener('click', () => {
                    this.resetToOrigin();
                });
                //p.noLoop(); // draw()의 자동 루프를 중지
            };
            //사이즈 변경을 감지하고 새로값을 판별하여 보내주는 부분
            p.windowResized = () => {
                this.updateCanvasSize();
                p.redraw();
            };
            //그래프를 실시간 랜더링 하며 그리는 부분
            p.draw = () => {
                // getter를 사용하여 지속적으로 evalValue의 대한 값을 가지고 옴
                const linearEquationList = myC._linearEquationList;
                const quadraticEquationList = myC._quadraticEquationList;
                const circleEquationList = myC._circleEquationList;
                const dotEquationList = myC._dotEquationList;
                const calculusEquationList = myC._calculusEquationList;

                // 그래픽 요소 그리기
                p.background(255); // 배경 초기화
                p.translate(this.centerX, this.centerY); // 중심으로 이동
                p.scale(this.scaleFactor); // 확대 축소 적용
                p.translate(-this.centerX, -this.centerY); // 중심으로 이동
                p.textSize(12);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("0", this.centerX - 8, this.centerY + 10);
                this.drawAxes(p); // 좌표축 그리기
                this.drawGrid(p); // 그리드 그리기
                this.zoomEvent(p);
                // this.drawCircle(p, 0, 0, aaa);
                // this.drawCircle(p, 0, 0, (aaa * 2));
                linearEquationList.forEach(v => {
                    this.drawLinearFunction(p, v);
                });
                quadraticEquationList.forEach(v => {
                    this.drawQuadraticFunction(p, v);// y = x^2 - 2x + 1
                });
                circleEquationList.forEach(v => {
                    this.drawCircle(p, v);
                });
                dotEquationList.forEach(v => {
                    this.drawPoint(p, v);
                });
                calculusEquationList.forEach(v => {
                    this.drawCubicDerivative(p, v); // 3차 방정식 도함수 그리기
                });
                document.getElementById("zoomIn").addEventListener("click", () => { this.zoomIn(p) });
                document.getElementById("zoomOut").addEventListener("click", () => { this.zoomOut(p) });
            };

            p.mouseWheel = (event) => {
                // 마우스 휠 이벤트 처리 (확대/축소)
                if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                    let normalizedDelta = event.deltaY > 0 ? -0.05 : 0.05;
                    this.scaleFactor += normalizedDelta;

                    //캔버스에 확대가 일정 부분에 도달하면 초기화
                    if (this.scaleFactor < 0.8 || this.scaleFactor > 1.6) {
                        this.scaleFactor = 1.2;
                        const isIncrease = event.deltaY >= 0;
                        //마우스 위치 추적후 기준점을 잡아 확대 축소
                        const graphMouseX = (p.mouseX - this.centerX) / this.scaleFactor;
                        const graphMouseY = (p.mouseY - this.centerY) / this.scaleFactor;

                        this.centerX -= graphMouseX * normalizedDelta;
                        this.centerY -= graphMouseY * normalizedDelta;

                        this.scaleNum += isIncrease ? 1 : -1;
                        // console.log(this.ct)
                        // 스케일 인덱스 업데이트
                        if (isIncrease) {
                            //console.log('감소')
                            this.restartCt = (this.restartCt + 1) % 3; // 0, 1, 2 순환 
                            //this.UpandDown /= 10;
                        } else {
                            //console.log('증가')
                            this.restartCt = (this.restartCt + 2) % 3; // 2, 1, 0 역순환
                            //this.UpandDown *= 10;
                        }

                        this.scaleStepIndex = this.restartCt; // 스케일 인덱스 계산
                        // 인덱스 번호가 1번에 도착했을때 기본값으로 복원
                        if (this.scaleStepIndex === 1) {
                            this.ct = 1;
                        } else {
                            this.ct += 1
                        }
                        //드래그 2번이상 감지후 값을 재계산
                        if (this.ct > 2) {
                            if (this.scaleStepIndex === 2 || this.scaleStepIndex === 0) {
                                if (isIncrease) {
                                    this.graduation = this.graduation.map(value => value / 10);
                                    if (this.fiexdct > 0) {
                                        this.fiexdct -= 1;
                                    }
                                } else {
                                    this.graduation = this.graduation.map(value => value * 10);
                                    if (this.graduation[0] > 5) {
                                        this.fiexdct += 1;
                                    }
                                }
                            }
                        }
                        //console.log(this.fiexdct)
                        this.testArray = this.graduation[this.scaleStepIndex];
                        this.step = this.stepArray[this.scaleStepIndex];
                        this.basicScale = this.step * this.testArray;
                        p.redraw(); // 초기 위치로 그리기
                    }
                    return false; // 기본 스크롤 동작 방지
                }
            };
            //마우스가 눌렸을때 id확인후 드래그 on off 부분
            p.mousePressed = (e) => {
                if (e.target.id === "defaultCanvas0") {
                    this.dragging = true; // 드래그 시작 
                } else {
                    this.dragging = false;
                }
                this.prevX = p.mouseX;
                this.prevY = p.mouseY;
            };
            //마우스 드래그 이벤트
            p.mouseDragged = (e) => {
                if (this.dragging) {
                    const dx = p.mouseX - this.prevX;
                    const dy = p.mouseY - this.prevY;

                    // 드래그 이동 범위 제한
                    const newCenterX = this.centerX + dx / this.scaleFactor;
                    const newCenterY = this.centerY + dy / this.scaleFactor;

                    //기본 width와 height 값에서 값을 곱해 최대치 계산
                    const maxOffsetX = this.p.width * 3;
                    const maxOffsetY = this.p.height * 4;
                    //최대치 조정
                    if (Math.abs(newCenterX - this.p.width / 2) <= maxOffsetX) {
                        this.centerX = newCenterX;
                    }
                    if (Math.abs(newCenterY - this.p.height / 2) <= maxOffsetY) {
                        this.centerY = newCenterY;
                    }

                    this.prevX = p.mouseX;
                    this.prevY = p.mouseY;
                    p.redraw();
                }
            };
            //마우스 드래그 종료
            p.mouseReleased = () => {
                this.dragging = false; // 드래그 종료
            }
        });
    }
    //기준선을 그리는 부분
    drawAxes(p) {
        // 좌표축 그리기
        p.stroke(0);
        this.scaledStep = this.step * this.scaleFactor;
        this.graphWidth = (p.width - 2) / this.scaleFactor; // 그래프 너비
        this.graphHeight = (p.height - 2) / this.scaleFactor; // 그래프 높이
        p.line(this.centerX + this.graphWidth * this.scaledStep, this.centerY, this.centerX - this.graphWidth * this.scaledStep, this.centerY); // x축 그리기
        p.line(this.centerX, this.centerY + this.graphHeight * this.scaledStep, this.centerX, this.centerY - this.graphHeight * this.scaledStep); // y축 그리기
    }
    //눈금과 그리드 그리는 부분
    drawGrid(p) {
        p.stroke(100);
        p.strokeWeight(0.5);
        //console.log(this.step)
        let graduated = 0;
        //들어오는 수에 따라 그리드 간격 조절
        if (this.step === 25) {
            this.scaleNum = 4;
            graduated = this.basicScale;
        } else if (this.step === 20) {
            this.scaleNum = 5;
            if (this.testArray == this.graduation[0]) {
                graduated = this.basicScale * 5;
                //console.log(nungeum)
            } else {
                graduated = this.basicScale / 5;
                //console.log(nungeum)
            }
        }

        // y축 그리드 그리기
        for (let i = this.centerX + this.step; i < this.centerY + this.graphWidth * this.step; i += this.step) {
            p.line(i, this.centerY * this.scaledStep, i, this.centerY - this.graphHeight * this.scaledStep);
            p.line(i, this.centerY * this.scaledStep, i, this.centerY + this.graphHeight * this.scaledStep);
        }
        for (let i = this.centerX - this.step; i > this.centerY - this.graphWidth * +(this.step); i -= this.step) {
            p.line(i, this.centerY * this.scaledStep, i, this.centerY - this.graphHeight * this.scaledStep);
            p.line(i, this.centerY * this.scaledStep, i, this.centerY + this.graphHeight * this.scaledStep);
        }

        //x축 그리드 그리기
        for (let i = this.centerY + this.step; i < this.centerY + this.graphHeight * this.step; i += this.step) {
            p.line(this.centerX * this.scaledStep, i, this.centerX + this.graphWidth * this.scaledStep, i);
            p.line(this.centerX * this.scaledStep, i, this.centerX - this.graphWidth * this.scaledStep, i);
        }
        for (let i = this.centerY - this.step; i > this.centerY - this.graphHeight * +(this.step); i -= this.step) {
            p.line(this.centerX * this.scaledStep, i, this.centerX + this.graphWidth * this.scaledStep, i);
            p.line(this.centerX * this.scaledStep, i, this.centerX - this.graphWidth * this.scaledStep, i);
        }
        // 그리드 눈금 그리기
        p.strokeWeight(1.5);
        // x축 눈금 그리기
        let testNumber = this.step * this.scaleNum;
        //console.log(testNumber)
        for (let i = this.centerX + testNumber; i < this.centerY + this.graphWidth * this.scaledStep; i += testNumber) {
            let upNumber = ((i - this.centerX) / graduated);
            if (Math.abs(upNumber) >= 1e5 || Math.abs(upNumber) < 0.0001) {//지수 변환 부분
                upNumber = upNumber.toExponential(0);
            } else {
                upNumber = upNumber.toFixed(this.fiexdct);//소수점 자릿수 마우스 이벤트에 따른 자릿수변경
            }
            p.line(i, this.centerY - this.graphWidth * testNumber, i, this.centerY + this.graphWidth * testNumber);
            p.text(upNumber, i - 7, this.centerY + 9);
        }

        for (let i = this.centerX - testNumber; i > this.centerY - this.graphWidth * this.scaledStep; i -= testNumber) {
            let upNumber = ((i - this.centerX) / graduated);
            if (Math.abs(upNumber) >= 1e5 || Math.abs(upNumber) < 0.0001) {
                upNumber = upNumber.toExponential(0);
            } else {
                upNumber = upNumber.toFixed(this.fiexdct);
            }
            p.line(i, this.centerY - this.graphWidth * testNumber, i, this.centerY + this.graphWidth * testNumber);
            p.text(upNumber, i - 10, this.centerY + 12);
        }
        //console.log(this.scaleNum)
        // y축 눈금 그리기
        for (let i = this.centerY + testNumber; i < this.centerY + this.graphHeight * this.scaledStep; i += testNumber) {
            let upNumber = -((i - this.centerY) / graduated);
            if (Math.abs(upNumber) >= 1e5 || Math.abs(upNumber) < 0.0001) {
                upNumber = upNumber.toExponential(0);
            } else {
                upNumber = upNumber.toFixed(this.fiexdct);
            }
            p.line(this.centerX - this.graphHeight * testNumber, i, this.centerX + this.graphHeight * testNumber, i);
            p.text(upNumber, this.centerX - 10, i + 12);
        }

        for (let i = this.centerY - testNumber; i > this.centerY - this.graphHeight * this.scaledStep; i -= testNumber) {
            let upNumber = ((this.centerY - i) / graduated);
            if (Math.abs(upNumber) >= 1e5 || Math.abs(upNumber) < 0.0001) {
                upNumber = upNumber.toExponential(0);
            } else {
                upNumber = upNumber.toFixed(this.fiexdct);
            }
            p.line(this.centerX - this.graphHeight * testNumber, i, this.centerX + this.graphHeight * testNumber, i);
            p.text(upNumber, this.centerX - 10, i + 12);
        }
        //보정 변수
        this.calValues = graduated * 2; // 보정 변수 circle
        this.calValues_version2 = graduated //보정 변수 line 
    }

    // 3차 곡선 그래프
    drawCubicDerivative(p, valueList) {
        const { equation, a, b, c, d, e, color, on, btn, moveX, moveY } = valueList;
        if (on) {
            p.push();
            p.strokeWeight(2);
            p.noFill();
            p.stroke(0, 0, 0, 50);
            p.beginShape();
            for (let x = -this.centerX; x <= this.centerX; x += 1) {
                let y = ((b * Math.pow(x / this.calValues_version2, 3)) + (c * Math.pow(x / this.calValues_version2, 2)) + (d * (x / this.calValues_version2)) + e) / a;
                const graphX = this.centerX + x;
                const graphY = this.centerY - y * this.calValues_version2;
                p.vertex(graphX, graphY);
            }
            p.endShape();

            p.stroke(color); // 선 색상 설정
            p.beginShape();
            for (let x = -this.centerX; x <= this.centerX; x += 1) {
                let y = ((b * Math.pow(x / this.calValues_version2, 3)) + (c * Math.pow(x / this.calValues_version2, 2)) + (d * (x / this.calValues_version2)) + e) / a;
                const graphX = this.centerX + x;
                const graphY = this.centerY - y * this.calValues_version2;
                switch (btn) {
                    case "graphMoveBtn":
                        const xyMoveGraph = this.XYMoveMatrix(graphX, graphY, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                        p.vertex(xyMoveGraph[0][2], xyMoveGraph[1][2]); // 실선인 경우
                        break;
                    case "graphXMoveBtn":
                        const xSymmetryGraph = this.multiplyMatrix(graphX, graphY, 1, -1);
                        p.vertex(xSymmetryGraph[0][0], xSymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                        break;
                    case "graphYMoveBtn":
                        const ySymmetryGraph = this.multiplyMatrix(graphX, graphY, -1, 1);
                        p.vertex(ySymmetryGraph[0][0] + this.centerX * 2, ySymmetryGraph[1][1]); // 실선인 경우
                        break;
                    case "graphXYMoveBtn":
                        const xySymmetryGraph = this.multiplyMatrix(graphX, graphY, -1, -1);
                        p.vertex(xySymmetryGraph[0][0] + this.centerX * 2, xySymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                        break;
                    case "graphOriginalBtn":
                        p.vertex(graphX, graphY);
                        break;
                    default:
                        break;
                }
            }
            p.endShape();
            p.pop();
        }
    }
    //원을 그리는 부본
    // this.drawCircle(p, 100, 100, 50);
    drawCircle(p, valueList) {
        const { equation, a, b, r, color, on, btn, moveX, moveY } = valueList;
        if (on) {
            p.push(); // 현재 상태 저장
            p.strokeWeight(2); // 선 굵기 설정
            p.noFill();
            p.beginShape();
            //console.log(a,b,r)
            // 원의 중심 좌표를 그래프 중심을 기준으로 변환
            const graphCenterX = this.centerX;
            const graphCenterY = this.centerY;
            //console.log(graphCenterX, graphCenterY)
            const graphX = graphCenterX + a * this.calValues_version2;
            const graphY = graphCenterY - b * this.calValues_version2;
            // 원본 그리기
            p.stroke(0, 0, 0, 50);
            p.circle(graphX, graphY, r * this.calValues);
            // 원의 반지름을 그래프 스케일에 맞게 조절
            const scaledRadius = r * this.calValues_version2;
            p.stroke(color); // 선 색상 설정
            for (let angle = 0; angle <= 360; angle++) { // 0부터 360도까지
                let xPos = graphX - scaledRadius * p.cos(p.radians(angle)); // 원 위의 점의 x 좌표 계산
                let yPos = graphY - scaledRadius * p.sin(p.radians(angle)); // 원 위의 점의 y 좌표 계산
                console.log(scaledRadius);
                switch (btn) {
                    case "graphMoveBtn":
                        const moveGraph = this.XYMoveMatrix(xPos, yPos, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                        p.vertex(moveGraph[0][2], moveGraph[1][2]); // 해당 점을 추가하여 원 그리기 
                        console.log(moveGraph[0][2], moveGraph[1][2])
                        break;
                    case "graphXMoveBtn":
                        const xSymmetryGraph = this.multiplyMatrix(xPos, yPos, -1, 1);
                        p.vertex((xSymmetryGraph[0][0] + graphCenterX * 2), xSymmetryGraph[1][1]); // 해당 점을 추가하여 원 그리기
                        //console.log(xSymmetryGraph)
                        break;
                    case "graphYMoveBtn":
                        const ySymmetryGraph = this.multiplyMatrix(xPos, yPos, 1, -1);
                        p.vertex(ySymmetryGraph[0][0], (ySymmetryGraph[1][1] + graphCenterY * 2)); // 해당 점을 추가하여 원 그리기
                        break;
                    case "graphXYMoveBtn":
                        const xySymmetryGraph = this.multiplyMatrix(xPos, yPos, -1, -1);
                        p.vertex((xySymmetryGraph[0][0] + graphCenterX * 2), (xySymmetryGraph[1][1] + graphCenterY * 2)); // 해당 점을 추가하여 원 그리기
                        break;
                    case "graphOriginalBtn":
                        p.vertex(xPos, yPos);
                        break;
                    default:
                        break;
                }
            }
            p.endShape(p.CLOSE); // 도형을 닫음
            p.pop(); // 이전 상태 복원
        }
    }
    //2차방정식을 이용한 포물선 그리는 부분
    // this.drawQuadraticFunction(p, 1, -2, 1); // y = x^2 - 2x + 1
    drawQuadraticFunction(p, valueList) {
        const { equation, a, b, c, d, color, on, btn, moveX, moveY } = valueList;
        if (on) {
            p.push();
            p.strokeWeight(2);
            p.noFill();
            // 원본 그리기
            p.stroke(0, 0, 0, 50);
            p.beginShape();
            for (let x = -this.centerX; x <= this.centerX; x += 1) {
                let y = b * (x / this.calValues_version2) ** 2 + c * (x / this.calValues_version2) + d;
                let twoLaneX = this.centerX + x;
                let twoLaneY = this.centerY - y * this.calValues_version2;
                p.vertex(twoLaneX, twoLaneY);
            }
            p.endShape();

            // 변환된 그래프 그리기
            p.stroke(color); // 선 색상 설정
            p.beginShape();
            for (let x = -this.centerX; x <= this.centerX; x += 1) {
                let y = b * (x / this.calValues_version2) ** 2 + c * (x / this.calValues_version2) + d;
                let twoLaneX = this.centerX + x;
                let twoLaneY = this.centerY - y * this.calValues_version2;
                switch (btn) {
                    case "graphMoveBtn":
                        const xyMoveGraph = this.XYMoveMatrix(twoLaneX, twoLaneY, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                        p.vertex(xyMoveGraph[0][2], xyMoveGraph[1][2]); // 실선인 경우
                        break;
                    case "graphXMoveBtn":
                        const xSymmetryGraph = this.multiplyMatrix(twoLaneX, twoLaneY, 1, -1);
                        p.vertex(xSymmetryGraph[0][0], xSymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                        break;
                    case "graphYMoveBtn":
                        const ySymmetryGraph = this.multiplyMatrix(twoLaneX, twoLaneY, -1, 1);
                        p.vertex(ySymmetryGraph[0][0] + this.centerX * 2, ySymmetryGraph[1][1]); // 실선인 경우
                        break;
                    case "graphXYMoveBtn":
                        const xySymmetryGraph = this.multiplyMatrix(twoLaneX, twoLaneY, -1, -1);
                        p.vertex(xySymmetryGraph[0][0] + this.centerX * 2, xySymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                        break;
                    case "graphOriginalBtn":
                        p.vertex(twoLaneX, twoLaneY);
                        break;
                    default:
                        break;
                }
            }
            p.endShape();
            p.pop();
        }
    }
    //라인 그리는 부분
    drawLinearFunction(p, valueList) {
        const { equation, a, m, b, color, on, btn, moveX, moveY, symmetry } = valueList;
        if (on) {
            p.push(); // 현재 스타일 설정 저장
            p.strokeWeight(2); // 선 굵기 설정
            p.noFill();
            p.translate(this.centerX, this.centerY);

            let bAxis = -b / a * this.calValues_version2; // y절편 계산
            let yAxis = m * this.graphWidth * this.scaledStep;
            let xAxis = a * this.graphWidth * this.scaledStep;

            // 원본 그리기
            p.stroke(0, 0, 0, 50);
            p.line(0, bAxis, -xAxis, yAxis + bAxis);
            p.line(0, bAxis, xAxis, -yAxis + bAxis);

            p.stroke(color); // 선 색상 설정
            switch (btn) {
                case "graphMoveBtn":
                    const xyMoveGraph = this.XYMoveMatrix(-xAxis, bAxis + yAxis, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                    const xyMoveGraph2 = this.XYMoveMatrix(xAxis, bAxis - yAxis, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                    p.line(xyMoveGraph[0][2], xyMoveGraph[1][2], xyMoveGraph2[0][2], xyMoveGraph2[1][2]);
                    break;
                case "graphXMoveBtn":
                    const xSymmetryGraph = this.multiplyMatrix(-xAxis, bAxis + yAxis, 1, -1);
                    const xSymmetryGraph2 = this.multiplyMatrix(xAxis, bAxis - yAxis, 1, -1);
                    p.line(xSymmetryGraph[0][0], xSymmetryGraph[1][1], xSymmetryGraph2[0][0], xSymmetryGraph2[1][1]);
                    break;
                case "graphYMoveBtn":
                    const ySymmetryGraph = this.multiplyMatrix(-xAxis, bAxis + yAxis, -1, 1);
                    const ySymmetryGraph2 = this.multiplyMatrix(xAxis, bAxis - yAxis, -1, 1);
                    p.line(ySymmetryGraph[0][0], ySymmetryGraph[1][1], ySymmetryGraph2[0][0], ySymmetryGraph2[1][1]);
                    break;
                case "graphXYMoveBtn":
                    const xySymmetryGraph = this.multiplyMatrix(-xAxis, bAxis + yAxis, -1, -1);
                    const xySymmetryGraph2 = this.multiplyMatrix(xAxis, bAxis - yAxis, -1, -1);
                    p.line(xySymmetryGraph[0][0], xySymmetryGraph[1][1], xySymmetryGraph2[0][0], xySymmetryGraph2[1][1]);
                    break;
                case "graphOriginalBtn":
                    p.line(0, bAxis, -xAxis, yAxis + bAxis);
                    p.line(0, bAxis, xAxis, -yAxis + bAxis);
                    break;
                default:
                    break;
            }
            p.pop(); // 이전 스타일 설정 복원
        }
    }
    //점 찍는 부분
    drawPoint(p, valueList) {
        const { equation, x, y, color, on, btn, moveX, moveY, symmetry } = valueList;
        if (on) {
            p.push(); // 현재 스타일 및 변환 상태 저장
            p.strokeWeight(7.5);

            let pointX = this.centerX + x * this.calValues_version2;
            let pointY = this.centerY - y * this.calValues_version2;

            // 원본 그리기
            p.stroke(0, 0, 0, 50)
            p.point(pointX, pointY)
            p.stroke(color);

            //값에 따른 이동 하는점
            switch (btn) {
                case "graphMoveBtn":
                    const xyMoveGraph = this.XYMoveMatrix(pointX, pointY, moveX * this.calValues_version2, -moveY * this.calValues_version2);
                    p.point(xyMoveGraph[0][2], xyMoveGraph[1][2]);
                    //console.log(xyMoveGraph[0][2], xyMoveGraph[1][2])
                    break;
                case "graphXMoveBtn":
                    const xSymmetryGraph = this.multiplyMatrix(pointX, pointY, 1, -1);
                    p.point(xSymmetryGraph[0][0], xSymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                    break;
                case "graphYMoveBtn":
                    const ySymmetryGraph = this.multiplyMatrix(pointX, pointY, -1, 1);
                    p.point(ySymmetryGraph[0][0] + this.centerX * 2, ySymmetryGraph[1][1]); // 실선인 경우
                    break;
                case "graphXYMoveBtn":
                    const xySymmetryGraph = this.multiplyMatrix(pointX, pointY, -1, -1);
                    p.point(xySymmetryGraph[0][0] + this.centerX * 2, xySymmetryGraph[1][1] + this.centerY * 2); // 실선인 경우
                    break;
                case "graphOriginalBtn":
                    p.point(pointX, pointY);
                    break;
                default:
                    break;
            }
            p.pop(); // 이전 스타일 및 변환 상태 복원
        }
    }
    //원점 돌아옴과 동시에 재설정 부분
    resetToOrigin(p) {
        this.centerX = this.p.width / 2;
        this.centerY = this.p.height / 2;
        this.scaleFactor = 1.2;
        this.step = 25; // 소수점 자릿수 초기화
        this.scaleNum = 4;
        this.scaleStepIndex = 1;
        this.graduation = [1, 2, 5];
        this.stepArray = [20, 25, 20];
        this.scaledStep = 0;
        this.restartCt = 1;
        this.testArray = 0;
        this.fiexdct = 0;
        this.basicScale = 50;
        this.ct = 1;
        this.p.redraw();
    }
    // 대칭행렬
    multiplyMatrix(graphX, graphY, symmetryX, symmetryY) {
        let graphMatrix = [
            [graphX, 0, 0],
            [0, graphY, 0],
            [0, 0, 1],
        ];
        let symmetryMatrix = [
            [symmetryX, 0, 0],
            [0, symmetryY, 0],
            [0, 0, 1],
        ];
        let result = [
            [],
            [],
            [],
        ];
        for (let i = 0; i < graphMatrix.length; i++) {
            for (let j = 0; j < symmetryMatrix[0].length; j++) {
                let tempValue = 0;
                for (let k = 0; k < graphMatrix[0].length; k++) {
                    tempValue += graphMatrix[i][k] * symmetryMatrix[k][j];
                }
                result[i][j] = tempValue;
            }
        }
        return result;
    }
    // 이동행렬
    XYMoveMatrix(graphX, graphY, moveX, moveY) {
        //console.log(graphX, graphY, moveX, moveY)
        let graphMatrix = [
            [1, 0, graphX],
            [0, 1, graphY],
            [0, 0, 1],
        ];
        let moveMatrix = [
            [1, 0, moveX],
            [0, 1, moveY],
            [0, 0, 1],
        ];
        let result = [
            [],
            [],
            [],
        ];
        for (let i = 0; i < graphMatrix.length; i++) {
            for (let j = 0; j < moveMatrix[0].length; j++) {
                let tempValue = 0;
                for (let k = 0; k < graphMatrix[0].length; k++) {
                    tempValue += graphMatrix[i][k] * moveMatrix[k][j];
                    //console.log(tempValue)
                }
                result[i][j] = tempValue;
            }
        }
        return result;
    }
    zoomOut(p) {
        this.zoomCt = 0;
        this.scaleFactor -= 0.0005;
        this.zoomCt += 1;
    }

    zoomIn(p) {
        this.zoomCt = 0;
        this.scaleFactor += 0.0005;
        this.zoomCt -= 1;
    }
    zoomEvent(p) {
        //console.log(this.zoomCt)
        if (this.scaleFactor < 0.8 || this.scaleFactor > 1.6) {
            //console.log("인제 여기")
            this.scaleFactor = 1.2;
            const isIncrease = this.zoomCt > 0;

            //console.log(this.zoomCt)
            // 스케일 인덱스 업데이트
            if (isIncrease) {
                //console.log('감소')
                this.restartCt = (this.restartCt + 1) % 3; // 0, 1, 2 순환 
                //this.UpandDown /= 10;
            } else {
                //console.log('증가')
                this.restartCt = (this.restartCt + 2) % 3; // 2, 1, 0 역순환
                //this.UpandDown *= 10;
            }

            this.scaleStepIndex = this.restartCt; // 스케일 인덱스 계산
            // 인덱스 번호가 1번에 도착했을때 기본값으로 복원
            if (this.scaleStepIndex === 1) {
                this.ct = 1;
            } else {
                this.ct += 1
            }
            //드래그 2번이상 감지후 값을 재계산
            if (this.ct > 2) {
                if (this.scaleStepIndex === 2 || this.scaleStepIndex === 0) {
                    if (isIncrease) {
                        this.graduation = this.graduation.map(value => value / 10);
                        if (this.fiexdct > 0) {
                            this.fiexdct -= 1;
                        }
                    } else {
                        this.graduation = this.graduation.map(value => value * 10);
                        if (this.graduation[0] > 5) {
                            this.fiexdct += 1;
                        }
                    }
                }
            }
            //console.log(this.scaleStepIndex)
            // console.log(graduation)
            this.testArray = this.graduation[this.scaleStepIndex];
            this.step = this.stepArray[this.scaleStepIndex];
            this.basicScale = this.step * this.testArray;
            //p.redraw(); // 초기 위치로 그리기
        }
    }
}
const graph = new Graph('graphContainer', 25);
graph.createGraph();