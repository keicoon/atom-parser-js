module.exports = class AtomParser {
    constructor(options = {}) {
        if (options.url) {
            options.proxy = options.proxy || false;
            options.xml = options.xml || false;
            this.items = new Array();
            this.events = new Object();

            this.setup_feedparser();

            if (options.url) {
                if (options.proxy) {
                    this.parsing_proxy_url(options.url);
                } else if (options.xml) {
                    this.parsing_xml_url(options.url);
                } else {
                    this.parsing_url(options.url);
                }
            }
        } else {
            this.call('error', 'error about options');
        }
    }

    add(item) {
        this.items.push({
            title: item.title,
            date: item.date,
            link: item.link
        });
    }

    on(event, listener) {
        this.events[event] = listener;
    }

    call(event, params) {
        if (this.events[event]) {
            this.events[event](params);
        }
    }

    setup_feedparser() {
        var FeedParser = require('feedparser');
        this.feedparser = new FeedParser();
        this.feedparser.on('error', function (error) {
            this.call('error', error);
        }.bind(this));

        this.feedparser.on('readable', function () {
            var stream = this.feedparser;
            var item;
            while (item = stream.read()) {
                this.add(item);
            }
        }.bind(this));

        this.feedparser.on('end', function () {
            this.call('response', this.items);
        }.bind(this));``
    }

    parsing_proxy_url(url) {
        var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        this.parsing_url(CORS_PROXY + url)
    }

    parsing_url(url) {
        var request = require('request'); // for fetching the feed
        var req = request(url)

        req.on('error', function (error) {
            this.call('error', error);
        }.bind(this));

        req.on('response', function (req) {
            var stream = req; // `this` is `req`, which is a stream

            if (req.statusCode !== 200) {
                req.emit('error', new Error('Bad status code'));
            }
            else {
                stream.pipe(this.feedparser);
            }
        }.bind(this));
    }

    parsing_xml_url(url) {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var body = xhr.responseText;
                var Readable = require('stream').Readable
                var s = new Readable
                s.push(body);
                s.push(null);
                s.pipe(this.feedparser);
            }
        }.bind(this);

        xhr.send();
    }
}