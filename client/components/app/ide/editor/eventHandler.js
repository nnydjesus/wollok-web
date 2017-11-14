import ace from 'brace'
import astFinder from '../model/astFinder.js'
import astDescription from '../model/astDescription.js'

const event = ace.acequire("ace/lib/event");
const Range = ace.acequire("ace/range").Range;
const EventEmitter = ace.acequire("ace/lib/event_emitter").EventEmitter;
const oop =  ace.acequire("ace/lib/oop");


export default class EditorHandler {

    constructor(editor){
        oop.implement(this, EventEmitter);
        this.editor = editor;
        this.token = {};
        this.range = new Range();

        event.addListener(editor.renderer.scroller, "mousemove", this.onMouseMove);
        event.addListener(editor.renderer.content, "mouseout", this.onMouseOut);
        event.addListener(editor.renderer.content, "click", this.onClick);
    }

    updateAst(ast){
        this.ast = ast
        var variables = astFinder(this.ast, "VariableDeclaration").concat(astFinder(this.ast, "Field")).map(variable => {
            return {reference:variable, location:variable.variable.location, references: astFinder(variable.root(), "Reference", reference=> 
                escape(reference.name) == escape(variable.variable.name.token) && variable.variable.location != reference.location)}
        })

        var parameters = astFinder(this.ast, "Parameter").map(param => {
            return {reference:param, location:param.location, references: astFinder(param.parent, "Reference", reference=> 
                escape(reference.name) == escape(param.name) && param.location != reference.location)}
        })

        var methods = astFinder(this.ast, "Method").map(method => {
            return {reference:method, location:method.name.location, references: astFinder(method.root(), "Send", send=> escape(send.key) == escape(method.name) ).map(send=> send.key.type? send.key: send)}
        })

        this.astContext = variables.concat(parameters).concat(methods)

        this.referenceInfo = 
            astFinder(this.ast, "Class").map(c => { return {node:c, location:c.name.location} } )
            .concat(astFinder(this.ast, "Method").map(c => { return {node:c, location:c.name.location} } ))
            .concat(astFinder(this.ast, "Field").map(f => { return {node:f, location:f.variable.location} } ))
            .concat(astFinder(this.ast, "Parameter").map(p => { return {node:p, location:p.location} } ))
            .concat(astFinder(this.ast, "VariableDeclaration").map(v => { return {node:v, location:v.variable.location} } ))
    }

    update = (screenPos, docPos)=> {
        this.$timer = null;
        var editor = this.editor;
        var renderer = editor.renderer;

        var session = editor.session;
        
        if(this.astContext){
            this.astContext.forEach(context =>{
                context.references.forEach(reference =>{
                    var location = reference.location
                    if(docPos.row == (location.start.line-1)){
                        if(docPos.column >= (location.start.column-1) && docPos.column <= (location.end.column-1)){
                            this.reference = context
                            this.isOpen = true
                            editor.renderer.setCursorStyle("pointer");
                            
                            session.removeMarker(this.marker);
                            
                            this.range =  new Range(location.start.line-1, location.start.column-1, location.end.line-1, location.end.column-1);
                            this.marker = session.addMarker(this.range, "ace_link_marker", "text", true);
                            this.updateTooltip(screenPos, astDescription(context.reference))
                            return 
                        }
                    }
                })

                
            })
        }else{
            return this.clearReference();
        }
    }

    updateTooltip(screenPos, text){
        //example with container creation via JS
        var div = document.getElementById('tooltip_0');
        if(div === null){
            div = document.createElement('div');		
            div.setAttribute('id', 'tooltip_0'); 
            div.setAttribute('class', 'seecoderun_tooltip'); // and make sure myclass has some styles in css
            document.body.appendChild(div);
        }

        if(!text){
            div.style.display = "none";
            div.innerText = "";
            return 
        }	

        var wordRange = this.editor.getSession().getWordRange(screenPos.row , screenPos.column);
        var pixelPosition = this.editor.renderer.textToScreenCoordinates(screenPos);
        pixelPosition.pageY += this.editor.renderer.lineHeight;
    
        div.style.left = pixelPosition.pageX + 'px';
        div.style.top = pixelPosition.pageY + 'px';
        div.style.display = "block";
        div.innerText = text;
    }

    clear = ()=>  {
        this.clearReference()
        this.clearTooltip()
    }

    clearReference = ()=>  {
        if (this.marker) {
            this.editor.session.removeMarker(this.marker);
            this.editor.renderer.setCursorStyle("");
            this.isOpen = false;
            this.marker = undefined
            this.reference = undefined
        }
    }

    clearTooltip = ()=>  {
        this.updateTooltip({});
    }

    getMatchAround = (regExp, string, col) => {
        var match;
        regExp.lastIndex = 0;
        string.replace(regExp, function(str) {
            var offset = arguments[arguments.length-2];
            var length = str.length;
            if (offset <= col && offset + length >= col)
                match = {
                    start: offset,
                    value: str
                };
        });
    
        return match;
    }

    onClick = ()=> {
        if (this.reference) {
            console.log(this.reference)
            this.editor.gotoLine(this.reference.location.start.line, this.reference.location.start.column-1, true);
            this.clear()
        }
    }


    handleTooltip(e, screenPos, docPos){
        var reference = this.referenceInfo.find(reference =>{
            var location = reference.location
            if(docPos.row == (location.start.line-1)){
                return docPos.column >= (location.start.column-1) && docPos.column <= (location.end.column-1)
            }
            return false

        })
        if(reference){
            this.updateTooltip(screenPos, astDescription(reference.node));

        }else{
            // this.clearTooltip({})
        }
    }

    handleLinkNodes(e, screenPos, docPos){
        if (this.editor.$mouseHandler.isMousePressed) {
            if (!this.editor.selection.isEmpty())
                this.clear();
            return;
        }

       if (e.ctrlKey || e.metaKey) {
            this.update(screenPos, docPos);
       } else{
            this.clear();
       }
    }

    onMouseMove = (e) => {
        if(!this.ast) return this.clear
        this.x = e.clientX;
        this.y = e.clientY;

        var editor = this.editor;
        var renderer = editor.renderer;
        var canvasPos = renderer.scroller.getBoundingClientRect();
        var offset = (this.x + renderer.scrollLeft - canvasPos.left - renderer.$padding) / renderer.characterWidth;
        var row = Math.floor((this.y + renderer.scrollTop - canvasPos.top) / renderer.lineHeight);
        var col = Math.round(offset);

        var screenPos = {row: row, column: col, side: offset - col > 0 ? 1 : -1};
        var docPos = editor.session.screenToDocumentPosition(screenPos.row, screenPos.column);

        var selectionRange = editor.selection.getRange();
        if (!selectionRange.isEmpty()) {
            if (selectionRange.start.row <= screenPos.row && selectionRange.end.row >= screenPos.row)
                return this.clear();
        }
        
        var line = editor.session.getLine(docPos.row);
        if (docPos.column == line.length) {
            var clippedPos = editor.session.documentToScreenPosition(docPos.row, docPos.column);
            if (clippedPos.column != screenPos.column) {
                return this.clear();
            }
        }

        this.handleLinkNodes(e, screenPos, docPos)
        this.handleTooltip(e, screenPos, docPos)
    }

    onMouseOut = (e) =>{
        this.clear();
    }

    destroy = ()=> {
        this.onMouseOut();
        event.removeListener(this.editor.renderer.scroller, "mousemove", this.onMouseMove);
        event.removeListener(this.editor.renderer.content, "mouseout", this.onMouseOut);
    }



}