//class to fetch data from the server
import { Summoner } from "./Summoner";
import { stateActionHandler, rateLimitHandler } from "fetch-rate-limit-util";

import { Match } from "./Match";
//class fetch pour simplifier le changement de token
export class Fetch {
    static tt=0;
    static nRequests = 0
    static lastNRequest = Fetch.nRequests;
    static requests = []

    static token = "RGAPI-f759e788-9392-449c-b5d4-bfd1b56d8e2a"
    static setToken(token) { Fetch.header = token; }
    static getToken() { return Fetch.header }

    static async FetchData(url) {
        let req = 0
        let data = 0
        try {
            if (Fetch.nRequests > 20) {
                throw new Error("rate limit")
            }
            Fetch.nRequests++;
            //fetch url and return json if ok else throw error
            req = await fetch(url);
            if (req.status == 429) {
                throw new Error("rate limit");
            }
            else if (req.status == 404) {
                throw new Error("not found");
            }
            if (req.status == 200) {
                data = await req.json();
                Fetch.nRequests--;
                return data;
            }
 
        } catch (error) {
            console.log(error);
            if (error.message == "rate limit") {
                Fetch.nRequests--;
                setTimeout(async () => {
                    data = await Fetch.FetchData(url);
                }, 10000)
            }
            else if (error.message == "not found") {
                return null;
            }
            
        }
        
    }
    static async Player(name) {
        let summoner = new Summoner(name);
        try {
            let data = await Fetch.FetchData(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${Fetch.token}`);
            if(data == null){
                throw new Error("not found");
            }
            else {
                summoner.setPuuid(data.puuid);
                summoner.setAccountId(data.accountId);
                summoner.setSummonerLevel(data.summonerLevel);
                summoner.setProfileIconId(data.profileIconId);
                summoner.setMatchs(await Fetch.listsMatchs(data.puuid, 0, 50));
            }
        }
        catch (error) {
            console.log(error);
        }
        
        return summoner;
    }
    static async listsMatchs(puuid, start, count) {
        let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${Fetch.token}`)
        return data;
    }
    static async Username(puuid) {
        let data = await Fetch.FetchData(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${Fetch.token}`)
        return data.name;
    }
    static async Match(id, opt=1) {
        let match = new Match(id);
        let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${Fetch.token}`)
        if (opt) {
            let timeline = await Fetch.Timeline(id);
            match.setTimeline(timeline);
        }
        match.setInfo(data.info);
        match.setMetadata(data.metadata);
        return match;
    }
    static async ListMatch(ids) {
        let matchs = [];
        for (let i = 0; i < ids.length; i++) {
            Fetch.Match(ids[i]).then((match) => {
                matchs.push(match);
            })

        }
        return await Promise.all(matchs);
    }
    static async Timeline(matchid){
        let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}/timeline?api_key=${Fetch.token}`)
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