/* jshint indent: 2 */

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TftMatchHistoryAttributes {
  id?: number;
  tftParticipantResultId?: number;
  tftMatchDetailsRiotId?: string;
  tftSummonerId?: number;
}

export type TftMatchHistoryCreationAttributes = Optional<
  TftMatchHistoryAttributes,
  "id"
>;

export class TftMatchHistory
  extends Model<TftMatchHistoryAttributes, TftMatchHistoryAttributes>
  implements TftMatchHistoryAttributes {
  id?: number;
  tftParticipantResultId?: number;
  tftMatchDetailsRiotId?: string;
  tftSummonerId?: number;

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
          references: {
            model: "tft_participant_result",
            key: "id"
          },
          unique: "tft_participant_result_id_unq",
          field: "tft_participant_result_id"
        },
        tftMatchDetailsRiotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          references: {
            model: "tft_match_details",
            key: "riot_id"
          },
          field: "tft_match_details_riot_id"
        },
        tftSummonerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "tft_summoner",
            key: "id"
          },
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
