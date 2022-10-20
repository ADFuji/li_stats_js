import '../src/stylesheets/main.scss'
import { Fetch } from './classes/Fetch.js'
import { Summoner } from './classes/Summoner.js';
import { Match } from './classes/Match.js';
class App{
    constructor() {
        this.player = new Summoner("ADFujiGang");
        (async () => {
            this.player = await Fetch.Player(this.player.getName())
            let header = document.querySelector('header');
            header.appendChild(await this.player.div());
            let main = document.querySelector('main');
            main.appendChild(await this.matchsMenu(this.player.getMatchs()))
            let first_match = await Fetch.Match(this.player.getMatchs()[0]);
            let div = document.createElement('div');
            div.id = "display_match";
            div.appendChild(await first_match.div());
            document.querySelector('main').appendChild(div);
            console.log(this.match);
            
        })();
        this.init();
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
        header.appendChild(h1);
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
    async matchsMenu(matchs) {
        let div = document.createElement('div');
        div.id = "matchs_menu";
        let ul = document.createElement('ul');
        for (let i = 0; i < matchs.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = matchs[i] 
            li.addEventListener('click', async () => {
                let display_match = document.querySelector('#display_match');
                if (display_match) {
                    display_match.remove();
                }
                let match = await Fetch.Match(matchs[i]);
                let div = document.createElement('div');
                div.id = "display_match";
                div.appendChild(await match.div());
                document.querySelector('main').appendChild(div);
            

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