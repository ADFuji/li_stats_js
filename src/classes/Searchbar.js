import { Fetch } from "./Fetch";
import { Summoner } from "./Summoner";
import { Popup } from "./Popup";
import { LoadingDiv } from "./LoadingDiv";
export class Searchbar{
    constructor() {
        this.form = document.createElement('form');
        this.form.setAttribute('id', 'search-form');
        this.form.setAttribute('class', 'search-form');
        this.form.setAttribute('action', '#');
        this.form.setAttribute('method', 'get');
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'search');
        this.input.setAttribute('id', 'search-input');
        this.input.setAttribute('class', 'search-input');
        this.input.setAttribute('placeholder', 'Search a summoner...');
        this.form.appendChild(this.input);
        this.submit = document.createElement('input');
        this.submit.setAttribute('type', 'submit');
        this.submit.setAttribute('value', 'Search');
        this.submit.setAttribute('id', 'search-submit');
        this.submit.setAttribute('class', 'search-submit');
        this.form.appendChild(this.submit);
        this.form.addEventListener('submit', async (e) => {
            await this.submitForm(e);
        });
    }
    async submitForm(e) {
        let input = document.getElementById('search-input');
        if(input.value != '') {
            e.preventDefault();
            LoadingDiv.start();
            let name = input.value;
            try {
                let summoner = await Fetch.Player(name);
                let dmain = document.querySelector('#display_main');
                dmain.remove();
                let main = document.querySelector('main');
                main.appendChild(await summoner.Main());
            }
            catch (e) {
                console.log("searchbar", e.message);
                let popup = new Popup('Error', "Failed to fetch player data, maybe the player doesn't exist");
                document.body.appendChild(popup.getPopup());
                console.log(e.message);
            }
            input.value = '';
            LoadingDiv.stop();
        }
    }
    getform() {
        return this.form;
    }
}