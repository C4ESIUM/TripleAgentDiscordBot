const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require('./config.json')
const { intro1, intro2, intro3 ,
  roleliste, role0, role1, role1110, role1111, role1100, role1010, role0000, role0001, role0010, role0100,
  msgTropVirus, msgPasAssezVirus, partieSecreteDebut, partieSecreteFin,
  phaseOperation, infiltrationCommun, informateurSecretCommun, rensignementDanoisCommun, transfertCommun, anciennePhotoCommun, infoAnonymeCommun, confessionCommun, mauvaiseRencontreCommun, preuveCompromettanteCommun, deserteurCommun, dossierSecretCommun,
  infiltrationIntro, informateurSecretIntro, rensignementDanoisIntro, transfertIntro, anciennePhotoIntro, infoAnonymeIntro, confessionIntro, mauvaiseRencontreIntro, preuveCompromettanteIntro, deserteurIntro, dossierSecretIntro,

  phaseDeDiscution, phaseAccusation,
} = require('./texteTripleAgent.json')

const attenteSimple = 2000
const attenteLongue = 10000

const minJoueur = 1
const maxJoueur = 9
let partieEnCours = 0;
let identifieur = 0;

let totalOpe = 0;
let nombreOpe = 0;

let end, current;                       //Variables de gestion du temps
let nombreJoueurs;            //nombre de joueurs présents pour la partie
let nombreVirus;    //calcul du nombre de virus a distribuer (le tiers)
let virusCount;             //nombre de virus qui décrois quand on les affect
let virus = [];                         //liste des joueurs dans le camp du virus
let nombreVirusSurListe = 0;
let listeVirus = ``;                      //joueurs apparaissant sur la liste des virus
let nombreService;            //calcul du nombre de service restant
let service = [];                         //liste des joueurs dans le camp du service
let infiltrCount = 1;                     //nombre maxi d'agent infiltré qui décrois quand on les affect
let suspCount;              //nombre maxi d'agent suspect qui décrois quand on les affect
let renegatCount = 1;                     //nombre maxi d'agent renegat qui décrois quand on les affect
let tripleCount;          //nombre maxi d'agent triple qui décrois quand on les affect
let loyalCount;             //nombre maxi d'agent loyaux qui décrois quand on les affect

let messageAnomalieListeVirus = ``;       //Message d'exception pour virus
let indiceOperation;                       //Operation reçu par le joueur
let recapOpe = [];                              //déclaration du tableau de récap
let recap = ``;                                 //déclaration du texte de récap

let matriceRole = [];                 //déclaration de la matrice des opérations

