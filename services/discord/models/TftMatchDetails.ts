/* jshint indent: 2 */

import { DataTypes, Model, Sequelize } from "sequelize";

export interface TftMatchDetailsAttributes {
  id?: number;
  startTime?: Date;
  duration?: number;
  riotId?: string;
}

export class TftMatchDetails
  extends Model<TftMatchDetailsAttributes, TftMatchDetailsAttributes>
  implements TftMatchDetailsAttributes {
  id?: number;
  startTime?: Date;
  duration?: number;
  riotId?: string;

  static initModel(sequelize: Sequelize) {
    TftMatchDetails.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "start_time"
        },
        duration: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        riotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: "riot_match_id",
          field: "riot_id"
        }
      },
      {
        sequelize,
        tableName: "tft_match_details",
        schema: "public",
        timestamps: false
      }
    );
    return TftMatchDetails;
  }
}