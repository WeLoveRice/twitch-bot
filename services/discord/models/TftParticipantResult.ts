/* jshint indent: 2 */

import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TftParticipantResultAttributes {
  id?: number;
  postMatchTier?: string;
  postMatchRank?: string;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;
}

export class TftParticipantResult extends Model<TftParticipantResultAttributes, TftParticipantResultAttributes> implements TftParticipantResultAttributes {
  id?: number;
  postMatchTier?: string;
  postMatchRank?: string;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;

  static initModel(sequelize: Sequelize) {
    TftParticipantResult.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    postMatchTier: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'post_match_tier'
    },
    postMatchRank: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'post_match_rank'
    },
    goldLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'gold_left'
    },
    placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastRound: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'last_round'
    },
    tftSummonerRiotId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'tft_summoner_riot_id'
    }
  }, {
    sequelize,
    tableName: 'tft_participant_result',
    schema: 'public',
    timestamps: false
    });
  return TftParticipantResult;
  }
}