let matriceOpe = [];                 //déclaration de la matrice des opérations
//[0] : Nom de l'opération / [1] : Taux ajustable de possibilité d'avoir l'opération / [2] : Probabilité d'obtenir l'opération / [3] : Probabilité cumulée
//[4] : texte d'intro commun / [5] texte d'intro perso / []
matriceOpe[0] = [];
matriceOpe[0][0] = `Infiltration : `;
matriceOpe[0][1] = 1;
matriceOpe[0][4] = infiltrationCommun;
matriceOpe[0][5] = infiltrationIntro;
matriceOpe[1] = [];
matriceOpe[1][0] = `Informateur Secret : `;
matriceOpe[1][1] = 2;
matriceOpe[1][4] = informateurSecretCommun;
matriceOpe[1][5] = informateurSecretIntro;
matriceOpe[2] = [];
matriceOpe[2][0] = `Renseignement Danois : `;
matriceOpe[2][1] = 2;
matriceOpe[2][4] = rensignementDanoisCommun;
matriceOpe[2][5] = rensignementDanoisIntro;
matriceOpe[3] = [];
matriceOpe[3][0] = `Transfert d'Espion : `;
matriceOpe[3][1] = 1;
matriceOpe[3][4] = transfertCommun;
matriceOpe[3][5] = transfertIntro;
matriceOpe[4] = [];
matriceOpe[4][0] = `Ancienne Photographie : `;
matriceOpe[4][1] = 2;
matriceOpe[4][4] = anciennePhotoCommun;
matriceOpe[4][5] = anciennePhotoIntro;
matriceOpe[5] = [];
matriceOpe[5][0] = `Confession : `;
matriceOpe[5][1] = 1;
matriceOpe[5][4] = confessionCommun;
matriceOpe[5][5] = confessionIntro;
matriceOpe[6] = [];
matriceOpe[6][0] = `Mauvaise rencontre : `;
matriceOpe[6][1] = 1;
matriceOpe[6][4] = mauvaiseRencontreCommun;
matriceOpe[6][5] = mauvaiseRencontreIntro;
matriceOpe[7] = [];
matriceOpe[7][0] = `Preuve Compromettante : `;
matriceOpe[7][1] = 0;
matriceOpe[7][4] = preuveCompromettanteCommun;
matriceOpe[7][5] = preuveCompromettanteIntro;
matriceOpe[8] = [];
matriceOpe[8][0] = `Deserteur : `;
matriceOpe[8][1] = 0;
matriceOpe[8][4] = deserteurCommun;
matriceOpe[8][5] = deserteurIntro;
matriceOpe[9] = [];
matriceOpe[9][0] = `Info Anonyme : `;
matriceOpe[9][1] = 1;
matriceOpe[9][4] = infoAnonymeCommun;
matriceOpe[9][5] = infoAnonymeIntro;
matriceOpe[10] = [];
matriceOpe[10][0] = `Dossier Secret : `; //InfoSecrete
matriceOpe[10][1] = 2;
matriceOpe[10][4] = dossierSecretCommun;
matriceOpe[10][5] = dossierSecretIntro;
matriceOpe[11] = [];
matriceOpe[11][0] = `Dossier Secret : `; //Agent dormant
matriceOpe[11][1] = 1;
matriceOpe[11][4] = dossierSecretCommun;
matriceOpe[11][5] = dossierSecretIntro;
matriceOpe[12] = [];
matriceOpe[12][0] = `Dossier Secret : `; //Adoration
matriceOpe[12][1] = 1;
matriceOpe[12][4] = dossierSecretCommun;
matriceOpe[12][5] = dossierSecretIntro;
matriceOpe[13] = [];
matriceOpe[13][0] = `Dossier Secret : `; //Rancune
matriceOpe[13][1] = 1;
matriceOpe[13][4] = dossierSecretCommun;
matriceOpe[13][5] = dossierSecretIntro;
matriceOpe[14] = [];
matriceOpe[14][0] = `Dossier Secret : `; //Bouc
matriceOpe[14][1] = 0.5;
matriceOpe[14][4] = dossierSecretCommun;
matriceOpe[14][5] = dossierSecretIntro;

//Toutes les actions à faire quand le bot se connecte
bot.on("ready", function () {
    console.log("Mon BOT de Triple Agent est Connecté");
})
bot.login(token);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function waitSeconds(milliseconds) {
  current = new Date();
  end = current.getTime() + milliseconds;
  while (current.getTime() < end) {
    current = new Date();
  }
}

