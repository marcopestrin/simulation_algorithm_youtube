module.exports = Object.freeze({
  // quanto impatta la semplice visualizzazione di un video in un determinato canale
  IMPACT_VIEW_FOR_CHANNEL: 1,

  // impatto delle azioni sul video stesso per capire se è virale o meno
  INCREMENT_VALUE_BY_LIKE: 2,
  INCREMENT_VALUE_BY_SHARE: 3,
  INCREMENT_VALUE_BY_COMMENT: 3,

  // identificativi delle azioni
  ID_ACTION_LIKE: 1,
  ID_ACTION_SHARE: 2,
  ID_ACTION_COMMENT: 3,
  ID_ACTION_TIME_WATCH: 4,

  // impatto delle azioni che hanno sulle categorie
  WEIGHT_TIME_WATCH_IN_BEST_CAT: 12,
  WEIGHT_LIKE_IN_BEST_CAT: 11,
  WEIGHT_SHARE_IN_BEST_CAT: 12,
  WEIGHT_COMMENT_IN_BEST_CAT: 11,
  
  // soglie del tempo di visualizzazione
  POINTBREAK_TIME_WATCH_1: 50,
  POINTBREAK_TIME_WATCH_2: 70,
  POINTBREAK_TIME_WATCH_3: 90,
  POINTBREAK_TIME_WATCH_4: 100,

  // impatto del tempo vi visualizzazione che ha sulle categorie
  // va a moltiplicarsi con la durata del video
  INCREMENT_VALUE_1_POINTBREAK: 2,
  INCREMENT_VALUE_2_POINTBREAK: 3,
  INCREMENT_VALUE_3_POINTBREAK: 4,
  INCREMENT_VALUE_4_POINTBREAK: 5,

  // attenzione, non è retroattivo il cambiamento dei seguenti valori
  CATEGORIES: [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Sport' },
    { id: 3, name: 'Food' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Entertainment' },
    { id: 6, name: 'Travel' },
  ],

  LIMIT_CATEGORIES_SUGGESTION: 3,
  LIMIT_CHANNELS_SUGGESTION: 3,

  // variabili per il database
  COLLECTION_NAME_VIDEO: 'video',
  COLLECTION_NAME_PROFILATION: 'user',
  DATABASE_NAME: 'youtube'
})  