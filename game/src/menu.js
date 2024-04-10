var menuState = {
    create: function () {
      if (!game.global.music) {
        this.music = game.add.audio("soundtrack_menu", 0.8, true);
        this.music.play();
        game.global.music = true;
      }
      this.background = game.add.image(
        game.world.centerX,
        game.world.height,
        "menu_background"
      );
      this.background.anchor.setTo(0.5, 1);
  
      this.robot = game.add.image(
        game.world.centerX,
        game.world.height + 120,
        "menu_foreground"
      );
      this.robot.anchor.setTo(0.5, 1);
  
      this.displayScores();
      // game.add.image(0, 0, 'menu_foreground');
      this.title = game.add.image(game.world.centerX, 210, "title");
  
      this.connectButton = game.add.button(
        120,
        275,
        "connect_button",
        this.connectMetaMask,
        this
      );
      this.tweenButtons(this.connectButton);
  
      this.muteButton = game.add.button(
        110,
        460,
        "mute_button",
        this.muteSound,
        this
      );
      this.tweenButtons(this.muteButton);
      if (game.sound.mute) {
        this.muteButton.frame = 1;
      }
  
      this.helpButton = game.add.button(
        game.world.centerX,
        470,
        "help_button",
        this.helpPopup,
        this
      );
      this.tweenButtons(this.helpButton);
  
      this.helpImage = game.add.button(
        game.world.centerX,
        game.world.centerY,
        "help_image",
        this.helpPopup,
        this
      );
      this.helpImage.anchor.setTo(0.5, 0.5);
      this.helpImage.kill();
      this.help = false;
    },
  
    startGame: function () {
      game.state.start("play");
    },
  
    helpPopup: function () {
      this.help = !this.help;
      if (this.help) {
        this.helpImage.revive();
      } else {
        this.helpImage.kill();
      }
    },
  
    registerPlayer: async function (walletAddress) {
      try {
        const response = await fetch("http://localhost:3001/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
        });
        const data = await response.json();
        console.log("Registration response:", data);
        if (data.status === "success") {
          if (this.connectButton) {
            this.connectButton.visible = false;
          }
          if (this.registerbutton) {
            this.registerbutton.visible = false;
          }
          this.playButton = game.add.button(
            185,
            310,
            "play_button",
            this.startGame,
            this
          );
          this.tweenButtons(this.playButton);
        }
      } catch (error) {
        console.log("Error registering player:", error);
      }
    },
  
    connectMetaMask: async function () {
      if (window.ethereum) {
        try {
          const provider = window.ethereum;
          await provider.request({ method: "eth_requestAccounts" });
          console.log("Connected to MetaMask:", provider);
  
          const walletAddress = await provider.request({
            method: "eth_accounts",
          });
          console.log("Wallet address:", walletAddress[0]);
  
          // fetching address from MRU
          const response = await fetch("http://localhost:3000/");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const datafromMRU = await response.json();
          const gameData = await datafromMRU.state.game;
          console.log("Game data:", gameData);
          const playeraddress = await gameData.find((player) => {
            return player.address.toLowerCase() == walletAddress[0].toLowerCase();
          });
          console.log(playeraddress);
  
          if (playeraddress) {
            if (this.connectButton) {
              this.connectButton.visible = false;
            }
            this.playButton = game.add.button(
              185,
              310,
              "play_button",
              this.startGame,
              this
            );
            this.tweenButtons(this.playButton);
          } else {
            if (this.connectButton) {
              this.connectButton.visible = false;
            }
            this.registerbutton = game.add.button(
              185,
              310,
              "register_button",
              this.registerPlayer.bind(this, walletAddress[0]),
              this
            );
            this.tweenButtons(this.playButton);
          }
        } catch (error) {
          console.error("Error connecting MetaMask:", error);
        }
      } else {
        console.error("MetaMask not detected");
      }
    },
  
    credits: function () {
      game.state.start("credits");
    },
  
    muteSound: function () {
      game.sound.mute = !game.sound.mute;
      if (!game.global.mute) {
        game.global.mute = true;
        this.muteButton.frame = 1;
      } else {
        game.global.mute = false;
        this.muteButton.frame = 0;
      }
    },
  
    displayScores: function () {
      //High score
      if (!localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", 0);
      }
  
      if (game.global.score > localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", game.global.score);
      }
  
      var lastScore = game.add.text(
        game.world.centerX,
        30,
        "Last Run: " + game.global.score + " meters",
        {
          font: "24px Arial",
          fill: "#a0a0a0",
        }
      );
      lastScore.anchor.setTo(0.5, 0.5);
      var bestScore = game.add.text(
        game.world.centerX,
        60,
        "Best Run: " + Math.ceil(localStorage.getItem("bestScore")) + " meters",
        {
          font: "24px Arial",
          fill: "#ccc",
        }
      );
      bestScore.anchor.setTo(0.5, 0.5);
    },
  
    tweenButtons: function (button) {
      var randomInt = game.rnd.integerInRange(5, 10);
      game.add
        .tween(button)
        .to(
          {
            y: button.y + randomInt,
          },
          2000
        )
        .to(
          {
            y: button.y - randomInt,
          },
          2000
        )
        .loop()
        .start();
    },
  };
  