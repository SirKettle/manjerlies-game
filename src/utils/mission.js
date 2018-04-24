const levels = [
  {
    time: 'number | void',
    disableEarlySuccess: 'boolean', // set true to force user to survive entire time
    actors: [
      {
        type: 'string',
        min: 'number',
        max: 'number',
        toKill: 'number | void', // number to kill
        toSave: 'number | void', // numbers left at end of timed game
        toNotKill: 'number | void' // immediate fail if kill this many
      }
    ],
    player: {
      maxBumps: 'number | void', // immediate fail if has this many
      maxShots: 'number | void' // immediate fail if has this many
    }
  }
];

function checkMission() {
  const isTimedGame = !!time;

  if (isTimedGame && isTimeUp) {
    gameOver(GAME_OVER.TIME_UP);
  }

  const actorsToKill = actors.filter(actor => !!actor.toKill);
  const actorsToNotKill = actors.filter(actor => !!actor.toNotKill);
  const actorsToSave = actors.filter(actor => !!actor.toSave);

  const isKillGame = actorsToKill.length > 0;
  const isNotKillGame = actorsToNotKill.length > 0;
  const isSaveGame = actorsToSave.length > 0;

  // Check for immediate fails
  if (player.maxBumps && currentLevel.bumpsCount >= player.maxBumps) {
    gameOver(GAME_OVER.TOO_MANY_BUMPS);
  }

  if (player.maxShots && currentLevel.shotCount >= player.maxShots) {
    gameOver(GAME_OVER.TOO_MANY_SHOTS);
  }

  if (
    isNotKillGame &&
    actorsToNotKill.some(
      actor => currentLevel.kills[actor.type] >= actor.toNotKill
    )
  ) {
    gameOver(GAME_OVER.TOO_MANY_KILLED);
  }

  const successChecks = [];

  // Check for immediate success
  if (isKillGame) {
    successChecks.push(
      actorsToKill.every(
        actor => currentLevel.kills[actor.type] >= actor.toKill
      )
    );
  }

  if (isSaveGame) {
    successChecks.push(
      actorsToSave.every(
        actor => currentLevel.alive[actor.type] >= actor.toSave
      )
    );
  }

  if (!currentLevel.disableEarlySuccess && successChecks.length > 0) {
    const levelComplete = successChecks.every(
      successCheck => successCheck === true
    );
    if (levelComplete) {
      gameOver(GAME_OVER.MISSION_COMPLETE);
    }
  }
}
