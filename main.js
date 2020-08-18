const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require('./config.json')
const { intro1, intro2, intro3 , roleliste, role0, role1, role1110, role1111, role1100, role1010, role0000, role0001, role0010, role0100, msgTropVirus, msgPasAssezVirus, phaseOperation} = require('./texteTripleAgent.json')

const minJoueur = 1
const maxJoueur = 9

//Toutes les actions à faire quand le bot se connecte
bot.on("ready", function () {
    console.log("Mon BOT est Connecté");
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

bot.on('message', async message => {
	if (message.content === `${prefix}jouer`) {
    try {
      await message.react('3');
      await message.react('2');
      await message.react('1');
      if (message.content === `${prefix}jouer`) {
        //msg.channel.awaitMessages
        //Amélioration : recupérer le channel de l'utilisateur qui envoi la !jouer
        let channel = bot.channels.cache.get('745007673170329733'); //récuperer l'objet du channel via son ID
        let membersId = channel.members.map(m=>m.id);               //récuperer les ID de tous les memebres présents dessus
        let membersName = channel.members.map(m=>m.nickname);       //récuperer les noms de tous les memebres présents dessus
        if(membersId.length<minJoueur){                             //récuperer le nombre de joueur dans le channel vocal
          message.channel.send(`Pas assez de joueurs`);
        }else if(membersId.length>maxJoueur){
          message.channel.send(`Trop de joueurs`);
        }else{                                        //S'il y a le bon nombre de joueurs, on lance la partie

          // INITIALISATION DES VARIABLES
          let nombreJoueurs = membersId.length            //nombre de joueurs présents pour la partie
          let nombreVirus = Math.ceil(nombreJoueurs/3)    //calcul du nombre de virus a distribuer (le tiers)
          let nombreService = nombreVirus - nombreJoueurs //calcul du nombre de service restant
          let virusCount = nombreVirus;             //nombre de virus qui décrois quand on les affect
          let infiltrCount = 1;                     //nombre maxi d'agent infiltré qui décrois quand on les affect
          let suspCount = nombreVirus;              //nombre maxi d'agent suspect qui décrois quand on les affect
          let renegatCount = 1;                     //nombre maxi d'agent renegat qui décrois quand on les affect
          let tripleCount = nombreVirus-1;          //nombre maxi d'agent triple qui décrois quand on les affect
          let loyalCount = nombreVirus;             //nombre maxi d'agent loyaux qui décrois quand on les affect
          let nombreVirusListe = 0;                       //compte du nombre de joueurs apparaissant dans la liste de virus
          let listeVirus = [];
          let messageAnomalieListeVirus = ``;       //Message d'exception pour virus
          let end, current;                       //Variables de gestion du temps

          // AFFECTATION DE LA MATRICE
          let matriceRole = [];                 //déclaration de la matrice des roles
          for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
            await bot.users.cache.get(membersId[i]).send(`${intro1}${nombreVirus}${intro2}${nombreJoueurs}${intro3}`);    //envoi du message d'intro a chaque joueur
            matriceRole[i] = [];                          //declaration de la 2eme dimention
            matriceRole[i][0] = membersName[i];           //affectation du surnom dans la premiere collone
            if(getRandomInt(nombreJoueurs-i)<virusCount){ //si le chiffre random désigne un virus
              matriceRole[i][1] = 1;                      //affectation du statut virus dans la deuxieme collone
              virusCount--;                               //réduction du nombre de virus a distribuer
              if(getRandomInt(10)<infiltrCount){          //10% de chance d'etre infiltré, limité a infiltrCount
                matriceRole[i][2] = 0;                    //affectation du statut infiltré dans la troisieme collone
                matriceRole[i][3] = 1;                    //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
                matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
                role = `${role1010}`;                     //texte correspondant a sa valeur matrice
                infiltrCount--;                           //réduction du nombre d'infiltrés a distribuer
              }else{                                    //Si virus, mais pas infiltré
                matriceRole[i][2] = 1;                    //affectation du statut normal dans la troisieme collone
                if(getRandomInt(10)<renegatCount){        //10% de chance d'etre renegat, limité a renegatCount
                  matriceRole[i][3] = 0;                  //affectation du statut renegat (hors de la liste des virus) dans la quatrieme collone
                  matriceRole[i][4] = 0;                   //affectation du statut normal dans la cinquieme collone
                  role = `${role1100}`;                    //texte correspondant a sa valeur matrice
                  renegatCount--;                         //réduction du nombre de renegat a distribuer
                }else{                                  //Si virus, mais pas infiltré, ni renegat
                  matriceRole[i][3] = 1;                  //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
                  listeVirus.push(matriceRole[i][0]);     //Ajout d'un nom dans la liste des virus
                  if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
                    matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
                    role = `${role1111}`;                 //texte correspondant a sa valeur matrice
                    loyalCount--;                         //réduction du nombre de loyal a distribuer
                  }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
                    matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
                    role = `${role1110}`;                 //texte correspondant a sa valeur matrice
                  }
                }
              }
            }else{                                        //si le chiffre random désigne un virus
              matriceRole[i][1] = 0;                      //affectation du statut service dans la deuxieme collone
              if(getRandomInt(10)<suspCount){             //10% de chance d'etre suspect, limité a suspCount
                matriceRole[i][2] = 1;                    //affectation du statut suspect dans la troisieme collone
                matriceRole[i][3] = 0;                    //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
                matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
                role = `${role0100}`;                     //texte correspondant a sa valeur matrice
                suspCount--;                              //réduction du nombre de suspect a distribuer
              }else{                                    //Si service, mais pas suspect
                matriceRole[i][2] = 0;                    //affectation du statut normal dans la troisieme collone
                if(getRandomInt(10)<tripleCount){         //10% de chance d'etre triple, limité a tripleCount
                  matriceRole[i][3] = 1;                  //affectation du statut triple (dans la liste des virus) dans la quatrieme collone
                  listeVirus.push(matriceRole[i][0]);     //Ajout d'un nom dans la liste des virus
                  matriceRole[i][4] = 0;                  //affectation du statut normal dans la cinquieme collone
                  role = `${role0010}`;                   //texte correspondant a sa valeur matrice
                  tripleCount--;                          //réduction du nombre de triple a distribuer
                }else{                                  //Si service, mais pas suspect, ni triple
                  matriceRole[i][3] = 0;                  //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
                  if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
                    matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
                    role = `${role0001}`;                 //texte correspondant a sa valeur matrice
                    loyalCount--;                         //réduction du nombre de loyal a distribuer
                  }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
                    matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
                    role = `${role0000}`;                 //texte correspondant a sa valeur matrice
                  }
                }
              }
            }
                        //console.log(getRandomInt(10))
          }// Fin de parcours de la liste des joueurs
          //WAIT 3s
          waitSeconds(3000);


//PHASE DE DISTRIBUTION DES ROLES !
          for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
            //bot.users.cache.get(membersId[i]).send(`${matriceRole[i][1]}${matriceRole[i][2]}${matriceRole[i][3]}${matriceRole[i][4]}`); //envoi de son role de service au jouer
            // CONSTRUCTION DU MESSAGE DE ROLE
            if(matriceRole[i][1] == 0){ //si service :
              await bot.users.cache.get(membersId[i]).send(`${role0000}${roleliste}${nombreVirus}${role0}` + role); //envoi de son role de service au jouer
            }else{                      //si virus :
              if(listeVirus.length < nombreVirus){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
                messageAnomalieListeVirus = messageAnomalieListeVirus + msgPasAssezVirus;
              }else if(listeVirus.length < nombreVirus){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
                messageAnomalieListeVirus = messageAnomalieListeVirus + msgTropVirus;
              }
              await bot.users.cache.get(membersId[i]).send(role + `${roleliste}${listeVirus.length}${role1}${listeVirus}${messageAnomalieListeVirus}`); //envoi de son role de virus au joueur
            }
          //WAIT 3s
          waitSeconds(3000);
          }// Fin de parcours de la liste des joueurs


//PHASE D'OPERATION !
          for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
            await bot.users.cache.get(membersId[i]).send(`${phaseOperation}`);    //envoi du message de phase d'opération a chaque joueur
          }// Fin de parcours de la liste des joueurs
          //WAIT 3s
          waitSeconds(3000);
          //Distribution des informations
          for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
            await bot.users.cache.get(membersId[i]).send(`Voici votre information : ...`);    //envoi du message de phase d'opération a chaque joueur
            //WAIT 5s
            waitSeconds(5000);
          }// Fin de parcours de la liste des joueurs


