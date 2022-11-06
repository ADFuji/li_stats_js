import '../src/stylesheets/main.scss'
import { Fetch } from './classes/Fetch.js'
import { Summoner } from './classes/Summoner.js';
import { Match } from './classes/Match.js';
import { Searchbar } from './classes/Searchbar.js';
class App{
    constructor() {
        this.player = null;
        (async () => {
            this.defineMySummoner()
        })();
        
    }
    async defineMySummoner() {
        let div = document.createElement('div');
        div.id = "define_my_summoner";
        let p = document.createElement('p');
        p.innerHTML = "Define your summoner name";
        let input = document.createElement('input');
        input.type = "text";
        input.id = "my_summoner";
        let button = document.createElement('button');
        button.innerHTML = "Define";
        button.addEventListener('click', async () => {
            div.remove();
            await this.init();
            this.player = await Fetch.Player(input.value);
            let header = document.querySelector('header');
            header.appendChild(await this.player.header());
            let main = document.querySelector('main');
            main.appendChild(await this.matchsMenu(this.player.getMatchs()));
            main.appendChild(await this.player.Main());
            div.remove();
            
        })
        div.appendChild(p);
        div.appendChild(input);
        div.appendChild(button);
        document.querySelector('body').appendChild(div);
        
    }
    async init(){
        this.header();
        this.main();
        //this.footer();
    }
    async header(){
        let header = document.createElement('header');
        let h1 = document.createElement('h1');
        h1.innerHTML = 'Li Stats!';
        let searchbar = new Searchbar();

        header.appendChild(h1);
        header.appendChild(searchbar.getform());
        document.body.appendChild(header);
    }
    async main(){
        let main = document.createElement('main');
        document.body.appendChild(main);
    }
    async footer(){
        let footer = document.createElement('footer');
        let p = document.createElement('p');
        p.innerHTML = 'Li Stats! &copy; 2021';
        footer.appendChild(p);
        document.body.appendChild(footer);
    }
    async displayMenu(matchid, li){
        let display_match = document.querySelector('#display_match');
        let display_main = document.querySelector('#display_main');
        let back = document.querySelector('#back');
        if (display_match) {
            display_match.remove();
        }
        if (display_main) {
            display_main.remove();
        }
        if (back) {
            back.remove();
        }
        let match = await Fetch.Match(matchid);
        let div = document.createElement('div');
        div.id = "display_match";
        div.appendChild(await match.div());
        document.querySelector('main').appendChild(div);
        let selected = document.querySelector('#selected');
        if (selected) {
            selected.removeAttribute('id');
        }
        li.id = "selected";
    }
    async matchsMenu(matchs) {
        let div = document.createElement('div');
        div.id = "matchs_menu";
        let ul = document.createElement('ul');
        for (let i = 0; i < matchs.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = matchs[i] 
            li.addEventListener('click', async () => {
                await this.displayMenu(matchs[i], li);
            })
            ul.appendChild(li);
        }
        div.appendChild(ul);
        return div;
    }
        
}
window.addEventListener('load', () => {
    let app = new App();
});