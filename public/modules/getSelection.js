class GetSelection {
    constructor(id, targetDOM) {
        this.id = id;
        this.targetDOM = document.querySelector(`#${targetDOM}`);
    }
    get _targetDOM(){
        return this.targetDOM;
    }
    // 현재 텍스트 오프셋 정보
    cursorPosition() {
        // 현재 선택된 텍스트 영역
        const selection = window.getSelection();
        // 첫번째 range 가져오기
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range || range.commonAncestorContainer.parentNode !== this.targetDOM) return null;
        return {
            startOffset: range.startOffset,
            endOffset: range.endOffset
        };
    }

    // set 커서 위치
    setCursorPosition(position) {
        if (!this.targetDOM) {
            console.error(`${this.targetDOM} is not defined.`);
            return;
        }
        // targetDOM의 의 모든 자식노드를 배열로 변환
        const nodes = this.targetDOM.childNodes ? Array.from(this.targetDOM.childNodes) : [];
        let charCount = 0; // 문자수 카운트
        let newNode = null; // 새로운 커서 위치
        let newOffset = 0; // 새로운 커서 오프셋
        // 커서 위치 계산
        for (const node of nodes) {
            // 자식노드 텍스트 길이
            const nodeLength = node.textContent.length;
            // 현재 위치(매개변수로 받은)가 커서 포함인지 확인
            if (charCount + nodeLength >= position) {
                newNode = node; // 커서 위치 포함 노드
                newOffset = position - charCount; // 현재 커서 위치 오프셋
                break;
            }
            // 문자 누적 카운트 + 현재 위치를 통해 커서 위치 추적
            charCount += nodeLength;
        }

        // 커서 위치 재설정
        if (newNode) {
            const newRange = document.createRange();
            const selection = window.getSelection();
            newRange.setStart(newNode, newOffset);
            newRange.setEnd(newNode, newOffset);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }
}