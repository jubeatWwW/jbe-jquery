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
    },
    BACKSPACE: async function(action){
        let store = this.global.Store;
        let { caret, lines } = store.state;
        let {x, y, block} = caret;
        
        if(0 == x && 0 == y && 0 == block){
            return;
        }

        let node = lines[y].nodes[block];
        let nodeCnt = lines[y].nodes.length;
        let t = node.text.length;

        if(0 == x){
            if(0 == block){
                //move remain text to last line and delete this line
                
                let preLine = lines[y-1];
                let curLine = lines[y];
                let preNode = preLine.nodes[preLine.nodes.length-1];
                let curNode = curLine.nodes[0];
                caret.x = preNode.text.length;
                caret.block = preLine.nodes.length-1;
                caret.y--;

                //if(check if same style)
                preNode.text = preNode.text + curNode.text;
                if(curLine.nodes.length > 1){
                    curLine.nodes.splice(0, 1);
                    preLine.nodes = preLine.nodes.concat(curLine.nodes);
                }

                console.log(lines);
                store.setLine();
                
                lines.splice(y, 1);
                store.deleteLine(y);
            } else {
                //remove 1 char from last block
                lines[y].nodes[block-1].text = lines[y].nodes[block-1].text.slice(0, -1);
                store.setLine();
            }
        } else {
            if(1 == x && 1 == t){
                if(0 == block){
                    //empty this block
                    node.text = '';
                    store.setText();
                    caret.x = 0;
                } else {
                    //remove this block
                    lines[y].nodes.splice(block, 1);
                    store.setLine();
                    caret.x = lines[y].nodes[block-1].text.length;
                }
            } else {
                //remove 1 char
                node.text = node.text.slice(0, x-1) + node.text.slice(x);
                store.setText();
                caret.x--;
            }
        }

        store.setCaret();

        console.log(lines);
    }


};
