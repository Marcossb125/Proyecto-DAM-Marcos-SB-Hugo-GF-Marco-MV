import * as gameEngine from './gameEngine.js';
import { getMatch } from './matchStore.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function that will be called by the game event loop or handler
// after a phase change to trigger bot actions
async function runBotsForCurrentPhase(matchId, emitUpdateAndLog, emitSummary) {
  const state = getMatch(matchId);
  if (!state) return;

  const bots = state.players.filter(p => p.isBot);
  if (bots.length === 0) return;

  for (const bot of bots) {
    if (bot.isReady) continue; // Already acted

    // Random delay between 1 and 3 seconds
    const waitTime = Math.floor(Math.random() * 2000) + 1000;
    await delay(waitTime);

    // Re-fetch state in case it changed during delay
    const currentState = getMatch(matchId);
    if (!currentState || currentState.currentPhase !== state.currentPhase) return;

    let res = null;

    switch (currentState.currentPhase) {
      case 'CONSTRUCCION':
        res = botActionConstruccion(currentState, bot);
        break;
      case 'RECLUTAMIENTO':
        res = botActionReclutamiento(currentState, bot);
        break;
      case 'MOVIMIENTO':
        res = botActionMovimiento(currentState, bot);
        break;
      case 'RECAUDACION':
        // Nothing special to do, just get ready
        res = { state: currentState, logs: [] };
        break;
    }

    if (res) {
      if (res.logs && res.logs.length > 0) {
        res.logs.forEach(log => emitUpdateAndLog(null, log));
      }
      
      // Finally, set the bot as ready
      const readyRes = gameEngine.applyPlayerReady(getMatch(matchId), bot.id);
      if (readyRes.logs && readyRes.logs.length > 0) {
        readyRes.logs.forEach(log => emitUpdateAndLog(null, log));
      }

      if (readyRes.phaseAdvanced) {
        // Si hubo recaudación, emitir resumen antes del estado
        if (readyRes.recaudacionSummary && emitSummary) {
          emitSummary(readyRes.recaudacionSummary, readyRes.combatResults);
        } else if (readyRes.combatResults && emitSummary) {
          emitSummary(null, readyRes.combatResults);
        }
        // Emit state update as phase advanced
        emitUpdateAndLog(getMatch(matchId), null);
        // Trigger bots for the new phase
        setTimeout(() => runBotsForCurrentPhase(matchId, emitUpdateAndLog, emitSummary), 0);
        break;
      } else {
        // Even if phase didn't advance, emit state update to show bot is ready
        emitUpdateAndLog(getMatch(matchId), null);
      }
    }
  }
}

function botActionConstruccion(state, bot) {
  // Simple AI: Try to build a FACTORY or MURO if we have enough credits
  // and we have a territory without building.
  let logs = [];
  const owned = state.territories.filter(t => t.ownerId === bot.id && !t.buildingType && !t.isRefinery && !t.hasSupremeBase);
  
  if (owned.length > 0) {
    const t = owned[0];
    if (bot.credits >= 300) {
      const res = gameEngine.applyBuild(state, bot.id, t.id, 'FABRICA');
      if (!res.error) logs.push(...res.logs);
    } else if (bot.credits >= 100) {
      const res = gameEngine.applyBuild(state, bot.id, t.id, 'MURO');
      if (!res.error) logs.push(...res.logs);
    }
  }
  return { state, logs };
}

function botActionReclutamiento(state, bot) {
  let logs = [];
  const hqOrBarracks = state.territories.find(t => t.ownerId === bot.id && (t.hasSupremeBase || t.buildingType === 'CUARTEL'));
  
  if (hqOrBarracks && bot.credits >= 50 && bot.manpower >= 10) {
    const troopsToBuy = Math.min(Math.floor(bot.credits / 50), Math.floor(bot.manpower / 10), 10);
    if (troopsToBuy > 0) {
      const res = gameEngine.applyRecruit(state, bot.id, hqOrBarracks.id, troopsToBuy);
      if (!res.error) logs.push(...res.logs);
    }
  }
  return { state, logs };
}

function botActionMovimiento(state, bot) {
  let logs = [];
  const army = state.armies.find(a => a.ownerId === bot.id && !a.hasActedThisTurn);
  
  if (army) {
    const currentTerritory = state.territories.find(t => t.id === army.territoryId);
    if (currentTerritory) {
      // Find adjacent enemy or neutral territories
      const adjacentEnemies = state.territories.filter(t => currentTerritory.adjacentIds.includes(t.id) && t.ownerId !== bot.id);
      
      if (adjacentEnemies.length > 0) {
        const target = adjacentEnemies[Math.floor(Math.random() * adjacentEnemies.length)];
        const res = gameEngine.applyQueueMove(state, bot.id, army.id, target.id);
        if (!res.error) logs.push(...res.logs);
      }
    }
  }
  return { state, logs };
}

export {
  runBotsForCurrentPhase
};
