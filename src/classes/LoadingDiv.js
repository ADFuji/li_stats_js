export class LoadingDiv {
    //it a class to display a loading time while the data is being fetched
    constructor() {
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'loading-div');
        this.div.setAttribute('id', 'loading-div');
        this.div.innerHTML = '<p>Loading</p><img src="img/loading.gif" alt="loading" />';
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