/* jshint indent: 2 */

import { DataTypes, Model, Sequelize } from "sequelize";

export interface TftParticipantResultOldAttributes {
  id?: number;
  postMatchTier?: string;
  postMatchRank?: string;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;
}

export class TftParticipantResultOld
  extends Model<
    TftParticipantResultOldAttributes,
    TftParticipantResultOldAttributes
  >
  implements TftParticipantResultOldAttributes {
  id?: number;
  postMatchTier?: string;
  postMatchRank?: string;
  goldLeft?: number;
  placement?: number;
  lastRound?: number;
  tftSummonerRiotId?: string;

  static initModel(sequelize: Sequelize) {
    TftParticipantResultOld.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        postMatchTier: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "post_match_tier"
        },
        postMatchRank: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "post_match_rank"
        },
        goldLeft: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "gold_left"
        },
        placement: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        lastRound: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "last_round"
        },
        tftSummonerRiotId: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "tft_summoner_riot_id"
        }
      },
      {
        sequelize,
        tableName: "tft_participant_result_old",
        schema: "public",
        timestamps: false
      }
    );
    return TftParticipantResultOld;
  }
}