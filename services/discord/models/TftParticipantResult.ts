/* jshint indent: 2 */

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TftParticipantResultAttributes {
  id: number;
  goldLeft: number;
  placement: number;
  lastRound: number;
  postMatchTier: string;
  postMatchRank: string;
  postMatchLp: number;
}

export type TftParticipantResultCreationAttributes = Optional<
  TftParticipantResultAttributes,
  "id"
>;
export class TftParticipantResult
  extends Model<
    TftParticipantResultAttributes,
    TftParticipantResultCreationAttributes
  >
  implements TftParticipantResultAttributes {
  id!: number;
  goldLeft!: number;
  placement!: number;
  lastRound!: number;
  postMatchTier!: string;
  postMatchRank!: string;
  postMatchLp!: number;

  static initModel(sequelize: Sequelize) {
    TftParticipantResult.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
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
        postMatchLp: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "post_match_lp"
        }
      },
      {
        sequelize,
        tableName: "tft_participant_result",
        schema: "public",
        timestamps: false
      }
    );
    return TftParticipantResult;
  }
}
