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
        
        console.log(lines);
        lines[y].spans[block].setText(this.state.lines[y].nodes[block].text);
        caret.setCaret(x, y, block);
    }

    setLine(){
        let lines = this.global.Editor.lines;
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        
        lines[y].setText(this.state.lines[y].nodes);
    }

    addLine(anchor){
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;
        console.log(x,y,block);
        this.global.Editor.AddLine(y-1, this.state.lines[y]);
        caret.setCaret(x, y, block);
    }

    setCaret(){
        let caret = this.global.Caret;
        let {x, y, block} = this.state.caret;

        caret.setCaret(x, y, block);
    }
}
