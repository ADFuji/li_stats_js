//make a class Popup that extends node
export class Popup{
    //constructor
    constructor(title, content) {
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'popup');
        this.div.setAttribute('id', 'popup');
        this.title = document.createElement('h3')
        this.title.setAttribute('class', 'popup-title');
        this.title.innerHTML = title;
        this.div.appendChild(this.title);
        this.content = document.createElement('p');
        this.content.setAttribute('class', 'popup-content');
        this.content.innerHTML = content;
        this.div.appendChild(this.content);
        this.button = document.createElement('button');
        this.button.setAttribute('class', 'popup-close-button');
        this.button.innerHTML = 'Close';
        this.button.addEventListener('click', () => {
            this.close();
        })
        this.div.appendChild(this.button);

        //set the popup to be in the middle of the screen
        this.div.style.position = 'absolute';
        this.div.style.top = (window.innerHeight - this.div.offsetHeight) / 2 + 'px';
        this.div.style.left = (window.innerWidth - this.div.offsetWidth) / 2 + 'px';

        //set the look of the popup
        this.div.style.backgroundColor = 'white';
        this.div.style.border = '1px solid black';
        this.div.style.borderRadius = '5px';
        this.div.style.padding = '10px';
        this.div.style.boxShadow = '0 0 10px black';
        this.div.style.color = 'black';

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