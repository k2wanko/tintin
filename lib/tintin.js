

(function(){

  'use strict';

  var Element;

  var isFunction = function(obj) {
    return typeof obj === 'function';
  };

  var isString = function(obj) {
    return typeof obj === 'string';
  };

  var isObject = function(obj) {
    return obj === Object(obj)
  };

  var isArray = Array.isArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  var getAncestor = function(element) {
    var ancestor = [];
    var p = function(e){
      if( e.parent ){
        ancestor.push(e.parent);
        p(e.parent);
      }
    };
    p(element);
    return ancestor;
  }

  var Exception = function(value, message) {
    this.value = value;
    this.message = message || "";
    this.toString = function() {
      return this.value + ":" + this.message;
    };
  };

  var block = {};

  var tintin = function(attr, _) {
    var element, attr, _;

    if (!_){
      var _ref;
      _ref = [_, attr], attr = _ref[0], _ = _ref[1];
    }
    
    if (isFunction(_)) {
      element = new Element(null, "html", attr);
      _.call(element, element._.bind(element), block);
    } else {
      throw new Exception({attr: attr, _: _}, "Illegal arguments.");
    }

    return element;
    
  };

  tintin.extend = function(template, _block){
    var element;
    block = _block;
    if( process /*is NodeJS */ ) {
      require("coffee-script/register");
      
      try {
        element = require(template);
      } catch (e) {
        var fs = require('fs');
        var ignores = ['.git', 'node_modules'];
        var find = function(dir){
          var list = fs.readdirSync(dir);
          for( var f in list){
            var _r = list[f];
            if( !( ignores.indexOf(_r) > -1 ) ) {
              var st = fs.statSync(_r);
              if(st.isFile()){
                console.log("f", _r);
              }
              if(st.isDirectory()){
                console.log("dir", dir+'/'+_r);
                //find(dir+'/'+_r);
              }
            }
          }
        };

        find(process.cwd());
      }
      //console.log(fs.readdirSync(process.cwd()));
      //element = require(template);
    }
    return element;
  };

  Element = (function(){
    function Element(parent, name, attr) {
      this.parent = parent instanceof Element ? parent : null;
      this.name = name;
      this.attr = attr;

      this.childrens = [];
    }

    Element.prototype._ = function(name, attr, _) {

      if(!_){
        if(isFunction(attr) || isString(attr)){
          var _ref;
          _ref = [_, attr], attr = _ref[0], _ = _ref[1];
        }
        if(!attr) {
          attr = {};
        }
      }

      var reg = /(\[(.+?)\])/g;
      var match = name.match(reg);
      if( match ) {
        var _ref = null;
        _ref = match.map(function(s){
          return s.substring(1, s.length - 1).match(/(.+?)=(.+)/);
        });
        for ( var o in _ref) {
          attr[ _ref[o][1] ] = _ref[o][2];
        }
        name = name.replace(reg, '');
      }


      var reg = /(#([\w-]+))/;
      var match = name.match(reg);
      if(match){
        attr['id'] = match[2];
      }

      var match = name.match(/(\.([\w-]+))/g);
      if( match ) {
        attr['class'] = match.map(function(s){
          return s.substring(1, s.length); 
        });
      }
      
      var match = name.match(/^([\w]+)/);
      if( match ) {
        name = match[0];
      } else {
        name = "div";
      }
      
      if( isString(name) ) {
        var element = new Element(this, name, attr);
        this.childrens.push(element);
        if( isFunction(_) ) {
          _.call(element, element._.bind(element));
        } else 
        if( isString(_) ) {
          element.content = _;
        } else {
          
        }
      }
    };

    Element.prototype.toString = Element.prototype.toHTML = function(uglify) {
      var tag = "";
      var attr = "";
      var tab = "  ";
      var br = uglify ? '' : "\n";
      var indent = "";
      var doctype = "<!DOCTYPE html>";

      if( this.name === "html"){
        tag += doctype + br;
      }
      
      if( !uglify && this.parent ) {
        for (var i=0; i < getAncestor(this).length; i++){
          indent += tab;
        }
        tag += br + indent;
      }
      if( Object.keys(this.attr).length > 0 ) {
        var attrs = [];
        attr += " ";
        for ( var o in this.attr) {
          var _str = isArray(this.attr[o]) ? this.attr[o].join(' ') : this.attr[o];
          attrs.push(o + "=\"" + _str + "\"");
        }
        attr += attrs.join(" ");
      }
      
      tag += "<" + this.name + attr + ">";
      
      if( this.childrens.length > 0 ) {
        var i;
        var c;
        for ( var e in c = this.childrens) {
          tag += c[e].toHTML(uglify);
        }

        tag += br + indent + "</" + this.name + ">";
      }

      if( this.content ){
        tag += this.content || "";
        tag += "</" + this.name + ">"; 
      }


      return tag;
    };

    Element.prototype.extend = function(blocks){
      var element = this;
      if( isObject(blocks) ){
        console.log(block = blocks);
      } else {
        throw new Exception(block, "Illegal arguments. blocks only Object.");
      }
      return element;
    };

    return Element;
  })();


  module.exports = exports = tintin;

})();
