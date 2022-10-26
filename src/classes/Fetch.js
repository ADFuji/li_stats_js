//class to fetch data from the server
import { Summoner } from "./Summoner";
import { Match } from "./Match";
//class fetch pour simplifier le changement de token
export class Fetch {
    static token = "RGAPI-aaad1747-2b4d-40dd-a732-42bc7657d2a0"
    static setToken(token) { Fetch.header = token; }
    static getToken() { return Fetch.header }
    static async  FetchData(url) {
        return fetch(`${url}api_key=${Fetch.token}`, {
            method: 'GET',
            headers: Fetch.header
        }).then(response => response.json());
    }
    static async Player(name) {
        let player = new Summoner(name);
        let req = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${Fetch.token}`)
        let data = await req.json();
        player.setAccountId(data.accountId);
        player.setId(data.id);
        player.setPuuid(data.puuid);
        player.setSummonerLevel(data.summonerLevel);
        player.setProfileIconId(data.profileIconId);
        let matchs = await Fetch.listsMatchs(player.getPuuid(),0, 50);
        player.setMatchs(matchs);
        return player;
    }
    static async listsMatchs(puuid, start, count) {
        let req = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${Fetch.token}`)
        let data = await req.json();
        return data;
    }
    static async Username(puuid) {
        let res = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${Fetch.token}`)
        let data = await res.json();
        return data.name;
    }
    static async Match(id) {
        let match = new Match(id);
        let req = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${Fetch.token}`)
        let data = await req.json();
        let timeline = await Fetch.Timeline(id);
        match.setInfo(data.info);
        match.setMetadata(data.metadata);
        match.setTimeline(timeline);
        return match;
    }
    static async Timeline(matchid){
        let req = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}/timeline?api_key=${Fetch.token}`)
        let data = await req.json();
        return data;
    }
    static async Champion(id) {
        let req = await fetch(`http://ddragon.leagueoflegends.com/cdn/12.20.1/data/en_US/champion.json`)
        let data = await req.json();

        for (let key in data.data) {
            if (data.data[key].key == id) {
                return data.data[key];
            }
        }
    }
}