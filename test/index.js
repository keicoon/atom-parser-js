
var AtomParser = require('../src');
// options: {proxy, xml}
var res = new AtomParser({ "proxy": true, "url": 'https://ltn.hitomi.la/artist/mizuryu%20kei-korean.atom' });

res.on('response', (res) => {
    console.log(res);
});

res.on('error', (err) => {
    console.error(err);
});