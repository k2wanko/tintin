#TINTIN

##Install

`npm install tintin`

##Usage
```coffee

tintin = require 'tintin'

element = html {lang: 'en'}, (_)->
	_ "head", (_)->
    	_ "title", "HomePage"
  	_ "body", (_)->
    	_ "#header", (_)->
      		_ "h1", "Brand"
    	_ "#footer", (_)->
      		_ "p.copy-right[style=text-align:right;]", "hogehoge"

console.log element.toHTML()

```

or

```coffee

app.engine 'tintin.coffee', require(tintin).__express()
app.set "view engine", "tintin.coffee"

```


