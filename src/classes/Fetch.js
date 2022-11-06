//class to fetch data from the server
import { Summoner } from "./Summoner";
import { stateActionHandler, rateLimitHandler } from "fetch-rate-limit-util";
import { Popup } from "./Popup";
import { LoadingDiv } from "./LoadingDiv";

import { Match } from "./Match";
//class fetch pour simplifier le changement de token
export class Fetch {
    static totalRequests=0;
    static nRequests = 0
    static lastRequest = 0;
    static waiting = 1500;
    static token = "RGAPI-f759e788-9392-449c-b5d4-bfd1b56d8e2a"
    static setToken(token) { Fetch.header = token; }
    static getToken() { return Fetch.header }

    static async FetchData(url) {
        let req = 0
        let data = 0
        try {
            //if the time between the last request and the current request is less than 1.1s, wait for the time to be over
            console.log(Date.now() - Fetch.lastRequest)
            Fetch.waiting=375
            console.log("waiting time", Fetch.waiting)
            //si le temps entre la derniere requete et la requete actuelle est inferieur a 1.1s, attendre que le temps soit depasse
            if (Date.now() - Fetch.lastRequest < Fetch.waiting) {
                console.log("waiting")
                await new Promise(resolve => setTimeout(resolve, Fetch.waiting - (Date.now() - Fetch.lastRequest)));
                console.log("done waiting")
            }
            //if the number of requests is greater than 20, wait for the time to be over
            //si le nombre de requetes est superieur a 20, attendre que le temps soit depasse
            if (Fetch.totalRequests == 3) {
                console.log("waiting for rate limit", Fetch.totalRequests)
                await new Promise(resolve => setTimeout(resolve, 1000));
                Fetch.totalRequests = 0;
                console.log("done waiting")
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
                Fetch.lastRequest = Date.now()
                Fetch.totalRequests++;
                return data;
            }
 
        } catch (error) {
            
            console.log(error);
            if (Fetch.nRequests > 5) {
                Fetch.nRequests--;
                setTimeout(async () => {
                    data = await Fetch.FetchData(url);
                }, 10000)
            }
            else if (error.message == "not found") {
                throw new Error("not found");
            }
            
        }
        
    }
    static async Player(name) {
        LoadingDiv.start();
        let summoner = new Summoner(name);
        try {
            let data = await Fetch.FetchData(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${Fetch.token}`);
            summoner.setPuuid(data.puuid);
            summoner.setAccountId(data.accountId);
            summoner.setSummonerLevel(data.summonerLevel);
            summoner.setProfileIconId(data.profileIconId);
            summoner.setMatchs(await Fetch.listsMatchs(data.puuid, 0, 50));
            LoadingDiv.stop();
            return summoner;
        }
        catch (error) {
            LoadingDiv.stop();
            throw new Error("failed to fetch player data, maybe the player doesn't exist");
        }
        
    }
    static async listsMatchs(puuid, start, count) {
        let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${Fetch.token}`)
        return data;
    }
    static async Username(puuid) {
        let data = await Fetch.FetchData(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${Fetch.token}`)
        return data.name;
    }
    static async Match(id, withTimeline = true) {
        LoadingDiv.start();
        let match = new Match(id);
        try {
            let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${Fetch.token}`)
            if (withTimeline) {
                let timeline = await Fetch.Timeline(id);
                match.setTimeline(timeline);
            }
            match.setInfo(data.info);
            match.setMetadata(data.metadata);
            LoadingDiv.stop();
            return match;
        }  
        catch (error) {
            LoadingDiv.stop();
            throw new Error("failed to fetch match data, maybe the match doesn't exist");
        }
    }
    static async Timeline(matchid) {
        try {
            let data = await Fetch.FetchData(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}/timeline?api_key=${Fetch.token}`)
            return data;
        }
        catch (error) {
            throw new Error("failed to fetch match timeline data, maybe the match doesn't exist");
        }
        
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
    static async calcWaitTime(n) {
        if (n > 20) {
            Fetch.waiting = 0.5*1000;
        }
        if (n > 100) {
            Fetch.waiting = 1.5*1000;
        }
        console.log("waiting time", Fetch.waiting)
    }
}