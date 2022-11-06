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
        await this.header();
        let div = document.createElement('div');
        div.id = "define_my_summoner";
        let description = document.createElement('div');
        description.id = "description";
        {
            let yummi = document.createElement('img');
            yummi.src = "./img/yummi.png";
            let wils = document.createElement('h2');
            wils.innerHTML = "What is Li Stats?";
            let wilsp = document.createElement('p');
            wilsp.innerHTML = "Li Stats is an application to see our stats in League of Legends.</br>With that u can see details about your matchs and your stats in general.";
            let hiw = document.createElement('h2');
            hiw.innerHTML = "How it works?";
            let hiwp = document.createElement('p');
            hiwp.innerHTML = "To use Li Stats, you need to have a Riot Games account and a League of Legends account. Then you need to type your summoner name in the search bar and click on the submit button.</br>After that you will be redirected to your stats page.";
            hiwp.innerHTML += ", on your stats page you can see your stats in general and your matchs";
            hiwp.innerHTML += "</br></br>Ps: If you don't know your summoner name, you can find it in the League of Legends client.";

            
            description.appendChild(wils);
            description.appendChild(wilsp);
            description.appendChild(hiw);
            description.appendChild(hiwp);
            description.appendChild(yummi);
        }
        let _div = document.createElement('div');
        _div.id = "form";
        {
            let h2 = document.createElement('h2');
            h2.innerHTML = "Define your Summoner name";
            let form = document.createElement('form');
            let input = document.createElement('input');
            input.type = "text";
            input.id = "my_summoner";
            input.placeholder = "My Super Summoner Name";
            let button = document.createElement('button');
            button.innerHTML = "Submit";
            button.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    if (document.querySelector('#s-error')) {
                        document.querySelector('#s-error').remove();
                    }
                    this.player = await Fetch.Player(input.value);
                    div.remove();
                    await this.init();
                    let header = document.querySelector('header');
                    header.appendChild(await this.player.header());
                    let main = document.querySelector('main');
                    main.appendChild(await this.matchsMenu(this.player.getMatchs()));
                    main.appendChild(await this.player.Main());
                    
                }
                catch (e) {
                    console.log("form", e);
                    //add error message on form
                    let diverror = document.createElement('div');
                    diverror.id = "s-error";
                    diverror.innerHTML = "<p>Summoner not found</p>";
                    form.appendChild(diverror);
                }
                
                
                    
            })
            form.appendChild(input);
            form.appendChild(button);
            _div.appendChild(h2);
            _div.appendChild(form);
        }
        div.appendChild(description);
        div.appendChild(_div);
        document.querySelector('body').appendChild(div);
        
    }
    async init(){
        this.searchbar();
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
    async searchbar() {
        let header = document.querySelector('header');
        let searchbar = new Searchbar();
        header.appendChild(searchbar.getform());
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