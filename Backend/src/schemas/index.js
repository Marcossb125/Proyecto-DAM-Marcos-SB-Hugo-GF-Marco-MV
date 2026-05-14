import z from 'zod';

export const loginPayload = z.object({
  nickname: z.string().min(3).max(20).trim(),
  password: z.string().min(6).max(100).trim(),
});

export const registerPayload = z.object({
  nickname: z.string().min(3).max(20).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).max(100).trim(),
});

export const createRoomPayload = z.object({
  nombre: z.string().min(1).max(100).trim(),
  jugadores_limite: z.number().min(2).max(4),
  hostNombre: z.string().min(3).max(20).trim(),
});

export const deleteRoomPayload = z.object({
  nombre: z.string().min(1).max(100).trim(),
  hostNombre: z.string().min(3).max(20).trim(),
});

export const banderaPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
  nombre: z.string(),
  bandera: z.object({
    layout: z.string().min(1),
    colors: z.array(z.string())
  })
});

export const obtenerBanderaPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
});

export const generalPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
  generalId: z.number()
});

export const obtenerGeneralPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
});

export const joinMatchPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
});

export const playerReadyPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
});

export const buildPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  territoryId: z.string().min(1),
  buildingType: z.string().min(1),
});

export const destroyBuildingPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  territoryId: z.string().min(1),
});

export const recruitPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  territoryId: z.string().min(1),
  troopSize: z.number().min(1),
});

export const queueMovePayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  armyId: z.string().min(1),
  toTerritoryId: z.string().min(1),
});

export const cancelMovePayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  armyId: z.string().min(1),
});

export const retreatPayload = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  armyId: z.string().min(1),
});


