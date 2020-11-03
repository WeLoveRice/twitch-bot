/* jshint indent: 2 */

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TftSummonerAttributes {
  id: number;
  name: string;
  puuid: string;
  riotId: string;
}

export type TftSummonerCreationAttributes = Optional<
  TftSummonerAttributes,
  "id"
>;

export class TftSummoner
  extends Model<TftSummonerAttributes, TftSummonerCreationAttributes>
  implements TftSummonerAttributes {
  id!: number;
  name!: string;
  puuid!: string;
  riotId!: string;

  static initModel(sequelize: Sequelize) {
    TftSummoner.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        puuid: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        riotId: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: "riot_id_unq",
          field: "riot_id"
        }
      },
      {
        sequelize,
        tableName: "tft_summoner",
        schema: "public",
        timestamps: false
      }
    );
    return TftSummoner;
  }
}
