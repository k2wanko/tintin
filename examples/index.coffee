html = require '../lib/html-render'

page_title = "HTML Render"

res = html {lang: 'en'}, (_)->
  _ "head", (_)->
    _ "title", page_title
  _ "body", (_)->
    _ "h1", page_title
    _ "#main", (_)->
      url = "http://k2lab.net/"
      _ "a[href=#{url}][name=link]", url
      _ "p#id_p", {style: "color:red"}, "Hello"
      _ "hr.class_hr"
      _ "p", "World"
      _ "input", {class: ['btn', 'btn-default']}

console.log res.toHTML true
