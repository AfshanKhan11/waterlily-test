import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";

export interface surveyResponseAttributes {
    id: number;
    user_id: number;
    question_id: number;
    answer: string;
    survey_form_id: string;
    createdAt: Date;
    updatedAt: Date;
}

type surveyResponseCreation = Optional<surveyResponseAttributes, "id" | "createdAt" | "updatedAt">;

class SurveyResponse
    extends Model<surveyResponseAttributes, surveyResponseCreation>
    implements surveyResponseAttributes {
    public id!: number;
    public user_id!: number;
    public question_id!: number;
    public answer!: string;
    public survey_form_id!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

SurveyResponse.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        survey_form_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "SurveyResponse",
        tableName: "survey_responses",
        timestamps: true,

    }
);

User.hasMany(SurveyResponse, {
    foreignKey: "user_id",
    as: "survey_responses",
});

SurveyResponse.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

export default SurveyResponse;