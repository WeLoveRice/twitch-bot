/* jshint indent: 2 */

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TftMatchHistoryAttributes {
  id: number;
  tftParticipantResultId: number;
  tftMatchDetailsRiotId: string;
  tftSummonerId: string;
}

export type TftMatchHistoryCreationAttributes = Optional<
  TftMatchHistoryAttributes,
  "id"
>;

export class TftMatchHistory
  extends Model<TftMatchHistoryAttributes, TftMatchHistoryCreationAttributes>
  implements TftMatchHistoryAttributes {
  id!: number;
  tftParticipantResultId!: number;
  tftMatchDetailsRiotId!: string;
  tftSummonerId!: string;

  static initModel(sequelize: Sequelize) {
    TftMatchHistory.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        tftParticipantResultId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "tft_participant_result_id"
        },
        tftMatchDetailsRiotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "tft_match_details_riot_id"
        },
        tftSummonerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "tft_summoner_id"
        }
      },
      {
        sequelize,
        tableName: "tft_match_history",
        schema: "public",
        timestamps: false
      }
    );
    return TftMatchHistory;
  }
}
