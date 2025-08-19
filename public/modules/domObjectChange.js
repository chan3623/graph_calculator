// DomObject (CSS, Attribute, innerHTML) 변경에 대한 클래스 및 함수
class DomObjectChange{
    constructor(id){
        this._domObject = document.querySelector(id);
    }

    get dom(){
        return this._domObject;
    }
    style(cssName, cssValue){
        this._domObject.style[cssName] = cssValue;
    }
    attribute(attributeName, attributeValue){
        this._domObject[attributeName] = attributeValue;
    }
    elements(element){
        return this._domObject[element];
    }
}

const $ = (id) => {
    return new DomObjectChange(id);
}