async function calculTabOperations(matriceOpe) {
  let totalOpe = 0;
  let nombreOpe = 0;
  for (let i = 0; i < matriceOpe.length; i++) {                //parcours toutes les options possibles pour calculer totalOpe et nombreOpe
    if(matriceOpe[i][1]>0){
      totalOpe = totalOpe + matriceOpe[i][1];
      nombreOpe = nombreOpe + 1;
    }
  }
  for (let i = 0; i < matriceOpe.length; i++) {                //parcours toutes les options possibles
    matriceOpe[i][2] = ((matriceOpe[i][1]*100)/totalOpe);
    if(i>0){ matriceOpe[i][3] = Math.round(matriceOpe[i][2]*100 + matriceOpe[i-1][3]); }else{ matriceOpe[i][3] = Math.round(matriceOpe[i][2]*100); }
  }
}
async function affectationMatriceRole(membersName){
  for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
    matriceRole[i] = [];                          //declaration de la 2eme dimention
    matriceRole[i][0] = membersName[i];           //affectation du surnom dans la premiere collone
    if(getRandomInt(nombreJoueurs-i)<virusCount){ //si le chiffre random désigne un virus
      matriceRole[i][1] = 1;                      //affectation du statut virus dans la deuxieme collone
      virusCount--;                               //réduction du nombre de virus a distribuer
      if(getRandomInt(10)<infiltrCount){          //10% de chance d'etre infiltré, limité a infiltrCount
        matriceRole[i][2] = 0;                    //affectation du statut infiltré dans la troisieme collone
        matriceRole[i][3] = 1;                    //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
        nombreVirusSurListe ++;
        matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
        matriceRole[i][5] = `${role1010}`;                     //texte correspondant a sa valeur matrice
        infiltrCount--;                           //réduction du nombre d'infiltrés a distribuer
      }else{                                    //Si virus, mais pas infiltré
        matriceRole[i][2] = 1;                    //affectation du statut normal dans la troisieme collone
        if(getRandomInt(10)<renegatCount){        //10% de chance d'etre renegat, limité a renegatCount
          matriceRole[i][3] = 0;                  //affectation du statut renegat (hors de la liste des virus) dans la quatrieme collone
          matriceRole[i][4] = 0;                   //affectation du statut normal dans la cinquieme collone
          matriceRole[i][5] = `${role1100}`;                    //texte correspondant a sa valeur matrice
          renegatCount--;                         //réduction du nombre de renegat a distribuer
        }else{                                  //Si virus, mais pas infiltré, ni renegat
          matriceRole[i][3] = 1;                  //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
          nombreVirusSurListe ++;
          if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
            matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
            matriceRole[i][5] = `${role1111}`;                 //texte correspondant a sa valeur matrice
            loyalCount--;                         //réduction du nombre de loyal a distribuer
          }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
            matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
            matriceRole[i][5] = `${role1110}`;                 //texte correspondant a sa valeur matrice
          }
        }
      }
    }else{                                        //si le chiffre random désigne un virus
      matriceRole[i][1] = 0;                      //affectation du statut service dans la deuxieme collone
      if(getRandomInt(10)<suspCount){             //10% de chance d'etre suspect, limité a suspCount
        matriceRole[i][2] = 1;                    //affectation du statut suspect dans la troisieme collone
        matriceRole[i][3] = 0;                    //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
        matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
        matriceRole[i][5] = `${role0100}`;                     //texte correspondant a sa valeur matrice
        suspCount--;                              //réduction du nombre de suspect a distribuer
      }else{                                    //Si service, mais pas suspect
        matriceRole[i][2] = 0;                    //affectation du statut normal dans la troisieme collone
        if(getRandomInt(10)<tripleCount){         //10% de chance d'etre triple, limité a tripleCount
          matriceRole[i][3] = 1;                  //affectation du statut triple (dans la liste des virus) dans la quatrieme collone
          nombreVirusSurListe ++;
          matriceRole[i][4] = 0;                  //affectation du statut normal dans la cinquieme collone
          matriceRole[i][5] = `${role0010}`;                   //texte correspondant a sa valeur matrice
          tripleCount--;                          //réduction du nombre de triple a distribuer
        }else{                                  //Si service, mais pas suspect, ni triple
          matriceRole[i][3] = 0;                  //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
          if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
            matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
            matriceRole[i][5] = `${role0001}`;                 //texte correspondant a sa valeur matrice
            loyalCount--;                         //réduction du nombre de loyal a distribuer
          }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
            matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
            matriceRole[i][5] = ``;                 //texte correspondant a sa valeur matrice
          }
        }
      }
    }
  }// Fin de parcours de la liste des joueurs
}

/*
function pollDOM () {
  const el = document.querySelector('my-element');

  if (nombre de secondes < temps limite) {
    if (temps limite = 15s){afficher 15s restante}
    setTimeout(pollDOM, 300); // try again in 300 milliseconds
  } else {
    met les votes en aléatoire
  }
}
*/


async function debutDePartie(membersName, membersId, message){
  partieEnCours = 1;
  nombreJoueurs = membersId.length;            //nombre de joueurs présents pour la partie
  nombreVirus = Math.ceil(nombreJoueurs/3);    //calcul du nombre de virus a distribuer (le tiers)
  nombreService = nombreVirus - nombreJoueurs; //calcul du nombre de service restant
  virusCount = nombreVirus;             //nombre de virus qui décrois quand on les affect
  suspCount = nombreVirus;              //nombre maxi d'agent suspect qui décrois quand on les affect
  tripleCount = nombreVirus-1;          //nombre maxi d'agent triple qui décrois quand on les affect
  loyalCount = nombreVirus;             //nombre maxi d'agent loyaux qui décrois quand on les affect

  console.log(`Message : Briefing`);
  await message.channel.send(`${intro1}${nombreVirus}${intro2}${nombreJoueurs}${intro3}`);
// AFFECTATION DE LA MATRICE
  affectationMatriceRole(membersName);
  waitSeconds(attenteSimple);
//PHASE DE DISTRIBUTION DES ROLES !
  console.log(`Message perso : Distribution des roles`);
  for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
    //bot.users.cache.get(membersId[i]).send(`${matriceRole[i][1]}${matriceRole[i][2]}${matriceRole[i][3]}${matriceRole[i][4]}`); //envoi de son role de service au jouer
    // CONSTRUCTION DU MESSAGE DE ROLE
    if(matriceRole[i][1] == 0){ //si service :
      await bot.users.cache.get(membersId[i]).send(`${role0000}${roleliste}${nombreVirus}${role0}` + matriceRole[i][5]); //envoi de son role de service au jouer

    }else{                      //si virus :
      listeVirus = ``;
      for (let j = 0; j < nombreJoueurs; j++) { //ecriture de la liste des virus
        if(matriceRole[j][3] == 1 && j != i){listeVirus = listeVirus + ` ` + matriceRole[j][0]} //Ajout d'un nom dans la liste des virus
      }
      if(nombreVirusSurListe-matriceRole[i][3] < nombreVirus-1){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
        messageAnomalieListeVirus = messageAnomalieListeVirus + msgPasAssezVirus;
      }else if(nombreVirusSurListe-matriceRole[i][3] < nombreVirus-1){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
        messageAnomalieListeVirus = messageAnomalieListeVirus + msgTropVirus;
      }
      await bot.users.cache.get(membersId[i]).send(matriceRole[i][5] + `${roleliste}${nombreVirus -1}${role1}${listeVirus}${messageAnomalieListeVirus}`); //envoi de son role de virus au joueur
    }
  waitSeconds(attenteSimple);
  }// Fin de parcours de la liste des joueurs
