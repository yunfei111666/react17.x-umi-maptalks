export default class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.timer = null;
        this.timeout = 10000;
        this.onopen = () => {};
        this.onmessage = () => {};
        this.onclose = () => {};
        this.onerror = () => {};
    }
    init = () => {
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = () => {
            this.onopen();
        };
        this.ws.onmessage = (data) => {
            this.onmessage(data);
        };
        this.ws.onclose = () => {
            this.onclose();
        };
        this.ws.onerror = (error) => {
            this.onerror(error);
        };
        this.checkConnect();
    };

    destoryWS = () => {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            clearInterval(this.timer);
        }
    };

    checkConnect = () => {
        this.timer = setInterval(() => {
            if (this.ws.readyState !== 1) {
                this.destoryWS();
                this.init();
            }
        }, this.timeout);
    };
}
