//league of legends player
import { Fetch } from "./Fetch";
import { CircleProgress } from "./CircleProgress";
export class Summoner {
    constructor(name) {
        this.name = name;
        this.accountId = "";
        this.id = "";
        this.puuid = "";
        this.summonerLevel = "";
        this.profileIconId = "";
    }
    setName(name) { this.name = name; }
    setAccountId(accountId) { this.accountId = accountId; }
    setId(id) { this.id = id; }
    setPuuid(puuid) { this.puuid = puuid; }
    setSummonerLevel(summonerLevel) { this.summonerLevel = summonerLevel; }
    setProfileIconId(id) { this.profileIconId = id; }
    setMatchs(matchs) { this.matchs = matchs; }
    getName() { return this.name; }
    getAccountId() { return this.accountId; }
    getId() { return this.id; }
    getPuuid() { return this.puuid; }
    getSummonerLevel() { return this.summonerLevel; }
    getProfileIconId() { return this.profileIconId; }
    getMatchs() { return this.matchs; }
    isInBlueTeam(match) {
        let blueTeam = match.info.participants.filter((participant) => {
            return participant.teamId == 100;
        })
        let ret = false
        blueTeam.forEach((participant) => {
            if(participant.puuid == this.puuid){
                ret = true
            }
        })
        return ret
    }
    callback(data) {
        console.log("callback", data);
        this.setAccountId(data.accountId)
        this.setId(data.id)
        this.setPuuid(data.puuid)
        this.setSummonerLevel(data.summonerLevel)
        console.log(this)
    }
    async header() {
        let div = document.createElement('div');
        div.id = "player_card";
        let p = document.createElement('p');
        p.innerHTML = this.name;
        p.addEventListener('click', async () => {
            let display_match = document.querySelector('#display_match');
            let display_main = document.querySelector('#display_main');
            let li_selected = document.querySelector('#selected');
            if (display_match) {
                display_match.remove();
            }
            if (display_main) {
                display_main.remove();
            }
            if (li_selected) {
                li_selected.removeAttribute('id');
            }
            let main = document.querySelector('main');
            main.appendChild(await this.Main());
        })
        let img = document.createElement('img');
        console.log(this.profileIconId)
        img.src = "http://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/" + this.profileIconId + ".png";
        div.appendChild(p);
        div.appendChild(img);
        return div;
    }
    async Main() {
        let div = document.createElement('div');
        div.id = "display_main";
        {
            let header = document.createElement('div');
            header.id = "display_main_header";
            {
                let img = document.createElement('img');
                img.src = "http://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/" + this.profileIconId + ".png";
                let d = document.createElement('div');
                {
                    let h2 = document.createElement('h2');
                    h2.innerHTML = this.name;
                    let p = document.createElement('p');
                    p.innerHTML = "Level : " + this.summonerLevel;
                    d.appendChild(h2);
                    d.appendChild(p);
                }
                
                header.appendChild(img);
                header.appendChild(d);
            }
            let main = document.createElement('div');
            main.id = "display_main_main";
            {
                let kda_list = document.createElement('ul');
                kda_list.id = "kda_list";
                kda_list.classList.add('module');
                let matchs_list = /*15 first maths in this.matchs*/ this.matchs.slice(0, 5);
                console.log(matchs_list)
                let matchs_data = []
                for (let i = 0; i < matchs_list.length; i++) {
                    matchs_data.push(await Fetch.Match(matchs_list[i]));
                }
                let victory = 0;
                let defeat = 0;
                let winrate = 0;
                let kda_ratio = 0;
                matchs_data.forEach(async (match) => {
                    //Calcul winrate
                    {
                        if(this.isInBlueTeam(match)&&match.info.teams[0].win){
                            victory++
                        }
                        else{
                            defeat++
                        }
                        winrate = victory/(victory+defeat)*100
                    }
                    //display kda
                    {
                        let li = document.createElement('li');
                        let participant = match.info.participants.filter((participant) => {
                            return participant.puuid == this.puuid;
                        })[0];
                        let kda = participant.kills + "/" + participant.deaths + "/" + participant.assists;
                        li.innerText = kda
                        kda_list.appendChild(li);
                        console.log(kda_ratio)
                        kda_ratio += (participant.kills/ participant.deaths) + (participant.assists / participant.deaths);
                    }

                })
                kda_ratio = Math.round((kda_ratio / matchs_data.length) * 100) / 100;
                let p_kda = document.createElement('p');
                p_kda.classList.add('module');
                p_kda.innerHTML = "KDA : " + kda_ratio;

                let WinrateProgress = new CircleProgress({
                    radius: 100,
                    value: winrate,
                    maxValue: 100,
                    width: 15,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    text: function (value) {
                        return `Winrate:\n${value}%`;
                    }
                })
                let CircleProgressDiv = document.createElement('div');
                CircleProgressDiv.id = "CircleProgressDiv";
                {
                    let div = [new CircleProgress({
                        radius: 100,
                        value: winrate,
                        maxValue: 100,
                        width: 15,
                        color: '#FFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `Winrate:\n${value}%`;
                        }
                    }).div(),
                    new CircleProgress({
                        radius: 100,
                        value: winrate,
                        maxValue: 100,
                        width: 15,
                        color: '#FFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `Winrate:\n${value}%`;
                        }
                    }).div(),
                    new CircleProgress({
                        radius: 100,
                        value: winrate,
                        maxValue: 100,
                        width: 15,
                        color: '#FFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `Winrate:\n${value}%`;
                        }
                    }).div(),]
                    
                    CircleProgressDiv.appendChild(WinrateProgress.div());
                    CircleProgressDiv.appendChild(div[0]);
                    CircleProgressDiv.appendChild(div[1]);

                }
                main.appendChild(CircleProgressDiv);
                main.appendChild(p_kda);
                main.appendChild(kda_list)
                let p = document.createElement('p');
                p.innerHTML = "Matchs :azdddddddddddddddddddddddddddddddddddddddddddddddd " + this.matchs.length;
                main.appendChild(p);
                let p1 = document.createElement('p');
                p1.innerHTML = "Matchs :azdddddddddddddddddddddddddddddddddddddddddddddddd " + this.matchs.length;
                main.appendChild(p1);
            }
            div.appendChild(header);
            div.appendChild(main);
        }
        return div;
    }
}