//PHASE D'OPERATION !
  console.log(`Message : Phase d'operation`);
  await message.channel.send(`${phaseOperation}`);

  for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
    recapOpe[i] = ``;         //on a besoin de cette partie ???
  }// Fin de parcours de la liste des joueurs

  calculTabOperations(matriceOpe)
  recap = ``;
  identifieur = setTimeout(répartitionDesRoles, attenteSimple, membersName, membersId, message, 0);
}

async function répartitionDesRoles(membersName, membersId, message, i){
  partieEnCours = 2 + i;
  if(i>=nombreJoueurs){
    var x = setTimeout(phaseDiscution, attenteSimple, membersName, membersId, message);
  }else{
    let ope = getRandomInt(10000);
    let agent
    do {
      agent = getRandomInt(nombreJoueurs);
    }while (recapOpe[agent] != ``)
    let j=0;
    indiceOperation=0;
    while(ope > matriceOpe[j+1][3]){
      j++;
      if(matriceOpe[j+1][1] > 0 ) {indiceOperation=j;} //Si l'option est dispo, on prends son indice
    }
    recapOpe[agent] = matriceOpe[indiceOperation][0]; //affectation de la matrice
    recap = recap + recapOpe[agent] + membersName[agent] + `\n`;
    console.log(`Message : Opération d'un joueur`);
    await message.channel.send(`${matriceOpe[indiceOperation][0]}${membersName[agent]}${matriceOpe[indiceOperation][4]}`);
    //switch
    console.log(`Message perso : Opération du joueur`);
    await bot.users.cache.get(membersId[agent]).send(`${matriceOpe[indiceOperation][0]}${matriceOpe[indiceOperation][5]}`);    //envoi de l'opération au joueur concerné
    //calculTabOperations(matriceOpe); //recalcul les opération disponibles en fonction des changements de camps
    identifieur = setTimeout(répartitionDesRoles, attenteSimple, membersName, membersId, message, i+1)
  }
}

async function phaseDiscution(membersName, membersId, message){
  partieEnCours = 2 + nombreJoueurs;
  console.log(`Message : Phase de discution`);
  await message.channel.send(`${phaseDeDiscution}${recap}`);
  identifieur = setTimeout(phaseDAccusation, attenteLongue, membersName, membersId, message);
}

async function phaseDAccusation(membersName, membersId, message){
  partieEnCours = 3 + nombreJoueurs;
  console.log(`Message : Phase d'accusation`);
  await message.channel.send(`${phaseAccusation}`);
  identifieur = setTimeout(phaseDeVote, attenteSimple, membersName, membersId, message, 0)
}

async function phaseDeVote(membersName, membersId, message, i){
  partieEnCours = 4 + nombreJoueurs +i;
  if(i>=nombreJoueurs){
    identifieur = setTimeout(resultats, attenteSimple, membersName, membersId, message);
  }else{
    console.log(`Message perso : Voter contre un joueur`);
    await bot.users.cache.get(membersId[i]).send(`A toi de voter`);    //envoi du message de phase d'opération a chaque joueur
    identifieur = setTimeout(phaseDeVote, attenteSimple, membersName, membersId, message, i+1)
    //setTimeout(mafonction, 10000);
        //Donner la liste des joueurs et recevoir le vote
  }
}

