import Actions from './Actions/index';

class Line{
    constructor(global, anchor, id, blocks){
        this.global = global;
        this.anchor = anchor;
        this.lid = id;
        this.DOM = $('<div></div>')[0];
        this.fake = $('<span></span>')[0];
        this.spans = [];
        this.currSpan = 0;
        this.render(blocks);
    }

    get prefix(){
        return `${this.global.Editor.prefix}line-${this.lid}`;
    }

    get idprefix(){
        return `${this.global.Editor.idprefix}line-${this.lid}`;
    }

    get classprefix(){
        return `${this.global.Editor.classprefix}line-${this.lid}`;
    }

    setText(blocks){
        if(blocks.length == this.spans.length){
            for(let i in blocks){
                this.spans[i].setText(blocks[i].text);
            }
        } else if(blocks.length < this.spans.length){
            for(let i in spans){
                if(parseInt(i) < blocks.length)
                    this.spans[i].setText(blocks[i].text);
                else
                    $(this.spans[i].DOM).remove();
            }
        } else {
            for(let i in blocks){
                if(parseInt(i) < spans.length)
                    this.spans[i].setText(blocks[i].text);
                else
                    this.spans.push(new Span(
                                editor, 
                                $(this.spans[this.spans.length-1].DOM),
                                blocks[i]
                    ));
            }
            
        }
    }

    get text(){
        let str = '';
        for(let s of this.spans){
            str += spans.text;
        }
        return str;
    }

    get textLength(){
        let len = 0;
        for(let s of this.spans){
            str += spans.text.length;
        }
        return len;
    }

    render(blocks){
        $(this.fake).addClass(this.global.Editor.prefix + 'fake');
        $(this.DOM).attr('id', this.prefix)
            .append($(this.fake))
            .addClass('jbe-line');
        this.anchor.after($(this.DOM));

        for(let i in blocks){
            if(0 == parseInt(i))
                this.spans.push(new Span(editor, $(this.fake), blocks[i]));
            else 
                this.spans.push(new Span(
                            editor, 
                            $(this.spans[this.spans.length-1].DOM),
                            blocks[i]
                ));
        }
    }

}

class Span{
    constructor(global, anchor, block){
        this.global = global;
        this.anchor = anchor;
        this.text = block.text;
        this.DOM = $('<span>'+block.text+'</span>')[0];
        this.render();
    }

    render(){
        this.anchor.after($(this.DOM));
    }

    setText(text){
        this.text = text;
        $(this.DOM).text(text);
    }
}

export {Line, Span};
