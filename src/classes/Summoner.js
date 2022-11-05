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
    //écris une fonction qui prend en paramètre un tableau de matchs et qui renvoie un tableau de champion joué trié par pourcentage de victoire
    getChampionPlayed(matchs) {
        let championPlayed = [];
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            //on regarde si le champion est déjà dans le tableau
            let champion = championPlayed.filter((champion) => {
                return champion.championId == participant[0].championId;
            })
            //si le champion n'est pas dans le tableau on l'ajoute
            if (champion.length == 0) {
                championPlayed.push({
                    championName: participant[0].championName,
                    championId: participant[0].championId,
                    kills: participant[0].kills,
                    deaths: participant[0].deaths,
                    assists: participant[0].assists,
                    win: (participant[0].win | 0),
                    played: 1
                });
            }
            //sinon on incrémente le nombre de victoire ou de défaite
            else {
                champion[0].played++;
                champion[0].win += participant[0].win;
                champion[0].kills += participant[0].kills;
                champion[0].deaths += participant[0].deaths;
                champion[0].assists += participant[0].assists;
            }
        })
        championPlayed = championPlayed.sort((a, b) => {
            return (b.win / b.played) - (a.win / a.played);
        })
        return championPlayed.slice(0, 5);
    }
    //écris une fonction qui prend en paramètre un tableau de matchs et qui renvoie le kda moyen du joueur
    getKdaAverage(matchs) {
        let kda = [];
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            kda.push((participant[0].kills / participant[0].deaths) + (participant[0].assists / participant[0].deaths));
        })
        let kdaAverage = kda.reduce((a, b) => a + b, 0) / kda.length;
        kdaAverage = kdaAverage.toFixed(2);
        return kdaAverage;
    }
    //écris une fonction qui prend en paramètre un tableau de matchs et qui renvoie le winrate du joueur
    getWinrate(matchs) {
        let win = 0;
        let lose = 0;
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            if (participant[0].win) {
                win++;
            }
            else {
                lose++;
            }
        })
        let winrate = win / (win + lose) * 100;
        return winrate;
    }
    //écris une fonction qui prend en paramètre un tableau de matchs et qui renvoie le score de vision en pourcentage du joueur
    getVisionScore(matchs) {
        let visionScore = [];
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            visionScore.push(participant[0].visionScore+participant[0].visionWardsBoughtInGame+participant[0].wardsPlaced+participant[0].wardsKilled);
        })
        let visionScoreAverage = visionScore.reduce((a, b) => a + b, 0) / visionScore.length;
        return visionScoreAverage;
    }
    //écris une fonction qui prend en paramètre un tableau de matchs et qui renvoie une balise p avec "Tu es raciste" si le joueur a joué teemo
    getRacist(matchs) {
        let racist = false;
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            if (participant[0].championName == "Teemo") {
                racist = true;
            }
        })
        if (racist) {
            let p = document.createElement('p');
            p.innerHTML = "Tu es raciste.";
            p.classList.add('module')
            return p;
        }
    }
    getQualities(matchs) {
        let stats = {
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            totalVisionScore: 0,
            totalWin: 0,
            totalPlayed: 0,
            totalChampionPlayed: []
        }
        matchs.forEach((match) => {
            let participant = match.info.participants.filter((participant) => {
                return participant.puuid == this.puuid;
            })
            stats.totalKills += participant[0].kills;
            stats.totalDeaths += participant[0].deaths;
            stats.totalAssists += participant[0].assists;
            stats.totalVisionScore += participant[0].visionScore + participant[0].visionWardsBoughtInGame + participant[0].wardsPlaced + participant[0].wardsKilled;
            stats.totalPlayed++;
            if (participant[0].win) {
                stats.totalWin++;
            }
            let champion = stats.totalChampionPlayed.filter((champion) => {
                return champion.championId == participant[0].championId;
            })
            if (champion.length == 0) {
                stats.totalChampionPlayed.push(participant[0].championName);
            }
        })
        let qualities = []
        if (stats.totalKills / stats.totalPlayed > 25) {
            qualities.push({
                category: "Kills",
                name: "C'est un tueur",
                description: "Arrête de jouer à League of Legends, laisse nous tranquille."
            });
        }
        else if (stats.totalKills / stats.totalPlayed > 15) {
            qualities.push({
                category: "Kills",
                name: "Assassin's Creed",
                description: "Oh le tacle assassin !"
            });
        }
        else if (stats.totalKills / stats.totalPlayed > 10) {
            qualities.push({
                category: "Kills",
                name: "Mouais, c'est pas mal",
                description: "Il est pas mauvais, mais il peut faire mieux."
            });
        }
        else if (stats.totalKills / stats.totalPlayed > 5) {
            qualities.push({
                category: "Kills",
                name: "C'est un noob",
                description: "Il essaye, c'est déjà pas mal."
            });
        }
        else {
            qualities.push({
                category: "Kills",
                name: "C'est désespérant",
                description: "Il est vraiment mauvais, il ne mérite même pas d'être banni."
            });
        }
        if (stats.totalDeaths / stats.totalPlayed > 30) {
            qualities.push({
                category: "Deaths",
                name: "Il est un suicidaire",
                description: "Il a plus de 30 morts en moyenne par partie, je pense qu'il est fer."
            });
        }
        else if (stats.totalDeaths / stats.totalPlayed > 25) {
            qualities.push({
                category: "Deaths",
                name: "Ca commence à faire beaucoup",
                description: "il est vraiment mauvais."
            });
        }
        else if (stats.totalDeaths / stats.totalPlayed > 20) {
            qualities.push({
                category: "Deaths",
                name: "Il est mauvais",
                description: "Il est mauvais, mais il peut faire mieux."
            });
        }
        else if (stats.totalDeaths / stats.totalPlayed > 10) {
            qualities.push({
                category: "Deaths",
                name: "Il n'est pas mauvais",
                description: "Il est dans la moyenne."
            });
        }
        else if (stats.totalDeaths / stats.totalPlayed > 5) {
            qualities.push({
                category: "Deaths",
                name: "Il fuit la mort",
                description: "Sois c'est une zoulette, soit il est vraiment bon."
            });
        }
        else {
            qualities.push({
                category: "Deaths",
                name: "Dieu ?",
                description: "Le poto est immortel."
            });
        }
        if (stats.totalAssists / stats.totalPlayed > 50) {
            qualities.push({
                category: "Assists",
                name: "Le support fou",
                description: "Il est vraiment bon, il est le meilleur support du monde."
            });
        }
        else if (stats.totalAssists / stats.totalPlayed > 40) {
            qualities.push({
                category: "Assists",
                name: "Tu joues quel rôle ?",
                description: "Soit il se fait ks, soit c'est un bon support."
            });
        }
        else if (stats.totalAssists / stats.totalPlayed > 30) {
            qualities.push({
                category: "Assists",
                name: "LE support",
                description: "Bon, il a aucun stuff, mais c'est pour le bien de l'équipe."
            });
        }
        else if (stats.totalAssists / stats.totalPlayed > 20) {
            qualities.push({
                category: "Assists",
                name: "C'est plutôt legit",
                description: "Il est pas mauvais..."
            });
        }
        else if (stats.totalAssists / stats.totalPlayed > 10) {
            qualities.push({
                category: "Assists",
                name: "Joueur lambda",
                description: "Il est dans la moyenne."
            });
        }
        else if (stats.totalAssists / stats.totalPlayed > 5) {
            qualities.push({
                category: "Assists",
                name: "Mais t'es où ?",
                description: "Pas là..."
            });
        }
        else {
            qualities.push({
                category: "Assists",
                name: "L'égo",
                description: "Il est beaucoup trop fort pour aider ses coéquipiers, ou il est afk."
            });
        }
        if (stats.totalVisionScore / stats.totalPlayed > 25) {
            qualities.push({
                category: "Vision",
                name: "Il est un visionnaire",
                description: "Il a plus de 25 points de vision en moyenne par partie, ca se voit qu'il stream Bigflo et Oli."
            });
        }
        else if (stats.totalVisionScore / stats.totalPlayed > 15) {
            qualities.push({
                category: "Vision",
                name: "Il est un bon visionnaire",
                description: "Il a plus de 15 points de vision en moyenne par partie, il est vraiment bon."
            });
        }
        else if (stats.totalVisionScore / stats.totalPlayed > 5) {
            qualities.push({
                category: "Vision",
                name: "Le mec joue top",
                description: "Vous l'avez déjà vu poser une ward ?"
            });
        }
        else {
            qualities.push({
                category: "Vision",
                name: "Il est aveugle",
                description: "ou alors il joue contre des bots."
            });
        }
        if (stats.totalWin / stats.totalPlayed > 0.8) {
            qualities.push({
                category: "Winrate",
                name: "Il est un dieu!",
                description: "Il a plus de 80% de winrate, il est vraiment bon."
            });
        }
        else if (stats.totalWin / stats.totalPlayed > 0.6) {
            qualities.push({
                category: "Winrate",
                name: "Beau chiffre",
                description: "Au moins 60cm de long."
            });
        }
        else if (stats.totalWin / stats.totalPlayed > 0.4) {
            qualities.push({
                category: "Winrate",
                name: "Classique",
                description: "Au kébab, il prend galette, STO, sauce blanche et frites à part."
            });
        }
        else if (stats.totalWin / stats.totalPlayed > 0.2) {
            qualities.push({
                category: "Winrate",
                name: "Soit tu troll trop, soit t'es un géni incompris",
                description: "Il a moins de 40% de winrate, il est vraiment mauvais."
            });
        }
        else {
            qualities.push({
                category: "Winrate",
                name: "Mais sinon... tu travailles ?",
                description: "Il a moins de 20% de winrate, il est vraiment mauvais."
            });
        }
        if (stats.totalChampionPlayed.length > 10) {
            qualities.push({
                category: "Troll",
                name: "Il est un champion",
                description: `Il a joué ${stats.totalChampionPlayed.length} champions, il est vraiment OMAX`
            });
        }
        //si il a déjà joué teemo
        if (stats.totalChampionPlayed.includes("Teemo")) {
            qualities.push({
                category: "Troll",
                name: "Il est raciste",
                description: "Il joue teemo"
            });
        }
        if (this.name === "ADFujiGang") {
            qualities.push({
                category: "Troll",
                name: "Streamez Sheldon",
                description: "🤍🤍🤍🤍🤍"
            });
        }
        let soixantequinze = ["jirrandrid", "Huuundiiij"]
        if (soixantequinze.includes(this.name)) {
            qualities.push({
                category: "Troll",
                name: "Membre de la 75e session",
                description: "Des gens incroyables."
            });
        }
        if (qualities.length > 6) {
            qualities.push({
                category: "Troll",
                name: "Wow, soit il est un génie, soit il claqué",
                description: "Il a plus de 6 qualités, c'est incroyable."
            });
        }
        return qualities;
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
                let matchs = ((matchs, n) => {
                    let res = []
                    for (let i = 0; i < n; i++) {
                        res.push(matchs[i]);
                    }
                    return res
                }) (this.matchs, 5)
                let matchs_list = matchs.splice(0, 5);
                console.log(matchs_list)
                let matchs_data = []
                for (let i = 0; i < matchs_list.length; i++) {
                    matchs_data.push(await Fetch.Match(matchs_list[i], false));
                }
                let CircleProgressDiv = document.createElement('div');
                CircleProgressDiv.id = "CircleProgressDiv";
                {
                    let WinrateProgress = new CircleProgress({
                        radius: 100,
                        value: this.getWinrate(matchs_data),
                        maxValue: 100,
                        width: 15,
                        color: 'lightgray',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `Winrate:\n${value}%`;
                        }
                    })
                    let KdaProgress = new CircleProgress({
                        radius: 100,
                        value: this.getKdaAverage(matchs_data),
                        maxValue: 50,
                        width: 15,
                        color: 'lightpink',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `KDA:\n${value}`;
                        }
                    })
                    let VisionScoreProgress = new CircleProgress({
                        radius: 100,
                        value: this.getVisionScore(matchs_data),
                        maxValue: 50,
                        width: 15,
                        color: 'lightblue',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        text: function (value) {
                            return `Vision Score:\n${value}`;
                        }
                    })
                    CircleProgressDiv.appendChild(WinrateProgress.div());
                    CircleProgressDiv.appendChild(KdaProgress.div());
                    CircleProgressDiv.appendChild(VisionScoreProgress.div());
                    console.log(this.getChampionPlayed(matchs_data))
                }
                let ChampionPlayedDiv = document.createElement('div');
                ChampionPlayedDiv.id = "ChampionPlayedDiv";
                ChampionPlayedDiv.classList.add('module');
                {
                    let ChampionPlayedUl = document.createElement('ul');
                    let ChampionPlayed = this.getChampionPlayed(matchs_data);
                    ChampionPlayed.forEach((champion) => {
                        console.log(champion)
                        let ChampionPlayedLi = document.createElement('li');
                        {
                            let ChampionPlayedLiDiv = document.createElement('div');
                            ChampionPlayedLiDiv.classList.add('ChampionPlayedLiDiv');
                            {
                                let left = document.createElement('div');
                                left.classList.add('left');
                                {
                                    let ChampionPlayedLiDivImg = document.createElement('img');
                                    ChampionPlayedLiDivImg.src = "http://ddragon.leagueoflegends.com/cdn/12.20.1/img/champion/" + champion.championName + ".png";
                                    let ChampionPlayedLiDivP = document.createElement('p');
                                    ChampionPlayedLiDivP.innerHTML = champion.championName;
                                    let lol = document.createElement('div');
                                    {
                                        let winrate_div = document.createElement('div');
                                        winrate_div.classList.add('winrate_div');
                                        {
                                            let pwinrate = document.createElement('p');
                                            pwinrate.innerHTML = (champion.win / champion.played).toFixed(2) * 100+"%";
                                            let win = document.createElement('p');
                                            win.innerHTML = champion.win + " wins";
                                            winrate_div.appendChild(pwinrate);
                                            winrate_div.appendChild(win);
                                        }
                                        let kdaratio = document.createElement('p');
                                        kdaratio.innerHTML = (champion.kills / champion.deaths + champion.assists / champion.deaths).toFixed(2) + " KDA";
                                        lol.appendChild(winrate_div);
                                        lol.appendChild(kdaratio);
                                    }
                                    left.appendChild(ChampionPlayedLiDivImg);
                                    left.appendChild(ChampionPlayedLiDivP);
                                    left.appendChild(lol);
                                }
                                ChampionPlayedLiDiv.appendChild(left);
                            }
                            ChampionPlayedLi.appendChild(ChampionPlayedLiDiv);
                        }
                        ChampionPlayedUl.appendChild(ChampionPlayedLi);
                    })
                    ChampionPlayedDiv.appendChild(ChampionPlayedUl);
                }
                let qualities_div = document.createElement('div')
                qualities_div.id = "qualities_div";
                {
                    let qualities = this.getQualities(matchs_data);
                    qualities.forEach((quality) => {
                        let quality_div = document.createElement('div');
                        quality_div.classList.add('quality');
                        quality_div.classList.add("module");
                        qualities_div.setAttribute("category", quality.category);
                        {
                            let quality_div_p = document.createElement('h3');
                            quality_div_p.innerHTML = quality.name;
                            let quality_div_p2 = document.createElement('p');
                            quality_div_p2.innerHTML = quality.description;
                            quality_div.appendChild(quality_div_p);
                            quality_div.appendChild(quality_div_p2);
                        }
                        qualities_div.appendChild(quality_div);
                    })
                }
                let _left = document.createElement('div');
                _left.id = "_left";
                {
                    _left.appendChild(CircleProgressDiv);
                    _left.appendChild(qualities_div);
                }
                let _right = document.createElement('div');
                _right.id = "_right";
                {
                    _right.appendChild(ChampionPlayedDiv);
                }
                main.appendChild(_left);
                main.appendChild(_right);
                
            }
            div.appendChild(header);
            div.appendChild(main);
        }
        return div;
    }
}