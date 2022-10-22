//class to fetch data from the server
import { Summoner } from "./Summoner";
import { Match } from "./Match";
//class fetch pour simplifier le changement de token
export class Fetch {
    static token = "RGAPI-8b6f2ff7-9335-49c3-9fe4-a51ce1696ca7"
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
        req = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${player.getPuuid()}/ids?start=0&count=50&api_key=${Fetch.token}`)
        data = await req.json();
        player.setMatchs(data);
        return player;
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
        match.setInfo(data.info);
        match.setMetadata(data.metadata);
        return match;
    }
    static async Champion(id) {
        let req = await fetch(`http://ddragon.leagueoflegends.com/cdn/12.20.1/data/en_US/champion.json`)
        let data = await req.json();
        //find the champion in the json
        console.log(data)
        for (let key in data.data) {
            if (data.data[key].key == id) {
                return data.data[key];
            }
        }
    }
}