/* jshint indent: 2 */

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TftMatchHistoryAttributes {
  id: number;
  tftParticipantResultId: number;
  tftMatchDetailsRiotId: string;
  tftSummonerRiotId: string;
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
  tftSummonerRiotId!: string;

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
          unique: "match_participant_unq",
          field: "tft_participant_result_id"
        },
        tftMatchDetailsRiotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          references: {
            model: "tft_match_details",
            key: "riot_id"
          },
          unique: "match_participant_unq",
          field: "tft_match_details_riot_id"
        },
        tftSummonerRiotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          references: {
            model: "tft_summoner",
            key: "riot_id"
          },
          field: "tft_summoner_riot_id"
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
