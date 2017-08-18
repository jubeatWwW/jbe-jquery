export default class Store{
    constructor(global, defaultState={}){
        this.state = defaultState;
        this.global = global;
        this.global.Store = this;
    }

    setText(){
        let lines = this.global.Editor.lines;
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        
        lines[y].spans[block].setText(this.state.lines[y].nodes[block].text);
        caret.setCaret(x, y, block);
    }

    setLine(){
        let lines = this.global.Editor.lines;
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        
        console.log('set line y ', y);
        lines[y].setText(this.state.lines[y].nodes);
    }

    addLine(anchor){
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        this.global.Editor.AddLine(y-1, this.state.lines[y]);
        caret.setCaret(x, y, block);
    }

    setCaret(){
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        
        caret.setCaret(x, y, block);
    }

    setRange(){

    }

    deleteLine(n){
        this.global.Editor.DeleteLine(n, n);
    }

    rangeBackspace(s, e){
        let lines = this.global.Editor.lines;
        lines[s].setText(this.state.lines[s].nodes);
        this.global.Editor.DeleteLine(s+1, e);
    }
}
