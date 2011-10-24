/**
 * Twig.js v0.3
 * Copyright (c) 2011 John Roepke
 * Available under the BSD 2-Clause License
 */
module.declare(function(require, exports, module) {

var twig=function(b){var a=b.id;if(b.debug!==void 0)Twig.debug=b.debug;if(b.data!==void 0)return b=Twig.prepare(b.data),new Twig.Template(b,a);else if(b.ref!==void 0){if(b.id!==void 0)throw Error("Both ref and id cannot be set on a twig.js template.");return Twig.Templates.load(b.ref)}else if(b.href!==void 0)return Twig.Templates.loadRemote(b.href,a,b.load,b.async,b.precompiled)};twig.compile=function(b,a){var d=a.filename,c=Twig.prepare(b),e=Twig.Templates.load(d)||new Twig.Template(c,d);return function(a){return e.render(a)}};
var Twig=function(b){b.trace=false;b.debug=false;b.Error=function(a){this.message=a;this.name="Twig.Exception"};b.Error.prototype.toString=function(){return this.name+": "+this.message};b.log={trace:function(){b.trace&&console.log(Array.prototype.slice.call(arguments))},debug:function(){b.debug&&console.log(Array.prototype.slice.call(arguments))}};b.token={};b.token.type={output:"output",logic:"logic",comment:"comment",raw:"raw"};b.token.definitions={output:{type:b.token.type.output,open:"{{",close:"}}"},
logic:{type:b.token.type.logic,open:"{%",close:"%}"},comment:{type:b.token.type.comment,open:"{#",close:"#}"}};b.token.strings=['"',"'"];b.token.findStart=function(a){var d={position:null,def:null},c,e,f;for(c in b.token.definitions)if(b.token.definitions.hasOwnProperty(c)&&(e=b.token.definitions[c],f=a.indexOf(e.open),b.log.trace("Twig.token.findStart: ","Searching for ",e.open," found at ",f),f>=0&&(d.position===null||f<d.position)))d.position=f,d.def=e;return d};b.token.findEnd=function(a,d,c){for(var e=
null,f=false,g=0,h=null,k=null,i=null,j=h=null,h=null,l,m;!f;){k=h=null;i=a.indexOf(d.close,g);if(i>=0)e=i,f=true;else throw new b.Error("Unable to find closing bracket '"+d.close+"' opened near template position "+c);m=b.token.strings.length;for(l=0;l<m;l+=1)if(j=a.indexOf(b.token.strings[l],g),j>0&&j<i&&(h===null||j<h))h=j,k=b.token.strings[l];if(h!==null){h+=1;e=null;for(f=false;;){h=a.indexOf(k,h);if(h<0)throw"Unclosed string in template";if(a.substr(h-1,1)!=="\\"){g=h+1;break}else h+=1}}}return e};
b.tokenize=function(a){for(var d=[],c=0,e=null,f=null;a.length>0;)e=b.token.findStart(a),b.log.trace("Twig.tokenize: ","Found token: ",e),e.position!==null?(e.position>0&&d.push({type:b.token.type.raw,value:a.substring(0,e.position)}),a=a.substr(e.position+e.def.open.length),c+=e.position+e.def.open.length,f=b.token.findEnd(a,e.def,c),b.log.trace("Twig.tokenize: ","Token ends at ",f),d.push({type:e.def.type,value:a.substring(0,f).trim()}),a=a.substr(f+e.def.close.length),c+=f+e.def.close.length):
(d.push({type:b.token.type.raw,value:a}),a="");return d};b.compile=function(a){for(var d=[],c=[],e=[],f=null,g=f=f=f=null,h=null,k=g=null,i=null,j=null;a.length>0;){f=a.shift();switch(f.type){case b.token.type.raw:c.length>0?e.push(f):d.push(f);break;case b.token.type.logic:f=b.logic.compile(f);k=f.type;i=b.logic.handler[k].open;j=b.logic.handler[k].next;b.log.trace("Twig.compile: ","Compiled logic token to ",f," next is: ",j," open is : ",i);if(i!==void 0&&!i){g=c.pop();h=b.logic.handler[g.type];
if(h.next.indexOf(k)<0)throw Error(k+" not expected after a "+g.type);g.output=g.output||[];g.output=g.output.concat(e);e=[];g={type:b.token.type.logic,token:g};c.length>0?e.push(g):d.push(g)}if(j!==void 0&&j.length>0){b.log.trace("Twig.compile: ","Pushing ",f," to logic stack.");if(c.length>0)g=c.pop(),g.output=g.output||[],g.output=g.output.concat(e),c.push(g);c.push(f)}else i!==void 0&&i&&(g={type:b.token.type.logic,token:f},c.length>0?e.push(g):d.push(g));break;case b.token.type.output:f=b.expression.compile(f),
c.length>0?e.push(f):d.push(f)}b.log.trace("Twig.compile: "," Output: ",d," Logic Stack: ",c," Pending Output: ",e)}if(c.length>0)throw f=c.pop(),Error("Unable to find an end tag for "+f.type+", expecting one of "+f.next.join(", "));return d};b.parse=function(a,d){var c=[],e=true,d=d||{};a.forEach(function(a){b.log.debug("Twig.parse: ","Parsing token: ",a);switch(a.type){case b.token.type.raw:c.push(a.value);break;case b.token.type.logic:a=b.logic.parse(a.token,d,e);if(a.chain!==void 0)e=a.chain;
if(a.context!==void 0)d=a.context;a.output!==void 0&&c.push(a.output);break;case b.token.type.output:c.push(b.expression.parse(a.stack,d))}});return c.join("")};b.prepare=function(a){b.log.debug("Twig.prepare: ","Tokenizing ",a);a=b.tokenize(a);b.log.debug("Twig.prepare: ","Compiling ",a);a=b.compile(a);b.log.debug("Twig.prepare: ","Compiled ",a);return a};b.Templates={registry:{}};b.Templates.save=function(a){if(a.id===void 0)throw new b.Error("Unable to save template with no id");b.Templates.registry[a.id]=
a};b.Templates.load=function(a){return!b.Templates.registry.hasOwnProperty(a)?null:b.Templates.registry[a]};b.Templates.loadRemote=function(a,d,c,e,f){d===void 0&&(d=a);if(b.Templates.registry.hasOwnProperty(d))return b.Templates.registry[d];if(typeof XMLHttpRequest=="undefined")throw Error("Unsupported platform: Unable to do remote requests because there is no XMLHTTPRequest implementation");var g=new XMLHttpRequest;g.onreadystatechange=function(){var a=null,a=null;g.readyState==4&&(b.log.debug("Got template ",
g.responseText),a=f===true?JSON.parse(g.responseText):b.prepare(g.responseText),a=new b.Template(a,d),c&&c(a))};g.open("GET",a,e===true);g.send()};b.Template=function(a,d){this.id=d;this.tokens=a;this.render=function(d){b.log.debug("Twig.Template: ","Rendering template with context: ",d);d=b.parse(a,d);b.log.debug("Twig.Template: ","Template rendered to: ",d);return d};d!==void 0&&b.Templates.save(this)};return b}(Twig||{});
(function(){if(!Array.prototype.indexOf)Array.prototype.indexOf=function(b){if(this===void 0||this===null)throw new TypeError;var a=Object(this),d=a.length>>>0;if(d===0)return-1;var c=0;arguments.length>0&&(c=Number(arguments[1]),c!==c?c=0:c!==0&&c!==Infinity&&c!==-Infinity&&(c=(c>0||-1)*Math.floor(Math.abs(c))));if(c>=d)return-1;for(c=c>=0?c:Math.max(d-Math.abs(c),0);c<d;c++)if(c in a&&a[c]===b)return c;return-1};if(!Array.prototype.forEach)Array.prototype.forEach=function(b,a){var d,c;if(this==
null)throw new TypeError(" this is null or not defined");var e=Object(this),f=e.length>>>0;if({}.toString.call(b)!="[object Function]")throw new TypeError(b+" is not a function");a&&(d=a);for(c=0;c<f;){var g;c in e&&(g=e[c],b.call(d,g,c,e));c++}};if(!Object.keys)Object.keys=function(b){if(b!==Object(b))throw new TypeError("Object.keys called on non-object");var a=[],d;for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&a.push(d);return a}})();
Twig=function(b){b.logic={};b.logic.type={if_:"if",endif:"endif",for_:"for",endfor:"endfor",else_:"else",elseif:"elseif",set:"set"};b.logic.definitions=[{type:b.logic.type.if_,regex:/^if\s+([^\s].+)$/,next:[b.logic.type.else_,b.logic.type.elseif,b.logic.type.endif],open:true,compile:function(a){a.stack=b.expression.compile({type:b.expression.type.expression,value:a.match[1]}).stack;delete a.match;return a},parse:function(a,d,c){var e="",f=b.expression.parse(a.stack,d),c=true;f===true&&(c=false,e=
b.parse(a.output,d));return{chain:c,output:e}}},{type:b.logic.type.elseif,regex:/^elseif\s+([^\s].*)$/,next:[b.logic.type.else_,b.logic.type.endif],open:false,compile:function(a){a.stack=b.expression.compile({type:b.expression.type.expression,value:a.match[1]}).stack;delete a.match;return a},parse:function(a,d,c){var e="";c&&b.expression.parse(a.stack,d)===true&&(c=false,e=b.parse(a.output,d));return{chain:c,output:e}}},{type:b.logic.type.else_,regex:/^else$/,next:[b.logic.type.endif,b.logic.type.endfor],
open:false,parse:function(a,d,c){var e="";c&&(e=b.parse(a.output,d));return{chain:c,output:e}}},{type:b.logic.type.endif,regex:/^endif$/,next:[],open:false},{type:b.logic.type.for_,regex:/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].+)$/,next:[b.logic.type.else_,b.logic.type.endfor],open:true,compile:function(a){var d=a.match[1],c=a.match[2],e=null,e=null;a.key_var=null;a.value_var=null;if(d.indexOf(",")>=0)if(e=d.split(","),e.length===2)a.key_var=e[0].trim(),a.value_var=e[1].trim();else throw new b.Error("Invalid expression in for loop: "+
d);else a.value_var=d;e=b.expression.compile({type:b.expression.type.expression,value:c}).stack;a.expression=e;delete a.match;return a},parse:function(a,d,c){var e=b.expression.parse(a.expression,d),f=[],g;e instanceof Array?(g=0,e.forEach(function(c){d[a.value_var]=c;a.key_var&&(d[a.key_var]=g);f.push(b.parse(a.output,d));g+=1})):e instanceof Object&&(c=e._keys!==void 0?e._keys:Object.keys(e),c.forEach(function(c){c!=="_keys"&&e.hasOwnProperty(c)&&(d[a.value_var]=e[c],a.key_var&&(d[a.key_var]=c),
f.push(b.parse(a.output,d)))}));c=f.length===0;return{chain:c,output:f.join("")}}},{type:b.logic.type.endfor,regex:/^endfor$/,next:[],open:false},{type:b.logic.type.set,regex:/^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*(.+)$/,next:[],open:true,compile:function(a){var d=a.match[1].trim(),c=b.expression.compile({type:b.expression.type.expression,value:a.match[2]}).stack;a.key=d;a.expression=c;delete a.match;return a},parse:function(a,d,c){var e=b.expression.parse(a.expression,d);d[a.key]=e;return{chain:c,context:d}}}];
b.logic.handler={};b.logic.extendType=function(a,d){b.logic.type[a]=d||a};for(b.logic.extend=function(a){if(!a.type)throw new b.Error("Unable to extend logic definition. No type provided for "+a);b.logic.handler[a.type]=a};b.logic.definitions.length>0;)b.logic.extend(b.logic.definitions.shift());b.logic.compile=function(a){var a=a.value.trim(),a=b.logic.tokenize(a),d=b.logic.handler[a.type];b.log.trace("Twig.logic.compile: ","Compiling logic token ",a);d.compile&&(a=d.compile(a),b.log.trace("Twig.logic.compile: ",
"Compiled logic token to ",a));return a};b.logic.tokenize=function(a){var d={},c=null,e=null,f=null,g=null,f=f=null,a=a.trim();for(c in b.logic.handler)if(b.logic.handler.hasOwnProperty(c)){e=b.logic.handler[c].type;f=b.logic.handler[c].regex;g=[];for(f instanceof Array?g=f:g.push(f);g.length>0;)if(f=g.shift(),f=f.exec(a.trim()),f!==null)return d.type=e,d.match=f,b.log.trace("Twig.logic.tokenize: ","Matched a ",e," regular expression of ",f),d}throw new b.Error("Unable to parse '"+a.trim()+"'");};
b.logic.parse=function(a,d,c){var e="",f,d=d||{};b.log.trace("Twig.logic.parse: ","Parsing logic token ",a);f=b.logic.handler[a.type];f.parse&&(e=f.parse(a,d,c));return e};return b}(Twig||{});
Twig=function(b){b.expression={};b.expression.type={comma:"Twig.expression.type.comma",expression:"Twig.expression.type.expression",operator:"Twig.expression.type.operator",string:"Twig.expression.type.string",array:{start:"Twig.expression.type.array.start",end:"Twig.expression.type.array.end"},object:{start:"Twig.expression.type.object.start",end:"Twig.expression.type.object.end"},parameter:{start:"Twig.expression.type.parameter.start",end:"Twig.expression.type.parameter.end"},key:{period:"Twig.expression.type.key.period",
brackets:"Twig.expression.type.key.brackets"},filter:"Twig.expression.type.filter",variable:"Twig.expression.type.variable",number:"Twig.expression.type.number",setkey:"Twig.expression.type.setkey",test:"Twig.expression.type.test"};b.expression.set={operations:[b.expression.type.filter,b.expression.type.operator,b.expression.type.array.end,b.expression.type.object.end,b.expression.type.parameter.end,b.expression.type.comma,b.expression.type.setkey,b.expression.type.test],expressions:[b.expression.type.expression,
b.expression.type.string,b.expression.type.variable,b.expression.type.number,b.expression.type.array.start,b.expression.type.object.start]};b.expression.definitions=[{type:b.expression.type.test,regex:/^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,next:b.expression.set.operations.concat([b.expression.type.parameter.start]),compile:function(a,b,c){a.filter=a.match[2];a.modifier=a.match[1];c.push(a);return{stack:b,output:c}},parse:function(a,d,c){var e=d.pop(),f=a.params&&b.expression.parse(a.params,c),
e=b.test(a.filter,e,f);a.modifier=="not"?d.push(!e):d.push(e);return{stack:d,context:c}}},{type:b.expression.type.setkey,regex:/^\:/,next:b.expression.set.expressions,compile:function(a,d,c){var e=c.pop();if(e.type!==b.expression.type.string)throw new b.Error("Unexpected object key: "+e);a.key=e.value;c.push(a);return{stack:d,output:c}},parse:function(a,b,c){b.push(a);return{stack:b,context:c}}},{type:b.expression.type.comma,regex:/^,/,next:b.expression.set.expressions,compile:function(a,b,c){for(;b.length>
0;)c.push(b.pop());c.push(a);return{stack:b,output:c}}},{type:b.expression.type.expression,regex:/^\([^\)]+\)/,next:b.expression.set.operations,compile:function(a,d,c){a.value=a.value.substring(1,a.value.length-1);for(a=b.expression.compile(a).stack;a.length>0;)c.push(a.shift());return{stack:d,output:c}}},{type:b.expression.type.operator,regex:/(^[\+\*\/\-\^~%]|^[<>!]=?|^==|^\|\||^&&)/,next:b.expression.set.expressions,compile:function(a,d,c){a=b.expression.operator.lookup(a.value,a);for(b.log.trace("Twig.expression.compile: ",
"Operator: ",a);d.length>0&&(a.associativity===b.expression.operator.leftToRight&&a.precidence>=d[d.length-1].precidence||a.associativity===b.expression.operator.rightToLeft&&a.precidence>d[d.length-1].precidence);)c.push(d.pop());d.push(a);return{stack:d,output:c}},parse:function(a,d,c){d=b.expression.operator.parse(a.value,d);return{stack:d,context:c}}},{type:b.expression.type.string,regex:/^(["'])(?:(?=(\\?))\2.)*?\1/,next:b.expression.set.operations,compile:function(a,d,c){var e=a.value,e=e.substring(0,
1)==='"'?e.replace('\\"','"'):e.replace("\\'","'");a.value=e.substring(1,e.length-1);b.log.trace("Twig.expression.compile: ","String value: ",a.value);c.push(a);return{stack:d,output:c}},parse:function(a,b,c){b.push(a.value);return{stack:b,context:c}}},{type:b.expression.type.parameter.start,regex:/^\(/,next:b.expression.set.expressions.concat([b.expression.type.parameter.end]),compile:function(a,b,c){c.push(a);return{stack:b,output:c}},parse:function(a,b,c){b.push(a);return{stack:b,context:c}}},
{type:b.expression.type.parameter.end,regex:/^\)/,next:b.expression.set.operations,compile:function(a,d,c){for(;d.length>0;)c.push(d.pop());for(var e=[];a.type!==b.expression.type.parameter.start;)e.unshift(a),a=c.pop();e.unshift(a);a=c.pop();if(a.type!==b.expression.type.filter&&a.type!==b.expression.type.test)throw new b.Error("Expected filter before parameters, got "+a.type);a.params=e;c.push(a);return{stack:d,output:c}},parse:function(a,d,c){for(var a=[],e=false,f=null;d.length>0;){f=d.pop();
if(f.type&&f.type==b.expression.type.parameter.start){e=true;break}a.unshift(f)}if(!e)throw new b.Error("Expected end of parameter set.");d.push(a);return{stack:d,context:c}}},{type:b.expression.type.array.start,regex:/^\[/,next:b.expression.set.expressions.concat([b.expression.type.array.end]),compile:function(a,b,c){c.push(a);return{stack:b,output:c}},parse:function(a,b,c){b.push(a);return{stack:b,context:c}}},{type:b.expression.type.array.end,regex:/^\]/,next:b.expression.set.operations.concat([b.expression.type.key.period,
b.expression.type.key.brackets]),compile:function(a,b,c){for(;b.length>0;)c.push(b.pop());c.push(a);return{stack:b,output:c}},parse:function(a,d,c){for(var a=[],e=false,f=null;d.length>0;){f=d.pop();if(f.type&&f.type==b.expression.type.array.start){e=true;break}a.unshift(f)}if(!e)throw new b.Error("Expected end of array.");d.push(a);return{stack:d,context:c}}},{type:b.expression.type.object.start,regex:/^\{/,next:b.expression.set.expressions.concat([b.expression.type.object.end]),compile:function(a,
b,c){c.push(a);return{stack:b,output:c}},parse:function(a,b,c){b.push(a);return{stack:b,context:c}}},{type:b.expression.type.object.end,regex:/^\}/,next:b.expression.set.operations.concat([b.expression.type.key.period,b.expression.type.key.brackets]),compile:function(a,b,c){for(;b.length>0;)c.push(b.pop());c.push(a);return{stack:b,output:c}},parse:function(a,d,c){for(var a={},e=false,f=null,g=null;d.length>0;){f=d.pop();if(f.type&&f.type===b.expression.type.object.start){e=true;break}if(f.type&&f.type===
b.expression.type.setkey){if(g===null)throw new b.Error("Expected value for key "+f.key+" in object definition. Got "+f);a[f.key]=g;if(a._keys===void 0)a._keys=[];a._keys.unshift(f.key);g=null}else g=f}if(!e)throw new b.Error("Unexpected end of object.");d.push(a);return{stack:d,context:c}}},{type:b.expression.type.filter,regex:/^\|[a-zA-Z_][a-zA-Z0-9_\-]*/,next:b.expression.set.operations.concat([b.expression.type.key.period,b.expression.type.key.brackets,b.expression.type.parameter.start]),compile:function(a,
b,c){a.value=a.value.substr(1);c.push(a);return{stack:b,output:c}},parse:function(a,d,c){var e=d.pop(),f=a.params&&b.expression.parse(a.params,c);d.push(b.filter(a.value,e,f));return{stack:d,context:c}}},{type:b.expression.type.variable,regex:/^[a-zA-Z_][a-zA-Z0-9_]*/,next:b.expression.set.operations.concat([b.expression.type.key.period,b.expression.type.key.brackets]),compile:function(a,b,c){c.push(a);return{stack:b,output:c}},parse:function(a,b,c){c.hasOwnProperty(a.value);b.push(c[a.value]);return{stack:b,
context:c}}},{type:b.expression.type.key.period,regex:/^\.[a-zA-Z_][a-zA-Z0-9_]*/,next:b.expression.set.operations.concat([b.expression.type.key.period,b.expression.type.key.brackets]),compile:function(a,b,c){a.key=a.value.substr(1);delete a.value;c.push(a);return{stack:b,output:c}},parse:function(a,d,c){var a=a.key,e=d.pop();if(e===null||e===void 0)throw new b.Error("Can't access a key "+a+" on an undefined object.");e.hasOwnProperty(a);d.push(e[a]);return{stack:d,context:c}}},{type:b.expression.type.key.brackets,
regex:/^\[([^\]]*)\]/,next:b.expression.set.operations.concat([b.expression.type.key.period,b.expression.type.key.brackets]),compile:function(a,d,c){var e=a.match[1];delete a.value;delete a.match;a.stack=b.expression.compile({value:e}).stack;c.push(a);return{stack:d,output:c}},parse:function(a,d,c){var a=b.expression.parse(a.stack,c),e=d.pop();if(!e.hasOwnProperty(a))throw new b.Error("Model doesn't provide the key "+a);d.push(e[a]);return{stack:d,context:c}}},{type:b.expression.type.number,regex:/^\-?\d*\.?\d+/,
next:b.expression.set.operations,compile:function(a,b,c){c.push(a);return{stack:b,output:c}},parse:function(a,b,c){b.push(a.value);return{stack:b,context:c}}}];b.expression.handler={};b.expression.extendType=function(a){b.expression.type[a]="Twig.expression.type."+a};for(b.expression.extend=function(a){if(!a.type)throw new b.Error("Unable to extend logic definition. No type provided for "+a);b.expression.handler[a.type]=a};b.expression.definitions.length>0;)b.expression.extend(b.expression.definitions.shift());
b.expression.tokenize=function(a){var d=[],c=0,e=null,f,g,h,k,i,j=[],l;l=function(){var a=Array.prototype.slice.apply(arguments);a.pop();a.pop();b.log.trace("Twig.expression.tokenize","Matched a ",f," regular expression of ",a);if(e&&e.indexOf(f)<0)return j.push(f+" cannot follow a "+d[d.length-1].type+" at template:"+c+" near '"+a[0].substring(0,20)+"...'"),a[0];j=[];d.push({type:f,value:a[0],match:a});i=true;e=k;c+=a[0].length;return""};for(b.log.debug("Twig.expression.tokenize","Tokenizing expression ",
a);a.length>0;){a=a.trim();for(f in b.expression.handler)if(b.expression.handler.hasOwnProperty(f)){k=b.expression.handler[f].next;g=b.expression.handler[f].regex;b.log.trace("Checking type ",f," on ",a);h=g instanceof Array?g:[g];for(i=false;h.length>0;)g=h.pop(),a=a.replace(g,l);if(i)break}if(!i)if(j.length>0)throw new b.Error(j.join(" OR "));else throw new b.Error("Unable to parse '"+a+"' at template position"+c);}b.log.trace("Twig.expression.tokenize","Tokenized to ",d);return d};b.expression.compile=
function(a){var d=a.value,c=b.expression.tokenize(d),e=null,f=[],g=[],h=e=null;b.log.trace("Twig.expression.compile: ","Compiling ",d);for(b.log.trace("Twig.expression.compile: ","Tokens tokenized to ",c);c.length>0;)e=c.shift(),h=b.expression.handler[e.type],h.compile&&(e=h.compile(e,g,f),f=e.output&&f,g=e.stack&&g);for(;g.length>0;)f.push(g.pop());b.log.trace("Twig.expression.compile: ","Stack is",f);a.stack=f;delete a.value;return a};b.expression.parse=function(a,d){a instanceof Array||(a=[a]);
var c=[],e=null,f=null;a.forEach(function(a){e=b.expression.handler[a.type];b.log.trace("Twig.expression.parse: ","Parsing ",a);e.parse&&(f=e.parse(a,c,d),c=f.stack&&c,d=f.context&&d);b.log.trace("Twig.expression.parse: ","Stack result: ",c)});return c.pop()};return b}(Twig||{});
Twig=function(b){b.expression.operator={leftToRight:"leftToRight",rightToLeft:"rightToLeft"};b.expression.operator.lookup=function(a,d){switch(a){case ",":d.precidence=18;d.associativity=b.expression.operator.leftToRight;break;case "?":case ":":d.precidence=16;d.associativity=b.expression.operator.rightToLeft;break;case "||":d.precidence=14;d.associativity=b.expression.operator.leftToRight;break;case "&&":d.precidence=13;d.associativity=b.expression.operator.leftToRight;break;case "==":case "!=":d.precidence=
9;d.associativity=b.expression.operator.leftToRight;break;case "<":case "<=":case ">":case ">=":d.precidence=8;d.associativity=b.expression.operator.leftToRight;break;case "~":case "+":case "-":d.precidence=6;d.associativity=b.expression.operator.leftToRight;break;case "*":case "/":case "%":d.precidence=5;d.associativity=b.expression.operator.leftToRight;break;case "!":d.precidence=3;d.associativity=b.expression.operator.rightToLeft;break;default:throw new b.Error(a+" is an unknown operator.");}d.operator=
a;return d};b.expression.operator.parse=function(a,d){b.log.trace("Twig.expression.operator.parse: ","Handling ",a);var c,e;switch(a){case "+":e=parseFloat(d.pop());c=parseFloat(d.pop());d.push(c+e);break;case "-":e=parseFloat(d.pop());c=parseFloat(d.pop());d.push(c-e);break;case "*":e=parseFloat(d.pop());c=parseFloat(d.pop());d.push(c*e);break;case "/":e=parseFloat(d.pop());c=parseFloat(d.pop());d.push(c/e);break;case "%":e=parseFloat(d.pop());c=parseFloat(d.pop());d.push(c%e);break;case "~":e=d.pop().toString();
c=d.pop().toString();d.push(c+e);break;case "!":d.push(!d.pop());break;case "<":e=d.pop();c=d.pop();d.push(c<e);break;case "<=":e=d.pop();c=d.pop();d.push(c<=e);break;case ">":e=d.pop();c=d.pop();d.push(c>e);break;case ">=":e=d.pop();c=d.pop();d.push(c>=e);break;case "==":e=d.pop();c=d.pop();d.push(c==e);break;case "!=":e=d.pop();c=d.pop();d.push(c!=e);break;case "||":e=d.pop();c=d.pop();d.push(c||e);break;case "&&":e=d.pop(),c=d.pop(),d.push(c&&e)}return d};return b}(Twig||{});
Twig=function(b){b.filters={upper:function(a){return a.toUpperCase()},lower:function(a){return a.toLowerCase()},capitalize:function(a){return a.substr(0,1).toUpperCase()+a.substr(1)},title:function(a){return a.replace(/(^|\s)([a-z])/g,function(a,b,e){return b+e.toUpperCase()})},length:function(a){if(a instanceof Array||typeof a==="string")return a.length;else if(a instanceof Object)return a._keys===void 0?Object.keys(a).length:a._keys.length},reverse:function(a){if(a instanceof Array)return a.reverse();
else if(a instanceof Object){var b=a._keys||Object.keys(a).reverse();a._keys=b;return a}},sort:function(a){if(a instanceof Array)return a.sort();else if(a instanceof Object){var b=Object.keys(a).sort(function(b,d){return a[b]>a[d]});b.forEach(function(){});a._keys=b;return a}},keys:function(a){var b=[];(a._keys||Object.keys(a)).forEach(function(c){c!=="_keys"&&a.hasOwnProperty(c)&&b.push(c)});return b},url_encode:function(a){return encodeURIComponent(a)},join:function(a,b){var c="",e=[],f=null;b&&
b[0]&&(c=b[0]);a instanceof Array?e=a:(f=a._keys||Object.keys(a),f.forEach(function(b){b!=="_keys"&&a.hasOwnProperty(b)&&e.push(a[b])}));return e.join(c)},"default":function(a,d){if(d===void 0||d.length!==1)throw new b.Error("default filter expects one argument");return a===void 0||a===null||a===""?d[0]:a},json_encode:function(a){delete a._keys;return JSON.stringify(a)},merge:function(a,d){var c=[],e=0,f=[];a instanceof Array?d.forEach(function(a){a instanceof Array||(c={})}):c={};if(!(c instanceof
Array))c._keys=[];a instanceof Array?a.forEach(function(a){c._keys&&c._keys.unshift(e);c[e]=a;e++}):(f=a._keys||Object.keys(a),f.forEach(function(b){c[b]=a[b];c._keys.push(b);b=parseInt(b,10);!isNaN(b)&&b>=e&&(e=b+1)}));d.forEach(function(a){a instanceof Array?a.forEach(function(a){c._keys&&c._keys.push(e);c[e]=a;e++}):(f=a._keys||Object.keys(a),f.forEach(function(b){c[b]||c._keys.unshift(b);c[b]=a[b];b=parseInt(b,10);!isNaN(b)&&b>=e&&(e=b+1)}))});if(d.length===0)throw new b.Error("Filter merge expects at least one parameter");
return c}};b.filter=function(a,d,c){if(!b.filters[a])throw"Unable to find filter "+a;return b.filters[a](d,c)};return b}(Twig||{});
Twig=function(b){b.tests={empty:function(a){if(a===null||a===void 0)return true;if(a.length&&a.length>0)return false;for(var b in a)if(a.hasOwnProperty(b))return false;return true},odd:function(a){return a%2===1},even:function(a){return a%2===0},divisibleby:function(a,b){return a%b[0]===0},defined:function(a){return a!==void 0},none:function(a){return a===null}};b.test=function(a,d,c){if(!b.tests[a])throw"Test "+a+" is not defined.";return b.tests[a](d,c)};return b}(Twig||{});
typeof exports!=="undefined"&&exports?exports.twig=twig:window.twig=twig;

});