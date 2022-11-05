import { Fetch } from "./Fetch";
import { Summoner } from "./Summoner";
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
            let name = input.value;
            let summoner = await Fetch.Player(name);
            try {
                if(summoner.accountId == undefined) {
                    throw 'Summoner not found';
                }
                try {
                    let dmain = document.querySelector('#display_main');
                    dmain.remove();
                    let main = document.querySelector('main');
                    main.appendChild(await summoner.Main());


                }
                catch {
                    let display_match = document.querySelector('#display_match');
                    if (display_match) {
                        display_match.remove();
                    }
                    let main = document.querySelector('main');
                    main.appendChild(await summoner.Main());
                }
            }
            catch (e) {
                console.log(e);
            }
            input.value = '';
        }
    }
    getform() {
        return this.form;
    }
}