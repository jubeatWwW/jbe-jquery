export default {
    MVCARET_UP: async function(action){
        let {Store: store, Editor: editor, vc } = this.global;
        let { caret, lines } = store.state;
        let {x, y, block} = caret;
        
        if(0 == y){
            caret.x = 0;
            caret.block = 0;
        } else {
            let cline = lines[y];
            let pline = lines[y-1];
            let cnode = cline.nodes[block];
            
            let cstr = '';
            for(let i=0; i<block; i++){
                cstr += cline.nodes[i].text;
            }
            cstr += cnode.text.slice(0, x);
            let clen = vc.measure(cstr, action.cfont);
            
            let pstr = '';
            let pblock = -1;
            for(let i in pline.nodes){
                pstr += pline.nodes[i].text;
                let plen = vc.measure(pstr, action.pfont);
                if(plen > clen){
                    pblock = parseInt(i);
                    break;
                }
            }

            if(-1 == pblock){
                caret.block = pline.nodes.length - 1;
                caret.x = pline.nodes[caret.block].text.length;
                caret.y = y-1;
            } else {
                let blocklen = pline.nodes[pblock].text.length;
                let min = editor.DOM.offsetWidth;
                for(let i=0; i<=blocklen; i++){
                    let comp = vc.measure(pstr.slice(0, pstr.length-i), action.pfont);
                    if(Math.abs(comp - clen) < min){
                        min = Math.abs(comp-clen);
                    } else {
                        caret.x = blocklen - i + 1;
                        break;
                    }
                }
                caret.y = y-1;
                caret.block = pblock;
            }
        }
        this.dispatch({type: 'RANGE_UNSET'});
        store.setCaret();
    },
    MVCARET_DOWN: async function(action){
        let { Store: store, Editor: editor, vc } = this.global;
        let { caret, lines } = store.state;
        let { x, y, block } = caret;
        
        if(lines.length-1 == y){
            caret.block = lines[y].nodes.length-1;
            caret.x = lines[y].nodes[caret.block].text.length;
        } else {
            let cline = lines[y];
            let nline = lines[y+1];
            let cnode = cline.nodes[block];
            
            let cstr = '';
            for(let i=0; i<block; i++){
                cstr += cline.nodes[i].text;
            }
            cstr += cnode.text.slice(0, x);
            let clen = vc.measure(cstr, action.cfont);
            
            let nstr = '';
            let nblock = -1;
            for(let i in nline.nodes){
                nstr += nline.nodes[i].text;
                let nlen = vc.measure(nstr, action.nfont);
                if(nlen > clen){
                    nblock = parseInt(i);
                    break;
                }
            }

            if(-1 == nblock){
                caret.block = nline.nodes.length - 1;
                caret.x = nline.nodes[caret.block].text.length;
                caret.y = y+1;
            } else {
                let blocklen = nline.nodes[nblock].text.length;
                let min = editor.DOM.offsetWidth;
                for(let i=0; i<=blocklen; i++){
                    let comp = vc.measure(nstr.slice(0, nstr.length-i), action.pfont);
                    if(Math.abs(comp - clen) < min){
                        min = Math.abs(comp-clen);
                    } else {
                        caret.x = blocklen - i + 1;
                        break;
                    }
                }
                caret.y = y+1;
                caret.block = nblock;
            }
        }
        this.dispatch({type: 'RANGE_UNSET'});
        store.setCaret();
    },
    MVCARET_LEFT: async function(action){
        let { Store: store, Editor: editor, vc } = this.global;
        let { caret, lines } = store.state;
        let { x, y, block } = caret;
        
        if(0 != x){
            caret.x--;
        } else{
            if(0 == y){
                return;
            }

            if(0 == block){
                caret.y--;
                caret.block = lines[caret.y].nodes.length - 1;
                caret.x = lines[caret.y].nodes[caret.block].text.length;
            } else {
                caret.block--;
                caret.x = lines[y].nodes[caret.block].text.length - 1;
            }
        }
        

        this.dispatch({type: 'RANGE_UNSET'});
        store.setCaret();
    },
    MVCARET_RIGHT: async function(action){
        let { Store: store, Editor: editor, vc } = this.global;
        let { caret, lines } = store.state;
        let { x, y, block } = caret;

        if(lines[y].nodes[block].text.length != x){
            caret.x++;
        } else{
            if(lines.length-1 == y){
                return;
            }

            if(lines[y].nodes.length-1 == block){
                caret.y++;
                caret.block = 0;
                caret.x = 0;
            } else {
                caret.block++;
                caret.x = 1;
            }
        }
        this.dispatch({type: 'RANGE_UNSET'});
        store.setCaret();
    },
    MVCARET_POS: async function(action){
        let caret = this.global.Store.state.caret;
        caret.x = action.x;
        caret.y = action.y;
        caret.block = action.block;
        this.dispatch({type: 'RANGE_UNSET'});
        this.global.Store.setCaret();
    }
    
};
