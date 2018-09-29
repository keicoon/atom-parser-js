var FeedParser = require('feedparser');

module.exports = class AtomParser {
    constructor(options = {}) {
        if (options.url || options.content) {
            options.proxy = options.proxy || false;
            this.items = new Array();
            this.events = new Object();

            this.feedparser = new FeedParser();

            if (options.proxy && options.url) {
                this.parsing_proxy_url(options.url);
            } else if (options.url) {
                this.parsing_url(options.url);
            } else if (options.content) {
                this.parsing_content(options.content);
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

        req.on('end', function () {
            this.call('response', this.items);
        }.bind(this));


        this.feedparser.on('error', function (error) {
            this.call('error', error);
        }.bind(this));

        this.feedparser.on('readable', function () {
            // This is where the action is!
            var stream = this.feedparser; // `this` is `feedparser`, which is a stream
            // var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
            var item;

            while (item = stream.read()) {
                this.add(item);
            }
        }.bind(this));
    }
    // @TODO:
    parsing_content(text) { }
}