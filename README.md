# Installation
npm install
nodemon index.js
cd youtube
npm install
npm start

# Logs
Tipi di interazione:
- condivisione del Video
- mi piace al Video
- commento al Video
- tempo di visualizzazione del video

ogni interazione ha un peso differente che va a determinare
quanto importante è quel canale e quella tipologia di video
(in base alla categoria) su quel determinato utente iscritto.

viene fatta una preferenza sulle categorie e i canali in base
alle interazione degli utenti.

ogni video tiene conto pure di quante interazioni ha avuto
in modo da creare un determiato hype in base alla viralità
che sta subendo.


# To Fix
- più azioni insieme se la categoria e/o canale sono nuovi, viene
letta come dato non presente.

# To Do:
- flag viralità
- da mettere a cron hype
- getSuggestedVideos: rimuovere doppioni

# Firme body:
## addLike
- idVideo
- idUser

## share
- idVideo
- idUser

## addComment
- idVideo
- idUser

## feedbackTimeWatched
- percentage
- idVideo
- idUser