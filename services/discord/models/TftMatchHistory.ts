/* jshint indent: 2 */

import { DataTypes, Model, Sequelize } from "sequelize";

export interface TftMatchHistoryAttributes {
  id?: number;
  tftParticipantResultId?: number;
  tftMatchDetailsRiotId?: string;
}

export class TftMatchHistory
  extends Model<TftMatchHistoryAttributes, TftMatchHistoryAttributes>
  implements TftMatchHistoryAttributes {
  id?: number;
  tftParticipantResultId?: number;
  tftMatchDetailsRiotId?: string;

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
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "tft_participant_result_old",
            key: "id"
          },
          unique: "match_participant_unq",
          field: "tft_participant_result_id"
        },
        tftMatchDetailsRiotId: {
          type: DataTypes.TEXT,
          allowNull: true,
          references: {
            model: "tft_match_details",
            key: "riot_id"
          },
          unique: "match_participant_unq",
          field: "tft_match_details_riot_id"
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
