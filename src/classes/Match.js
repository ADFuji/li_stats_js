//league of legends party
import { Fetch } from "./Fetch";
export class Match {
    constructor(id) {
        this.id = id;
        this.metadata = {};
        this.info = {};
    }
    setId(id) { this.id = id; }
    setMetadata(metadata) { this.metadata = metadata; }
    setInfo(info) { this.info = info; }
    getId() { return this.id; }
    getMetadata() { return this.metadata; }
    getInfo() { return this.info; }

    async div() {
        //display id, teams
        let div = document.createElement('div');
        div.id = "match_card";
        let p = document.createElement('p');
        p.innerHTML = this.id;
        div.appendChild(p);
        let blue = document.createElement('ul');
        blue.id = "blue_team";
        let red = document.createElement('ul');
        red.id = "red_team";
        this.info.participants.forEach(async (participant) => {
            let li = document.createElement('li');
            li.innerHTML = (participant.puuid !== "BOT") ? await Fetch.Username(participant.puuid) : participant.summonerName;
            let team = participant.teamId;
            if (team === 100) {
                blue.appendChild(li);
            } else {
                red.appendChild(li);
            }
        });
        div.appendChild(blue);
        div.appendChild(red);
        return div;
    }
}