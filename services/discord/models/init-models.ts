import { Sequelize } from "sequelize";
import { TftSummoner, TftSummonerAttributes } from "./TftSummoner";
import {
  TftParticipantResult,
  TftParticipantResultAttributes
} from "./TftParticipantResult";
import { TftMatchHistory, TftMatchHistoryAttributes } from "./TftMatchHistory";
import { TftMatchDetails, TftMatchDetailsAttributes } from "./TftMatchDetails";

export {
  TftSummoner,
  TftSummonerAttributes,
  TftParticipantResult,
  TftParticipantResultAttributes,
  TftMatchHistory,
  TftMatchHistoryAttributes,
  TftMatchDetails,
  TftMatchDetailsAttributes
};

export function initModels(sequelize: Sequelize) {
  TftSummoner.initModel(sequelize);
  TftParticipantResult.initModel(sequelize);
  TftMatchHistory.initModel(sequelize);
  TftMatchDetails.initModel(sequelize);

  return {
    TftSummoner,
    TftParticipantResult,
    TftMatchHistory,
    TftMatchDetails
  };
}
