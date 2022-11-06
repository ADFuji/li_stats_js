//make a class Popup that extends node
export class Popup{
    //constructor
    constructor(title, content) {
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'popup');
        this.div.setAttribute('id', 'popup');
        this.div.div = document.createElement('div');
        this.title = document.createElement('h3')
        this.title.setAttribute('class', 'popup-title');
        this.title.innerHTML = title;
        this.div.div.appendChild(this.title);
        this.content = document.createElement('p');
        this.content.setAttribute('class', 'popup-content');
        this.content.innerHTML = content;
        this.div.div.appendChild(this.content);
        this.button = document.createElement('button');
        this.button.setAttribute('class', 'popup-close-button');
        this.button.innerHTML = 'Close';
        this.button.addEventListener('click', () => {
            this.close();
        })
        this.div.div.appendChild(this.button);
        this.div.appendChild(this.div.div);


    }
    //close the popup
    close() {
        this.div.remove();
    }
    //return the popup
    getPopup() {
        return this.div;
    }

}