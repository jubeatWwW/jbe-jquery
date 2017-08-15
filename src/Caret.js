export default class Caret{
    constructor(global, anchor){
        this.global = global;
        this.global.Caret = this;
        this.anchor = anchor;
        this.DOM = $('<div></div>')[0];

        this.x = 0;
        this.y = 0;
        this.cx = 0;
        this.cy = 0;
        this.block = 0;
        this.render();
        this.bind();
    }

    render(){
        $(this.DOM).attr('id', this.global.Editor.prefix+'caret')
            .attr('contenteditable', 'true')
            .addClass('caret');
        this.anchor.append($(this.DOM));
    }

    bind(){
        $(this.DOM).on('keydown', this.keydownHandler.bind(this));
        
    }
    
    setCaret(x, y, block){
        this.x = x;
        this.y = y;
        this.block = block;

        let vc = this.global.vc;
        let s = this.global.Editor.lines[y].DOM;
        let style = window.getComputedStyle(s, null);
        
        let len = vc.measure(
            s.textContent.slice(0, x), 
            `${style.fontSize} ${style.fontFamily}`
        );

        $(this.DOM).css({
            left: len,
            top: s.offsetTop
        });

        $(this.DOM).focus();
    }

    keydownHandler(e){
        console.log('keydown', e.key);
        if(e.key.length == 1)
            this.global.Actions.dispatch({
                type: 'ADDCAHR',
                c: e.key
            });
        else {
            if('Enter' == e.key){
                this.global.Actions.dispatch({
                    type: 'ADDLINE'
                });
            } else if('ArrowUp' == e.key){
                if(0 === this.y){
                    this.global.Actions.dispatch({
                        type: 'MVCARET_UP',
                    });
                } else {
                    let pn, cn, ps, cs;
                    
                    cn = this.global.Editor.lines[this.y].DOM;
                    cs = window.getComputedStyle(cn, null);
                    pn = this.global.Editor.lines[this.y-1].DOM;
                    ps = window.getComputedStyle(pn, null);
                    this.global.Actions.dispatch({
                        type: 'MVCARET_UP',
                        pfont: `${ps.fontSize} ${ps.fontFamily}`,
                        cfont: `${cs.fontSize} ${cs.fontFamily}`
                    });
                }
            } else if('ArrowDown' == e.key){
                if(this.global.Store.state.lines.length-1 === this.y){
                    this.global.Actions.dispatch({
                        type: 'MVCARET_DOWN',
                    });
                } else {
                    let nn, cn, ns, cs;
                    
                    cn = this.global.Editor.lines[this.y].DOM;
                    cs = window.getComputedStyle(cn, null);
                    nn = this.global.Editor.lines[this.y+1].DOM;
                    ns = window.getComputedStyle(nn, null);
                    this.global.Actions.dispatch({
                        type: 'MVCARET_DOWN',
                        nfont: `${ns.fontSize} ${ns.fontFamily}`,
                        cfont: `${cs.fontSize} ${cs.fontFamily}`
                    });
                }
            } else if('ArrowLeft' == e.key){
                this.global.Actions.dispatch({
                    type: 'MVCARET_LEFT',
                });
            } else if('ArrowRight' == e.key){
                this.global.Actions.dispatch({
                    type: 'MVCARET_RIGHT',
                });
            }
 
        }
        return false;
    }
}

