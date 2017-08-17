export default {
    SET_RANGE: async function(action){
        let store = this.global.Store;
        let { range, caret } = store.state;
        
        delete action.type;
        console.log(action);
        store.state.range = Object.assign({}, action);
        
        caret.x = store.state.range.sx;
        caret.y = store.state.range.sy;
        caret.block = store.state.range.sb;
        store.setCaret();
        
        store.state.range.isCollapsed = false;
    },
    RANGE_ADDCHAR: async function(action){
        this.dispatch({type: 'RANGE_BACKSPACE'});
        this.dispatch({type: 'ADDCAHR', c: action.c});
        this.global.Store.state.range.isCollapsed = true;
    },
    RANGE_BACKSPACE: async function(action){
        let store = this.global.Store;
        let { range, lines, caret } = store.state;
        let sNode = lines[range.sy].nodes[range.sb];
        let eNode = lines[range.ey].nodes[range.eb]; 

        if(range.sy == range.ey && range.sb == range.eb){
            sNode.text = sNode.text.slice(0, range.sx) + sNode.text.slice(range.ex);
            range.isCollapsed = true;
            store.setText();
        } else {
            sNode.text = sNode.text.slice(0, range.sx);
            eNode.text = eNode.text.slice(range.ex);
            
            //if(check if same style)
            sNode.text = sNode.text + eNode.text;
            
            lines[range.sy].nodes.splice(range.sb+1);
            lines[range.ey].nodes.splice(range.eb+1);
            lines.splice(range.sy+1, range.ey-range.sy);
            
            
            console.log(lines);
            
            store.rangeBackspace(range.sy, range.ey);
            
            caret.x = range.sx;
            caret.y = range.sy;
            caret.block = range.sb;
            store.setCaret();
        }
        
    }
};
