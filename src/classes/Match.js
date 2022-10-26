import { Summoner } from './Summoner';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { Fetch } from "./Fetch";
export class Match {
    constructor(id) {
        this.id = id;
        this.metadata = {};
        this.info = {};
        this.timeline = {};
    }
    setId(id) { this.id = id; }
    setMetadata(metadata) { this.metadata = metadata; }
    setInfo(info) { this.info = info; }
    setTimeline(timeline) { 
        this.timeline = timeline;
    }
    getId() { return this.id; }
    getMetadata() { return this.metadata; }
    getInfo() { return this.info; }
    getTimeline() { return this.timeline; }
    getParticipants(teamId) {
        let participants = [];
        this.info.participants.forEach(participant => {
            if (participant.teamId == teamId) {
                participants.push(participant);
            }
        })
        return participants;
    }
    isInTeam(participantId, teamId) {
        let participants = this.getParticipants(teamId);
        for (let i = 0; i < participants.length; i++) {
            if (participants[i].participantId == participantId) {
                return true;
            }
        }
        return false;
    }
    getGoldEvolutionOfTeam(teamId) {
        let goldEvolution = [];
        const team = this.getParticipants(teamId);
        this.timeline.info.frames.forEach(frame => {
            let golds = 0;
            for(let i=1;i<11;i++){
                let participant = frame.participantFrames[i];
                if(this.isInTeam(participant.participantId,teamId)){
                    golds+=participant.currentGold;
                }     
            }
            goldEvolution.push(golds);
        })
        return goldEvolution;
    }
    getKillsEvolutionOfTeam(teamId) {
        let killsEvolution = [];
        const team = this.getParticipants(teamId);
        this.timeline.info.frames.forEach(frame => {
            let kills = killsEvolution[killsEvolution.length-1] || 0;
            frame.events.forEach(event => {
                if(event.type=="CHAMPION_KILL"){
                    if(this.isInTeam(event.killerId,teamId)){
                        kills++;
                    }
                }
            })
            killsEvolution.push(kills);
        })
        return killsEvolution;
    }
    getDamageOfParticipants() {
        let damage = [];
        this.info.participants.forEach(participant => {
            damage.push({
                damages:participant.totalDamageDealtToChampions,
                name:participant.championName
            })
        })
        return damage;
    }
    getKillsOfParticipants() {
        let kills = [];
        this.info.participants.forEach(participant => {
            kills.push({
                kills:participant.kills,
                name:participant.championName
            })
        })
        return kills;
    }
    getWardsPlacedOfParticipants() {
        let wardsPlaced = [];
        this.info.participants.forEach(participant => {
            wardsPlaced.push({
                wardsPlaced:participant.wardsPlaced,
                name:participant.championName
            })
        })
        return wardsPlaced;
    }
    getWardsKilledOfParticipants() {
        let wardsKilled = [];
        this.info.participants.forEach(participant => {
            wardsKilled.push({
                wardsKilled:participant.wardsKilled,
                name:participant.championName
            })
        })
        return wardsKilled;
    }
    getLargeStats(){
        let largeStats = [];
        this.info.participants.forEach(participant => {
            largeStats.push({
                name:participant.championName,
                kills:participant.kills,
                deaths:participant.deaths,
                assists:participant.assists,
                totalDamageTaken:participant.totalDamageTaken,
                visionScore:participant.visionScore,
                wardsPlaced:participant.wardsPlaced,
                wardsKilled:participant.wardsKilled,
                totalHeal:participant.totalHeal,
                totalDamageDealt:participant.totalDamageDealt,
                magicDamageDealt:participant.magicDamageDealt,
                physicalDamageDealt:participant.physicalDamageDealt,
                trueDamageDealt:participant.trueDamageDealt,
                magicDamageTaken:participant.magicDamageTaken,
                physicalDamageTaken:participant.physicalDamageTaken,
                trueDamageTaken:participant.trueDamageTaken,
                goldEarned:participant.goldEarned,
                goldSpent:participant.goldSpent,
            })
        })
        return largeStats;
    }       
    async goldTeamGraph(){
        let gold = document.createElement('div')
        gold.id = "match_info_graphs_gold"
        gold.classList.add("graph")
        {
            let gold_title = document.createElement('h3')
            gold_title.innerHTML = "Team Golds during the game"
            let canvas = document.createElement('canvas')
            const blueGolds = this.getGoldEvolutionOfTeam(100)
            const redGolds = this.getGoldEvolutionOfTeam(200)
            const labels = []
            for (let i=0; i<blueGolds.length; i++) {
                labels.push(new Date(this.info.gameCreation+i*60000).toLocaleTimeString())
            }
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Blue Golds',
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        data: blueGolds,
                    },
                    {
                        label: 'Red Golds',
                        backgroundColor: 'red',
                        borderColor: 'red',
                        data: redGolds,
                    }
            ]
            }
            const config = {
                type: 'line',
                data: data,
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            gold.appendChild(gold_title)
            gold.appendChild(canvas)
        }
        return gold
    }
    async killsTeamGraph(){
        let kills = document.createElement('div')
        kills.id = "match_info_graphs_kills"
        kills.classList.add("graph")
        {
            let kills_title = document.createElement('h3')
            kills_title.innerHTML = "Team Kills during the game"
            let canvas = document.createElement('canvas')
            const blueKills = this.getKillsEvolutionOfTeam(100)
            const redKills = this.getKillsEvolutionOfTeam(200)
            const labels = []
            for (let i=0; i<blueKills.length; i++) {
                labels.push(new Date(this.info.gameCreation+i*60000).toLocaleTimeString())
            }
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Blue Total Kills',
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        data: blueKills,
                    },
                    {
                        label: 'Red Total Kills',
                        backgroundColor: 'red',
                        borderColor: 'red',
                        data: redKills,
                    }
            ]
            }
            const config = {
                type: 'line',
                data: data,
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            kills.appendChild(kills_title)
            kills.appendChild(canvas)
        }
        return kills
    }
    async kdaGraph(stats_data){
        let kda = document.createElement('div')
        kda.id = "match_info_graphs_largestats_kda"
        kda.classList.add("graph")
        {
            let canvas = document.createElement('canvas')
            const labels = []
            const data = []
            stats_data.forEach(participant => {
                labels.push(participant.name)
                data.push({
                    kills:participant.kills,
                    deaths:participant.deaths,
                    assists:participant.assists
                })
            })
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Kills',
                            backgroundColor: 'green',
                            borderColor: 'green',
                            data: data.map(participant => participant.kills),
                        },
                        {
                            label: 'Deaths',
                            backgroundColor: 'red',
                            borderColor: 'red',
                            data: data.map(participant => participant.deaths),
                        },
                        {
                            label: 'Assists',
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            data: data.map(participant => participant.assists),
                        }
                    ]
                },
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            kda.appendChild(canvas)
        }
        return kda
    }
    async damageGraph(stats_data){
        let damages = document.createElement('div')
        damages.id = "match_info_graphs_largestats_damages"
        damages.classList.add("graph")
        {
            let canvas = document.createElement('canvas')
            const labels = []
            const data = []
            stats_data.forEach(participant => {
                labels.push(participant.name)
                data.push({
                    totalDamageTaken:participant.totalDamageTaken,
                    totalDamageDealt:participant.totalDamageDealt,
                    magicDamageDealt:participant.magicDamageDealt,
                    physicalDamageDealt:participant.physicalDamageDealt,
                    trueDamageDealt:participant.trueDamageDealt,
                    magicDamageTaken:participant.magicDamageTaken,
                    physicalDamageTaken:participant.physicalDamageTaken,
                    trueDamageTaken:participant.trueDamageTaken,
                })
            })
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Magic Damage Dealt',
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            data: data.map(participant => participant.magicDamageDealt),
                        },
                        {
                            label: 'Physical Damage Dealt',
                            backgroundColor: 'yellow',
                            borderColor: 'yellow',
                            data: data.map(participant => participant.physicalDamageDealt),
                        },
                        {
                            label: 'True Damage Dealt',
                            backgroundColor: 'purple',
                            borderColor: 'purple',
                            data: data.map(participant => participant.trueDamageDealt),
                        },
                        {
                            label: 'Magic Damage Taken',
                            backgroundColor: 'orange',
                            borderColor: 'orange',
                            data: data.map(participant => participant.magicDamageTaken),
                        },
                        {
                            label: 'Physical Damage Taken',
                            backgroundColor: 'brown',
                            borderColor: 'brown',
                            data: data.map(participant => participant.physicalDamageTaken),
                        },
                        {
                            label: 'True Damage Taken',
                            backgroundColor: 'black',
                            borderColor: 'black',
                            data: data.map(participant => participant.trueDamageTaken),
                        }
                    ]
                },
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            damages.appendChild(canvas)
        }
        return damages
    }
    async totalDamageGraph(stats_data){
        let totaldmg = document.createElement('div')
        totaldmg.id = "match_info_graphs_largestats_totaldmg"
        totaldmg.classList.add("graph")
        {
            let canvas = document.createElement('canvas')
            const labels = []
            const data = []
            stats_data.forEach(participant => {
                labels.push(participant.name)
                data.push({
                    totalDamageTaken:participant.totalDamageTaken,
                    totalHeal:participant.totalHeal,
                })
            })
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Damage Taken',
                            backgroundColor: 'red',
                            borderColor: 'red',
                            data: data.map(participant => participant.totalDamageTaken),
                        },
                        {
                            label: 'Total Heal',
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            data: data.map(participant => participant.totalHeal),
                        }
                    ]
                },
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            totaldmg.appendChild(canvas)
        }
        return totaldmg
    }
    async visionGraph(stats_data){
        let vision = document.createElement('div')
        vision.id = "match_info_graphs_largestats_vision"
        vision.classList.add("graph")
        {
            let canvas = document.createElement('canvas')
            const labels = []
            const data = []
            stats_data.forEach(participant => {
                labels.push(participant.name)
                data.push({
                    visionScore:participant.visionScore,
                    wardsPlaced:participant.wardsPlaced,
                    wardsKilled:participant.wardsKilled,
                    visionWardsBoughtInGame:participant.visionWardsBoughtInGame,
                    sightWardsBoughtInGame:participant.sightWardsBoughtInGame,
                })
            })
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Vision Score',
                            backgroundColor: 'green',
                            borderColor: 'green',
                            data: data.map(participant => participant.visionScore),
                        },
                        {
                            label: 'Wards Placed',
                            backgroundColor: 'red',
                            borderColor: 'red',
                            data: data.map(participant => participant.wardsPlaced),
                        },
                        {
                            label: 'Wards Killed',
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            data: data.map(participant => participant.wardsKilled),
                        }
                    ]
                },
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            vision.appendChild(canvas)
        }
        return vision
    }
    async goldGraph(stats_data){
        let golds = document.createElement('div')
        golds.id = "match_info_graphs_largestats_golds"
        golds.classList.add("graph")
        {
            let canvas = document.createElement('canvas')
            const labels = []
            const data = []
            stats_data.forEach(participant => {
                labels.push(participant.name)
                data.push({
                    goldEarned:participant.goldEarned,
                    goldSpent:participant.goldSpent,
                })
            })
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Gold Earned',
                            backgroundColor: 'green',
                            borderColor: 'green',
                            data: data.map(participant => participant.goldEarned),
                        },
                        {
                            label: 'Gold Spent',
                            backgroundColor: 'red',
                            borderColor: 'red',
                            data: data.map(participant => participant.goldSpent),
                        }
                    ]
                },
                options: {}
            }
            const Mychart = new Chart(canvas,config)
            golds.appendChild(canvas)
        }
        return golds
    }
    async largestatsGraph(){
        let stats = document.createElement('div')
        stats.id = "match_info_graphs_largestats"
        let stats_data = this.getLargeStats()
        {
            let stats_header = document.createElement('div')
            stats_header.id = "match_info_graphs_largestats_header"
            {
                let stats_title = document.createElement('h3')
                stats_title.innerHTML = "Advanced Stats"
                let icon = document.createElement('p')
                icon.innerHTML = "+"
                icon.style.fontSize = "30px"
                stats_header.appendChild(stats_title)
                stats_header.appendChild(icon)
                icon.addEventListener('click',async()=>{
                    if(stats_data.length>0){
                        stats_data = []
                        icon.innerHTML = "+"
                        //if graphs are already displayed, remove them
                        if(stats.children.length>1){
                            stats.removeChild(stats.lastChild)
                        }
                    }else{
                        stats_data = this.getLargeStats()
                        icon.innerHTML = "-"
                        let graphs = document.createElement('div')
                        graphs.id = "match_info_graphs_largestats_graphs"
                        {
                            let kda = await this.kdaGraph(stats_data)
                            let damages = await this.damageGraph(stats_data)
                            let totaldmg = await this.totalDamageGraph(stats_data)
                            let vision = await this.visionGraph(stats_data)
                            let golds = await this.goldGraph(stats_data)
                            graphs.appendChild(kda)
                            graphs.appendChild(damages)
                            graphs.appendChild(totaldmg)
                            graphs.appendChild(golds)
                            graphs.appendChild(vision)
                        }
                        stats.appendChild(graphs)
                    }
                })
            }
            stats.appendChild(stats_header)
        }
        return stats
    }
    async div() {
        let div = document.createElement('div');
        div.id = "match_card";
        {
            let header = document.createElement('div')
            header.id = "match_info_header";
            {
                let left = document.createElement('div');
                left.id = "match_info_header_left";
                {
                    let h1 = document.createElement('h1');
                    h1.innerHTML = this.id;
                    let game_mode = document.createElement('p');
                    game_mode.innerHTML = this.info.gameMode;
                    left.appendChild(h1);
                    left.appendChild(game_mode);
                }
                let right = document.createElement('div');
                right.id = "match_info_header_right";
                {
                    let creation = document.createElement('p');
                    creation.innerHTML = new Date(this.info.gameCreation).toLocaleString();
                    let duration = document.createElement('p');
                    duration.innerHTML = new Date(this.info.gameEndTimestamp).toLocaleString();
                    right.appendChild(creation);
                    right.appendChild(duration);
                }
                header.appendChild(left);
                header.appendChild(right);
            }
            let body = document.createElement('div');
            body.id = "match_info_body";
            {
                this.info.teams.forEach(team => {
                    let team_div = document.createElement('div');
                    team_div.id = team.teamId == 100 ? "blue_team" : "red_team";
                    team_div.classList.add('team');
                    {
                        let team_top = document.createElement('div');
                        team_top.id = "team_top";
                        {
                            let team_info = document.createElement('div');
                            team_info.classList.add('team_info');
                            {
                                let team_name = document.createElement('h2');
                                team_name.innerHTML = team.teamId == 100 ? "Blue Team" : "Red Team";
                                let team_win = document.createElement('p');
                                team_win.innerHTML = team.win == true ? "Victory" : "Defeat";
                                team_info.appendChild(team_name);
                                team_info.appendChild(team_win);
                            }
                            let team_bans = document.createElement('div');
                            team_bans.classList.add('team_bans');
                            {
                                let ban_ul = document.createElement('ul');
                                ban_ul.classList.add('ban');
                                {
                                    team.bans.forEach(ban => {
                                        if (ban.championId != -1) {
                                            let ban_li = document.createElement('li');
                                            let ban_img = document.createElement('img');
                                            (async () => {
                                                let res = await Fetch.Champion(ban.championId)
                                                ban_img.src = `http://ddragon.leagueoflegends.com/cdn/12.20.1/img/champion/${res.id}.png`;
                                                ban_li.appendChild(ban_img);
                                            })()
                                            ban_ul.appendChild(ban_li);
                                        }
                                    })
                                }
                                team_bans.appendChild(ban_ul);
                            }
                            team_top.appendChild(team_info);
                            team_top.appendChild(team_bans);
                        }
                        let team_players = document.createElement('div');
                        team_players.classList.add('team_players');
                        {
                            let player_ul = document.createElement('ul');
                            player_ul.classList.add('player');
                            let team_participants = this.getParticipants(team.teamId)
                            team_participants.forEach(participant => {
                                let player_li = document.createElement('li')
                                player_li.classList.add('participant_card')
                                {
                                    let champion = document.createElement('div');
                                    champion.classList.add('champion');
                                    {
                                        let champion_img = document.createElement('img');
                                        champion_img.src = `http://ddragon.leagueoflegends.com/cdn/12.20.1/img/champion/${participant.championName != "FiddleSticks" ? participant.championName : "Fiddlesticks"}.png`;
                                        let champion_name = document.createElement('p');
                                        champion_name.innerHTML = participant.championName;
                                        let champion_level = document.createElement('p');
                                        champion_level.innerHTML = participant.champLevel;
                                        champion.appendChild(champion_img);
                                        champion.appendChild(champion_name);
                                        champion.appendChild(champion_level);
                                    }
                                    let summoner = document.createElement('div');
                                    summoner.classList.add('summoner');
                                    {
                                        let top = document.createElement('div');
                                        top.classList.add('top');
                                        {
                                            let left = document.createElement('div');
                                            left.classList.add('left');
                                            {
                                                let summoner_name = document.createElement('h3');
                                                summoner_name.innerHTML = participant.summonerName;
                                                let cs = document.createElement('p');
                                                cs.innerHTML = `${participant.totalMinionsKilled} CS`;
                                                left.appendChild(summoner_name);
                                                left.appendChild(cs);
                                                summoner_name.addEventListener('click', async () => {
                                                    let display_match = document.getElementById('display_match');
                                                    let li_selected = document.getElementById('selected');
                                                    if (li_selected) {
                                                        li_selected.id = "";
                                                    }
                                                    display_match.style.display = "none";
                                                    let d = document.createElement('div');
                                                    {
                                                        let summoner = await Fetch.Player(participant.summonerName);
                                                        let summoner_display = await summoner.Main()
                                                        summoner_display.id = "display_main";
                                                        let back = document.createElement('p');
                                                        back.id = "back";
                                                        back.innerHTML = "<- Back";
                                                        back.addEventListener('click', () => {
                                                            summoner_display.remove();
                                                            display_match.style.display = "block";
                                                            back.remove();
                                                        })
                                                        let main = document.querySelector('main');
                                                        let summoner_display_header = summoner_display.querySelector('#display_main_header');
                                                        summoner_display_header.appendChild(back);
                                                        main.appendChild(summoner_display);
                                                    }
                                                    
                                                })
                                            }
                                            let kda = document.createElement('p');
                                            kda.innerHTML = `${participant.kills}/${participant.deaths}/${participant.assists}`;
                                            top.appendChild(left);
                                            top.appendChild(kda);
                                        }
                                        let bottom = document.createElement('div')
                                        bottom.classList.add('bottom');
                                        {
                                            let items = document.createElement('div');
                                            items.classList.add('items');
                                            {
                                                let item_ul = document.createElement('ul');
                                                item_ul.classList.add('item');
                                                {
                                                    let items = [participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5, participant.item6]
                                                    items.forEach(item => {
                                                        if (item) {
                                                            let item_li = document.createElement('li');
                                                            let item_img = document.createElement('img');
                                                            item_img.src = `http://ddragon.leagueoflegends.com/cdn/12.20.1/img/item/${item}.png`;
                                                            item_li.appendChild(item_img);
                                                            item_ul.appendChild(item_li);
                                                        }
                                                    })
                                                }
                                                items.appendChild(item_ul);
                                            }
                                            bottom.appendChild(items);
                                        }
                                        summoner.appendChild(top);
                                        summoner.appendChild(bottom);
                                    }
                                    player_li.appendChild(champion);
                                    player_li.appendChild(summoner);
                                }
                                player_ul.appendChild(player_li);
                            })
                            team_players.appendChild(player_ul);
                        }
                        team_div.appendChild(team_top);
                        team_div.appendChild(team_players);

                    }
                    body.appendChild(team_div);
                })
                
            }
            let graphs = document.createElement('div')
            graphs.id = "match_info_graphs"
            graphs.style.display = "flex"
            //display graphs in column
            {
                let golds = await this.goldTeamGraph()
                graphs.appendChild(golds)
                let kills = await this.killsTeamGraph()
                graphs.appendChild(kills)
                let stats = await this.largestatsGraph()
                graphs.appendChild(stats)
            }
            div.appendChild(header);
            div.appendChild(body);
            div.appendChild(graphs)
        }
        
        

        return div;
    }
}