(function( $ ){
    let id = 0;

    $.fn.jbe = function() {
        console.log("jbe init");
        let editor = new JBE(this, id++, {init: true});

        return this;       
    }; 

    $.fn.getId = function(){
        console.log('editor id: ',id);
        return this;
    }
})( jQuery );

$(document).ready(function(){
    $('#editor').jbe().getId();
});

import css from './css/index.css';
import {Line, Span} from './Text';
import Caret from './Caret'
import Actions from './Actions/index';
import Store from './Store/index';
import defaultState from './Store/defaultState';

class JBE{
    constructor(anchor, id, opt={}){
        this.eid = id;
        this.global = {Editor: this};
        this.anchor = anchor;
        this.DOM = $('<div></div>')[0];
        this.lines = [];
        this.action = new Actions(this.global);
        this.store = new Store(this.global, defaultState);
        this.vc = new VirtualCanvas(this.global);

        this.render();
        this.bind();

        if(opt.init){
            console.log('init line');
            this.lines.push(new Line(
                this.global, 
                $(this.caret.DOM), 
                0, 
                this.store.state.lines[0].nodes
            ));
        }
    }

    get prefix(){
        return `jbe-editor-${this.eid}-`;
    }

    get idprefix(){
        return `#jbe-editor-${this.eid}-`;
    }

    get classprefix(){
        return `.jbe-editor-${this.eid}-`;
    }

    render(){
        this.caret = new Caret(this.global, $(this.DOM));
        $(this.DOM).addClass('jbe-editor');
        this.anchor.append($(this.DOM));
        console.log(this.global);
    }

    bind(){
        $(this.DOM).on('mouseup', this.mouseupHandler.bind(this));
    }

    mouseupHandler(e){
        let sel = window.getSelection();

        let node = sel.focusNode;
        while('SPAN' != node.nodeName){
            node = node.parentNode;
        }
        let lnode = node.parentNode;

        let spanCnt = 0, lineCnt = 0;

        while(! $(node).hasClass(`${this.prefix}fake`) ){
            node = $(node).prev();
            spanCnt++;
        }
        while(! $(lnode).hasClass(`caret`) ){
            lnode = $(lnode).prev();
            lineCnt++;
        }

        this.global.Actions.dispatch({
            type: 'MVCARET_POS',
            x: sel.focusOffset,
            y: lineCnt-1,
            block: spanCnt-1
        });

    }

    AddLine(anchor, line){
        this.lines.splice(anchor+1, 0,
            new Line(
                this.global, 
                $(this.lines[anchor].DOM), 
                line.id,
                line.nodes)
        );
    }
}

class VirtualCanvas{
    constructor(global){
        this.c = document.createElement('canvas');
        global.vc = this;
    }

    measure(text, font){
        let ctx = this.c.getContext("2d");
        ctx.font = font;
        return ctx.measureText(text).width;       
    }
}


