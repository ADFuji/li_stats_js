//ecris une classe qui permet de faire des fetchs avec une rate limit de 100 requetes par minutes et 20 requetes par secondes
class Test(){
    constructor(){
        this.nRequests = new Date().getTime();
        this.lastNRequest = this.nRequests;
        this.requests = []
    }
    async FetchData(url) {
        //si on a fait moins de 100 requetes en 1 minutes
        if (this.requests.length < 100) {
            this.requests.push(new Date().getTime());
            let req = await fetch(url);
            let data = await req.json();
            this.nRequests--;
            return data;
        }
        //si on a fait plus de 100 requetes en 1 minutes on attend 1 minutes
        else if (this.requests.length > 100) {
            let time = new Date().getTime();
            let time2 = this.requests[0];
            if (time - time2 < 60000) {
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
            this.requests.shift();
        }
        //si on a fait plus de 20 requetes en 1 secondes on attend 1 secondes
        else if (this.requests.length > 20) {
            let time = new Date().getTime();
            let time2 = this.requests[0];
            if (time - time2 < 1000) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            this.requests.shift();
        }
        this.requests.push(new Date().getTime());
        let req = await fetch(url);
        let data = await req.json();
        this.nRequests--;
        return data;
    }
}