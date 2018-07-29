import ace from 'brace'
import 'brace/mode/text'

const oop =  ace.acequire("ace/lib/oop")
// const DocCommentHighlightRules =  ace.acequire("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules

const keywords = (
    "test|describe|package|inherits|false|import|else|or|class|and|not|native|override|program|self|try|const|var|const|catch|object|super|throw|if|null|return|true|new|constructor|method|mixin"
);

const buildinConstants = ("null|assert|console");

const langClasses = (
    "Object|Pair|String|Boolean|Number|Integer|Double|Collection|Set|List|Exception|Range" +
    "|StackTraceElement"
);

class WollokHighlightRules extends ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules {
	constructor(){
		super();
        this.configure()
    }

    extraKeywordsFromAst(ast){
        this.ast = ast
    }

    fields(ast){
        if(!ast) return []

        var fields = _.flatMap(ast.content, c => {
            return c.members? c.members.filter(f=> f.type== "Field").map(it=> it.variable.name.token+" ") : []
        })

        return fields
    }

    updateAst(ast) {    
        var variables = this.fields(ast).join("|") 
        if(this.variables != variables){
            this.variables = variables
            this.variableInstance.onMatch =   this.createKeywordMapper({
                "variable.language": "self",
                "keyword": keywords,
                "constant.language": buildinConstants,
                "support.function": langClasses,
                "variable.instance" : this.variables
            }, "identifier")
        }
    }

    createKeywordMapper(map, defaultToken, ignoreCase, splitChar) {
        var keywords = Object.create(null);
        Object.keys(map).forEach(function(className) {
            var a = map[className];
            if (ignoreCase)
                a = a.toLowerCase();
            var list = a.split(splitChar || "|");
            for (var i = list.length; i--; ){
                keywords[list[i]] = className;
                keywords[list[i]+" "] = className;
            }
                
        });
        console.log(keywords)
        // in old versions of opera keywords["__proto__"] sets prototype
        // even on objects with __proto__=null
        if (Object.getPrototypeOf(keywords)) {
            keywords.__proto__ = null;
        }
        this.$keywordList = Object.keys(keywords);
        map = null;
        return ignoreCase
            ? function(value) {return keywords[value.toLowerCase()] || defaultToken; }
            : function(value) {return keywords[value] || defaultToken; };
    }
    
    configure(){
        this.variableInstance = {
            regex : /[a-zA-Z_$][a-zA-Z0-9_$]*(\s)?/,
        }
        this.updateAst()
    
        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "\\/\\/.*$"
                },
                {
                    token : "comment.doc", // doc comment
                    regex : "\\/\\*(?=\\*)",
                    next  : "doc-start"
                },
                {
                    token : "comment.doc", // closing comment
                    regex : "\\*\\/",
                    next  : "start"
                },
                {
                    token : "comment", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
                }, {
                    token : "string", // single line
                    regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token : "string", // single line
                    regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                }, {
                    token : "constant.numeric", // hex
                    regex : /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/
                }, {
                    token : "constant.numeric", // float
                    regex : /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/
                }, {
                    token : "constant.language.boolean",
                    regex : "(?:true|false)\\b"
                }, 

                this.variableInstance,

                
                // {token : "variable.parameter", regex : "\(([a-zA-Z_ ],?)+\)\s\{"},
                {
                    token : "keyword.operator",
                    regex : "===|&&|\\*=|\\.\\.|\\*\\*|#|!|%|\\*|\\?:|\\+|\\/|,|\\+=|\\-|\\.\\.<|!==|:|\\/=|\\?\\.|\\+\\+|>|=|<|>=|=>|==|\\]|\\[|\\-=|\\->|\\||\\-\\-|<>|!=|%=|\\|"
                }, {
                    token : "lparen",
                    regex : "[[({]"
                }, {
                    token : "rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment", // closing comment
                    regex : ".*?\\*\\/",
                    next : "start"
                }, {
                    token : "comment", // comment spanning whole line
                    regex : ".+"
                }
            ]
        };
    
        // this.embedRules(DocCommentHighlightRules, "doc-",
        //     [ DocCommentHighlightRules.getEndRule("start") ]);
    }
}
    
export default class CustomSqlMode extends ace.acequire('ace/mode/text').Mode {
	constructor(){
		super();
		this.HighlightRules = WollokHighlightRules
    }
    
    updateAst(ast){
        this.$highlightRules.updateAst(ast)
    }
}