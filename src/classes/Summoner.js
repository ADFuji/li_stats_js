//league of legends player
import { Fetch } from "./Fetch";
export class Summoner {
    constructor(name) {
        this.name = name;
        this.accountId = "";
        this.id = "";
        this.puuid = "";
        this.summonerLevel = "";
        this.profileIconId = "";
        /*this.data = async () => {
            let player = await Fetch.FetchData(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${this.name}?`);
            this.accountId = player.accountId;
            this.id = player.id;
            this.puuid = player.puuid;
            this.summonerLevel = player.summonerLevel;
            this.profileIconId = player.profileIconId;
            this.matchs = await Fetch.FetchData('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/JNyR6iw4QNtvnZfhuxsb1sMDrZFztscNMH9bbSH9KBG0iRKZUDuL7o-DBAZ_hgn3umpwMwO6zSkDpg/ids?start=0&count=50&')
            this.card = await this.card();
        }
        this.data = this.data();*/
    }
    setName(name) { this.name = name; }
    setAccountId(accountId) { this.accountId = accountId; }
    setId(id) { this.id = id; }
    setPuuid(puuid) { this.puuid = puuid; }
    setSummonerLevel(summonerLevel) { this.summonerLevel = summonerLevel; }
    setMatchs(matchs) { this.matchs = matchs; }
    getName() { return this.name; }
    getAccountId() { return this.accountId; }
    getId() { return this.id; }
    getPuuid() { return this.puuid; }
    getSummonerLevel() { return this.summonerLevel; }
    getMatchs() { return this.matchs; }
    callback(data) {
        console.log("callback", data);
        this.setAccountId(data.accountId)
        this.setId(data.id)
        this.setPuuid(data.puuid)
        this.setSummonerLevel(data.summonerLevel)
        console.log(this)
    }
    async div() {
        let div = document.createElement('div');
        div.id = "player_card";
        let p = document.createElement('p');
        p.innerHTML = this.name;
        div.appendChild(p);
        return div;
    }
}