async function resultats(membersName, membersId, message){
  partieEnCours = 4 + nombreJoueurs + nombreJoueurs;
  console.log(`Message : Resultat`);
  await message.channel.send(`Les votes sont : `);
      //Afficher les votes en face de chaque joueur >0
  waitSeconds(attenteSimple);
  await message.channel.send(`Les gagnants sont : `);
      //Determiner les gagnants en fonction des conditions de victoire
  identifieur = setTimeout(finDePartie, attenteSimple, membersName, membersId, message);
}

async function finDePartie(membersName, membersId, message){
  await message.channel.send(`FIN de la partie`);
  partieEnCours = 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on('message', async message => {
	if (message.content === `${prefix}jouer`) {
		try {
      //msg.channel.awaitMessages
      //Amélioration : recupérer le channel de l'utilisateur qui envoi la !jouer
      let channel = bot.channels.cache.get('745007673170329733'); //récuperer l'objet du channel via son ID
      let membersId = channel.members.map(m=>m.id);               //récuperer les ID de tous les membres présents dessus
      let membersName = channel.members.map(m=>m.nickname);       //récuperer les noms de tous les membres présents dessus
      if(membersId.length<minJoueur){                             //récuperer le nombre de joueur dans le channel vocal
        await message.channel.send(`Pas assez de joueurs`);
      }else if(membersId.length>maxJoueur){
        await message.channel.send(`Trop de joueurs`);
      }else if(partieEnCours > 1){
        await message.channel.send(`Partie déjà en cours`);
      }else{                                        //S'il y a le bon nombre de joueurs, on lance la partie
        await message.channel.send(`DEBUT de la partie`);
        debutDePartie(membersName, membersId, message);
      }//Fin de verification du nombre de personne
		} catch (error) {
			// handle error
		}
	}else if(message.content === `${prefix}passer`){
    try {
      let channel = bot.channels.cache.get('745007673170329733'); //récuperer l'objet du channel via son ID
      let membersId = channel.members.map(m=>m.id);               //récuperer les ID de tous les membres présents dessus
      let membersName = channel.members.map(m=>m.nickname);       //récuperer les noms de tous les membres présents dessus
      if(partieEnCours == 2 + nombreJoueurs){
        console.log(`Discution en cours`);
        clearTimeout(identifieur);
        phaseDAccusation(membersName, membersId, message);
      }else{
        console.log(`Aucun debat en cours`);
      }
    } catch (error) {
      // handle error
    }
  }else if(message.content === `${prefix}stop`){
    try {
      let channel = bot.channels.cache.get('745007673170329733'); //récuperer l'objet du channel via son ID
      let membersId = channel.members.map(m=>m.id);               //récuperer les ID de tous les membres présents dessus
      let membersName = channel.members.map(m=>m.nickname);       //récuperer les noms de tous les membres présents dessus
      if(partieEnCours > 0){
        console.log(`Partie en cours`);
        clearTimeout(identifieur);
        finDePartie(membersName, membersId, message);
      }else{
        console.log(`Aucune partie en cours`);
      }
    } catch (error) {
      // handle error
    }
  }
});



  /*
console.log(nomsJoueurs.length)

// client id : 744960483668263026
//permission : 1211176960 ou 1073790016


/*
else if (message.content === `${prefix}beep`) {
   message.channel.send('Boop.');
}else if (message.content === `${prefix}user-info`) {
   message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}
else if (message.content === `${prefix}moi`) {
   message.channel.send(`Le joueur ${message.author.username} rejoins la partie`);
   let newLength = nomsJoueurs.push(`${message.author.username}`)
   console.log(nomsJoueurs.length)
}else if (message.content === `${prefix}pas-moi`) {
   message.channel.send(`Le joueur ${message.author.username} quitte la partie`);
   let pos = nomsJoueurs.indexOf(`${message.author.username}`)
   let removedItem = nomsJoueurs.splice(pos, 1)
   console.log(nomsJoueurs.length)
}else if (message.content === `${prefix}liste`) {
  nombreJoueurs = nomsJoueurs.length
  if(nombreJoueurs>0){
    liste = nomsJoueurs[0]
    for (i = 1; i<nombreJoueurs ; i++){
      liste = liste + `, ` + nomsJoueurs[i]
    }
    message.channel.send(`Les joueurs sont : ${liste}`);
  }else{
    message.channel.send(`Aucun joueurs pour le moment`);
  }
}*/
