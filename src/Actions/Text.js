export default {
    ADDCAHR: async function(action){
        let store = this.global.Store;
        let { caret, lines } = store.state;
        let node = lines[caret.y].nodes[caret.block];
        let x = caret.x;

        console.log('addchar', action.c);
        
        node.text = node.text.slice(0, x) + action.c + node.text.slice(x);
        caret.x++;

        store.setText();
    },
    
    ADDLINE: async function(action){
        let store = this.global.Store;
        let { caret, lines } = store.state;
        let {x, y, block} = caret;
        let cnode = lines[y].nodes[block];
        
        let ntext = cnode.text.slice(x);
        cnode.text = cnode.text.slice(0, x);
        
        let nblocks = [{text: ntext, style: {}}].concat(lines[y].nodes.splice(block+1));
        let newLine = {id: ++store.state.currentId, nodes: nblocks};
        lines.splice(y+1, 0, newLine);
        
        console.log(lines);   

        store.setLine();
        
        caret.x = 0;
        caret.y = y+1;
        caret.block = 0;    
        store.addLine();
    }

};
