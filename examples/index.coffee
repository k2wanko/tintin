page_title = "HTML Render"

module.exports = html {lang: 'en'}, (_)->
  _ "head", (_)->
    _ "title", page_title
  _ "body", (_)->
    _ "h1", page_title
    _ "#main", (_)->
      url = "/"
      _ "a[href=#{url}][name=link]", "Top"
      _ "p#id_p", {style: "color:red"}, "Hello"
      _ "hr.class_hr"
      _ "p", "World"
      _ "input", {class: ['btn', 'btn-default']}
