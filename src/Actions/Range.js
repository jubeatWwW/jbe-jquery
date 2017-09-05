export default {
    RANGE_SELECT: async function(action){
        let store = this.global.Store;
        let { range, caret } = store.state;
        
        delete action.type;
        let { sfont, efont } = action;
        delete action.sfont;
        delete action.efont;
        
        store.state.range = Object.assign({}, action);
        
        caret.x = store.state.range.sx;
        caret.y = store.state.range.sy;
        caret.block = store.state.range.sb;
        store.setCaret();
        
        this.dispatch({type: 'RANGE_SET', sfont, efont});
    },
    RANGE_ADDCHAR: async function(action){
        this.dispatch({type: 'RANGE_BACKSPACE'});
        this.dispatch({type: 'ADDCAHR', c: action.c});
        this.dispatch({type: 'RANGE_UNSET'});
    },
    RANGE_BACKSPACE: async function(action){
        let store = this.global.Store;
        let { range, lines, caret } = store.state;
        let sNode = lines[range.sy].nodes[range.sb];
        let eNode = lines[range.ey].nodes[range.eb]; 

        if(range.sy == range.ey && range.sb == range.eb){
            sNode.text = sNode.text.slice(0, range.sx) + sNode.text.slice(range.ex);
            store.setText();
        } else {
            sNode.text = sNode.text.slice(0, range.sx);
            eNode.text = eNode.text.slice(range.ex);
            
            //if(check if same style)
            sNode.text = sNode.text + eNode.text;
            
            lines[range.sy].nodes.splice(range.sb+1);
            lines[range.ey].nodes.splice(range.eb+1);
            lines.splice(range.sy+1, range.ey-range.sy);
            
            store.rangeBackspace(range.sy, range.ey);
            
            caret.x = range.sx;
            caret.y = range.sy;
            caret.block = range.sb;
            store.setCaret();
        }
        
        this.dispatch({type: 'RANGE_UNSET'});
        
    },
    RANGE_SET: async function(action){
        let { vc } = this.global;
        let { range, lines } = this.global.Store.state;
        let { sfont, efont } = action;

        this.global.Store.state.range.isCollapsed = false;
    },
    RANGE_UNSET: async function(action){
        this.global.Store.state.range.isCollapsed = true;
    },
};
