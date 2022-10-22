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
    getParticipants(teamId) {
        let participants = [];
        this.info.participants.forEach(participant => {
            if (participant.teamId == teamId) {
                participants.push(participant);
            }
        })
        return participants;
    }
    async div() {
        console.log(this.info);
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
                                    console.log(team.bans);
                                    team.bans.forEach(ban => {
                                        console.log(ban);
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
            div.appendChild(header);
            div.appendChild(body);
        }


        return div;
    }
}