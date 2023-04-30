setTimeout(() => artstationExtention.init(), 100);


const artstationExtention = {
  headers: new Headers(),
  init() {
    this.headers.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoib3JhbmdlIn0.e2eKjEmta0gVy5Y1rSTwC8ZXo1AWxLVzdYATZ50oSm4");
    this.headers.append("Content-Type", "application/json");
    // Создание кнопки поста
    this.createButton();
  },
  createButton() {
    $('.menu-level-1-buttons')
      .append($("<li/>", {class: "main-menu-bar-item underline-none"})
        .append($("<a/>", {class: "main-menu-bar-link menu-item-telegram"})
          .append($("<span/>", {class: "bs-btn bs-btn-primary", text: "to telegram"}))));
    $(".menu-item-telegram").bind("click", () => this.clickToAddArtwork());
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
    await this.getArtworkByHash(artworkHash)
      .then((artworkData) => {
        if (!artworkData) {
          this.addArtworkByHash(artworkHash)
        }
      })
  },
  async addArtworkByHash(artworkHash) {
    try {
      let requestOptions = {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({"hash": artworkHash})
      };
      fetch("https://orangedb.buhe.ga/hashes", requestOptions)
        .then(response => response.text())
        .then(result => {
          this.updateButton({color: "#21fa00", text: "success added"});
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      log('Error Adding Artwork: ' + error, "error");
    }
  },
  async getArtworkByHash(artworkHash) {
    let artwork;
    try {
      await fetch("https://orangedb.buhe.ga/hashes?hash=eq." + artworkHash,
        {method: 'GET', headers: this.headers}
      )
        .then(response => response.json())
        .then(result => {
          if (result.length !== 0) {
            this.updateButton({color: "#fa0000", text: "element exist"});
            artwork = result[0];
          }
        })
        .catch(error => console.log('error', error));
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
