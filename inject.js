setTimeout(() => telegramPosting.init(), 100);

const telegramPosting = {
  firebaseConfig: {
    apiKey: "AIzaSyAdfYrlyXBgVxWBc4GLUHhFpsolDofBNmI",
    authDomain: "murraya-2f5d7.firebaseapp.com",
    projectId: "murraya-2f5d7",
    storageBucket: "murraya-2f5d7.appspot.com",
    messagingSenderId: "1092792667601",
    appId: "1:1092792667601:web:fabeea632642084a8464f0"
  },
  init() {
    // Инициализация Firebase базы данных
    firebase.initializeApp(this.firebaseConfig);
    const firestoreDB = firebase.firestore();
    this.artworkRef = firestoreDB.collection("artwork");

    // Создание кнопки поста
    this.createButton();
  },
  createButton() {
    $('.menu-level')
      .append($("<li/>", {class: "main-menu-bar-it0em"})
        .append($("<a/>", {class: "main-menu-bar-link menu-item-telegram"})
          .append($("<span/>", {class: "bs-btn bs-btn-primary", text: "to telegram"}))));
    $(".menu-item-telegram").bind("click", () => telegramPosting.clickToAddArtwork());
  },
  updateButton(setting) {
    const telegram_button = $('.menu-item-telegram').find('.bs-btn')
    telegram_button.css({"background-color": setting.color}).text(setting.text)
    if (!setting.stop) {
      setTimeout(() => {
        telegram_button.css("background-color", "")
        telegram_button.text('to telegram')
      }, 2000);
    }
  },
  async clickToAddArtwork() {
    this.updateButton({color: "#004ffa", text: "processing", stop: true});

    const artworkHash = window.location.pathname.replaceAll('/artwork/', '');

    if (!artworkHash) {
      log("Artwork hash not found!", "error");
      return;
    }
    this.getArtworkByHash(artworkHash).then((artworkData) => {
      if (artworkData) {
        this.updateButton({color: "#fa0000", text: "element exist"});
      } else {
        this.addArtworkByHash(artworkHash)
      }
    })
  },
  async addArtworkByHash(artworkHash) {
    const artwork = {planned: true, posted: false};
    try {
      const docRef = await this.artworkRef.doc(artworkHash).set(artwork);
      this.updateButton({color: "#21fa00", text: "success added"});
    } catch (error) {
      log('Error Adding Artwork: ' + error, "error");
    }

    return artwork;
  },
  async getArtworkByHash(artworkHash) {
    let artwork;
    try {
      let doc = await this.artworkRef.doc(artworkHash).get();
      if (doc.exists)
        artwork = {id: doc.id, ...doc.data()};
    } catch (error) {
      log('Error in getting artwork: ' + error, "error");
    }
    return artwork;
  }
}

function log(massage, type = "info") {
  let typeColor = {
    info: "rgb(92 0 224)",
    success: "rgb(0 224 36)",
    error: "rgb(224 0 0)",
  }
  $('<div/>', {
    css: {"position": "absolute", "top": "30px", "right": "0px", "z-index": "99999"},
    class: "extension_popup"
  })
    .append($('<div/>', {
      css: {"background": typeColor[type], "color": "#f1f1f1", "padding": "1px 20px", "border-radius": "6px"}
    }).text(massage || "test"))
    .appendTo("body");
  setTimeout(() => $('.extension_popup').remove(), 3000);
}