//PHASE D'ACCUSATION !
          for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
            await bot.users.cache.get(membersId[i]).send(`Pour qui voulez vous voter ?`);    //envoi du message de phase d'opération a chaque joueur
          }// Fin de parcours de la liste des joueurs


        }//Fin de verification du nombre de personne
      }//Fin de partie
		} catch (error) {
			// handle error
		}
	}
});


  /*
  bot.on('message', message => {
    if (message.content === `${prefix}jouer`) {
      //msg.channel.awaitMessages
      //Amélioration : recupérer le channel de l'utilisateur qui envoi la !jouer
      let channel = bot.channels.cache.get('745007673170329733'); //récuperer l'objet du channel via son ID
      let membersId = channel.members.map(m=>m.id);               //récuperer les ID de tous les memebres présents dessus
      let membersName = channel.members.map(m=>m.nickname);       //récuperer les noms de tous les memebres présents dessus
      if(membersId.length<minJoueur){                             //récuperer le nombre de joueur dans le channel vocal
        message.channel.send(`Pas assez de joueurs`);
      }else if(membersId.length>maxJoueur){
        message.channel.send(`Trop de joueurs`);
      }else{                                        //S'il y a le bon nombre de joueurs, on lance la partie

        // INITIALISATION DES VARIABLES
        let nombreJoueurs = membersId.length            //nombre de joueurs présents pour la partie
        let nombreVirus = Math.ceil(nombreJoueurs/3)    //calcul du nombre de virus a distribuer (le tiers)
        let nombreService = nombreVirus - nombreJoueurs //calcul du nombre de service restant
        let virusCount = nombreVirus;             //nombre de virus qui décrois quand on les affect
        let infiltrCount = 1;                     //nombre maxi d'agent infiltré qui décrois quand on les affect
        let suspCount = nombreVirus;              //nombre maxi d'agent suspect qui décrois quand on les affect
        let renegatCount = 1;                     //nombre maxi d'agent renegat qui décrois quand on les affect
        let tripleCount = nombreVirus-1;          //nombre maxi d'agent triple qui décrois quand on les affect
        let loyalCount = nombreVirus;             //nombre maxi d'agent loyaux qui décrois quand on les affect
        let nombreVirusListe = 0;                       //compte du nombre de joueurs apparaissant dans la liste de virus
        let listeVirus = [];
        let messageAnomalieListeVirus = ``;       //Message d'exception pour virus
        let end, current;                       //Variables de gestion du temps

        // AFFECTATION DE LA MATRICE
        let matriceRole = [];                 //déclaration de la matrice des roles
        for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
          bot.users.cache.get(membersId[i]).send(`${intro1}${nombreVirus}${intro2}${nombreJoueurs}${intro3}`);    //envoi du message d'intro a chaque joueur
          matriceRole[i] = [];                          //declaration de la 2eme dimention
          matriceRole[i][0] = membersName[i];           //affectation du surnom dans la premiere collone
          if(getRandomInt(nombreJoueurs-i)<virusCount){ //si le chiffre random désigne un virus
            matriceRole[i][1] = 1;                      //affectation du statut virus dans la deuxieme collone
            virusCount--;                               //réduction du nombre de virus a distribuer
            if(getRandomInt(10)<infiltrCount){          //10% de chance d'etre infiltré, limité a infiltrCount
              matriceRole[i][2] = 0;                    //affectation du statut infiltré dans la troisieme collone
              matriceRole[i][3] = 1;                    //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
              matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
              role = `${role1010}`;                     //texte correspondant a sa valeur matrice
              infiltrCount--;                           //réduction du nombre d'infiltrés a distribuer
            }else{                                    //Si virus, mais pas infiltré
              matriceRole[i][2] = 1;                    //affectation du statut normal dans la troisieme collone
              if(getRandomInt(10)<renegatCount){        //10% de chance d'etre renegat, limité a renegatCount
                matriceRole[i][3] = 0;                  //affectation du statut renegat (hors de la liste des virus) dans la quatrieme collone
                matriceRole[i][4] = 0;                   //affectation du statut normal dans la cinquieme collone
                role = `${role1100}`;                    //texte correspondant a sa valeur matrice
                renegatCount--;                         //réduction du nombre de renegat a distribuer
              }else{                                  //Si virus, mais pas infiltré, ni renegat
                matriceRole[i][3] = 1;                  //affectation du statut normal (dans la liste des virus) dans la quatrieme collone
                listeVirus.push(matriceRole[i][0]);     //Ajout d'un nom dans la liste des virus
                if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
                  matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
                  role = `${role1111}`;                 //texte correspondant a sa valeur matrice
                  loyalCount--;                         //réduction du nombre de loyal a distribuer
                }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
                  matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
                  role = `${role1110}`;                 //texte correspondant a sa valeur matrice
                }
              }
            }
          }else{                                        //si le chiffre random désigne un virus
            matriceRole[i][1] = 0;                      //affectation du statut service dans la deuxieme collone
            if(getRandomInt(10)<suspCount){             //10% de chance d'etre suspect, limité a suspCount
              matriceRole[i][2] = 1;                    //affectation du statut suspect dans la troisieme collone
              matriceRole[i][3] = 0;                    //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
              matriceRole[i][4] = 0;                    //affectation du statut normal dans la cinquieme collone
              role = `${role0100}`;                     //texte correspondant a sa valeur matrice
              suspCount--;                              //réduction du nombre de suspect a distribuer
            }else{                                    //Si service, mais pas suspect
              matriceRole[i][2] = 0;                    //affectation du statut normal dans la troisieme collone
              if(getRandomInt(10)<tripleCount){         //10% de chance d'etre triple, limité a tripleCount
                matriceRole[i][3] = 1;                  //affectation du statut triple (dans la liste des virus) dans la quatrieme collone
                listeVirus.push(matriceRole[i][0]);     //Ajout d'un nom dans la liste des virus
                matriceRole[i][4] = 0;                  //affectation du statut normal dans la cinquieme collone
                role = `${role0010}`;                   //texte correspondant a sa valeur matrice
                tripleCount--;                          //réduction du nombre de triple a distribuer
              }else{                                  //Si service, mais pas suspect, ni triple
                matriceRole[i][3] = 0;                  //affectation du statut normal (hors de la liste des virus) dans la quatrieme collone
                if(getRandomInt(10)<loyalCount){        //10% de chance d'etre loyal, limité a loyalCount
                  matriceRole[i][4] = 1;                //affectation du statut loyal dans la cinquieme collone
                  role = `${role0001}`;                 //texte correspondant a sa valeur matrice
                  loyalCount--;                         //réduction du nombre de loyal a distribuer
                }else{                                //Si virus, mais pas infiltré, ni renegat, ni loyal
                  matriceRole[i][4] = 0;                //affectation du statut normal dans la cinquieme collone
                  role = `${role0000}`;                 //texte correspondant a sa valeur matrice
                }
              }
            }
          }
                      //console.log(getRandomInt(10))
        }// Fin de parcours de la liste des joueurs
        //WAIT 3s



//PHASE DE DISTRIBUTION DES ROLES !
        for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
          //bot.users.cache.get(membersId[i]).send(`${matriceRole[i][1]}${matriceRole[i][2]}${matriceRole[i][3]}${matriceRole[i][4]}`); //envoi de son role de service au jouer
          // CONSTRUCTION DU MESSAGE DE ROLE
          if(matriceRole[i][1] == 0){ //si service :
            bot.users.cache.get(membersId[i]).send(`${role0000}${roleliste}${nombreVirus}${role0}` + role); //envoi de son role de service au jouer
          }else{                      //si virus :
            if(listeVirus.length < nombreVirus){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
              messageAnomalieListeVirus = messageAnomalieListeVirus + msgPasAssezVirus;
            }else if(listeVirus.length < nombreVirus){  //si le nombre de virus affiché ne corresponds pas au nombre de virus prevu
              messageAnomalieListeVirus = messageAnomalieListeVirus + msgTropVirus;
            }
            bot.users.cache.get(membersId[i]).send(role + `${roleliste}${listeVirus.length}${role1}${listeVirus}${messageAnomalieListeVirus}`); //envoi de son role de virus au joueur
          }
          //WAIT 3s
        }// Fin de parcours de la liste des joueurs


//PHASE D'OPERATION !
        for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
          bot.users.cache.get(membersId[i]).send(`${phaseOperation}`);    //envoi du message de phase d'opération a chaque joueur
        }// Fin de parcours de la liste des joueurs
        //WAIT 3s
        //Distribution des informations
        for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
          bot.users.cache.get(membersId[i]).send(`Voici votre information : ...`);    //envoi du message de phase d'opération a chaque joueur
          //WAIT 5s
        }// Fin de parcours de la liste des joueurs


//PHASE D'ACCUSATION !
        for (let i = 0; i < nombreJoueurs; i++) {                //parcours tous les joueurs
          bot.users.cache.get(membersId[i]).send(`Pour qui voulez vous voter ?`);    //envoi du message de phase d'opération a chaque joueur
        }// Fin de parcours de la liste des joueurs


      }//Fin de verification du nombre de personne
    }//Fin de partie
  })




// client id : 744960483668263026
//permission : 1211176960

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
