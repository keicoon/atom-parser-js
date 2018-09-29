### atom.parser.js

### example
- node
```
var AtomParser = require('atom-parser-js');
var res = new AtomParser({ "url": 'something' });

res.on('response', (res) => {
    console.log(res);
});

res.on('error', (err) => {
    console.error(err);
});
```
- browser
```
<!DOCTYPE html>

<head lang="en">
    <meta charset="UTF-8">
    <title>test</title>
</head>

<body>
    <script type="text/javascript" src="https://github.com/keicoon/atom-parser-js/blob/master/browserify/bundle.js"></script>
    <script>
        var res = new AtomParser({ "url": 'something', "proxy": true });
        
        res.on('response', (res) => {
            console.log(res);
        });
        res.on('error', (err) => {
            console.error(err);
        });
    </script>
</body>

</html>
```