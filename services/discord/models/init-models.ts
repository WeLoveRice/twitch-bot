import { Sequelize } from "sequelize";
import { TftSummoner, TftSummonerAttributes } from "./TftSummoner";
import { TftMatchHistory, TftMatchHistoryAttributes } from "./TftMatchHistory";
import { TftMatchDetails, TftMatchDetailsAttributes } from "./TftMatchDetails";
import { TftParticipantResult, TftParticipantResultAttributes } from "./TftParticipantResult";

export {
  TftSummoner, TftSummonerAttributes,
  TftMatchHistory, TftMatchHistoryAttributes,
  TftMatchDetails, TftMatchDetailsAttributes,
  TftParticipantResult, TftParticipantResultAttributes,
};

export function initModels(sequelize: Sequelize) {
  TftSummoner.initModel(sequelize);
  TftMatchHistory.initModel(sequelize);
  TftMatchDetails.initModel(sequelize);
  TftParticipantResult.initModel(sequelize);

  return {
    TftSummoner,
    TftMatchHistory,
    TftMatchDetails,
    TftParticipantResult,
  };
}
