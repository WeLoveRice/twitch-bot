/* jshint indent: 2 */

import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TftParticipantResultAttributes {
  id?: number;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;
  postMatchTier?: string;
  postMatchRank?: string;
  postMatchLp?: number;
}

export class TftParticipantResult extends Model<TftParticipantResultAttributes, TftParticipantResultAttributes> implements TftParticipantResultAttributes {
  id?: number;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;
  postMatchTier?: string;
  postMatchRank?: string;
  postMatchLp?: number;

  static initModel(sequelize: Sequelize) {
    TftParticipantResult.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: false,
      field: 'tft_summoner_riot_id'
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
    postMatchLp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'post_match_lp'
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
