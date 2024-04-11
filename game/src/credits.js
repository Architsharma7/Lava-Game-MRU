var creditsState = {
    create: async function () {
      background = new Background(game);
      background.create();
      this.returnButton = game.add.button(
        64,
        64,
        "back_button",
        this.goToMenu,
        this
      );
  
      this.leaderboardHeading = game.add.text(
        game.world.centerX,
        100,
        "Leaderboard",
        {
          fill: "#fff",
          fontSize: 48,
        }
      );
      this.leaderboardHeading.anchor.setTo(0.5, 0.5);
  
      try {
        const response = await fetch("http://localhost:3000/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const datafromMRU = await response.json();
        const leaderboardData = datafromMRU.state.leaderboard;
        var startY = 200;
        var lineHeight = 50;
        leaderboardData.forEach(function (entry, index) {
          var posY = startY + index * lineHeight;
  
          var rankText = game.add.text(100, posY, index + 1 + ".", {
            fill: "#fff",
            fontSize: 24,
          });
          rankText.anchor.setTo(0.5, 0.5);
  
          const slicedAddress =
            entry.address.slice(0, 8) + "..." + entry.address.slice(-8);
          var addressText = game.add.text(300, posY, slicedAddress, {
            fill: "#fff",
            fontSize: 24,
          });
          addressText.anchor.setTo(0.5, 0.5);
  
          var scoreText = game.add.text(500, posY, entry.score, {
            fill: "#fff",
            fontSize: 24,
          });
          scoreText.anchor.setTo(0.5, 0.5);
        });
      } catch (error) {
        console.log(error);
      }
    },
  
    goToMenu: function () {
      game.state.start("menu");
    },
  };
  