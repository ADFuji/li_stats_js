export class LoadingDiv {
    //it a class to display a loading time while the data is being fetched
    constructor() {
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'loading-div');
        this.div.setAttribute('id', 'loading-div');
        this.div.style.position = 'absolute';
        this.div.style.top = (window.innerHeight - this.div.offsetHeight) / 2 + 'px';
        this.div.style.left = (window.innerWidth - this.div.offsetWidth) / 2 + 'px';
        this.div.style.backgroundColor = 'white';
        this.div.style.border = '1px solid black';
        this.div.style.borderRadius = '5px';
        this.div.style.padding = '10px';
        this.div.style.boxShadow = '0 0 10px black';
        this.div.style.color = 'black';
        this.div.innerHTML = 'Loading'
        //add the dots to the loading div every 0.5 seconds
        
    }
    getDiv() {
        return this.div;
    }
    removeDiv() {
        this.div.remove();
    }
    static start() {
        if(!document.getElementById('loading-div')) {
            let loadingDiv = new LoadingDiv();
            document.body.appendChild(loadingDiv.getDiv());
        }
    }
    static stop() {
        let loadingDiv = document.getElementById('loading-div');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}