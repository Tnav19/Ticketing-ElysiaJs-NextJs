import { Model, Column, Table, DataType } from "sequelize-typescript";

export type PriorityEntity = {
    id?: number;
    sla: number; // Service Level Agreement in time unit (e.g., hours)
    level: number; // Priority level (e.g., "Low", "Medium", "High")
    is_active: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
};

@Table({
    tableName: "priorities",
    paranoid: true, // Soft delete (pakai deleted_at)
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
})
export class Priority extends Model<PriorityEntity> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false, // Cannot be empty
    })
    sla!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false, // Cannot be empty
    })
    level!: number;

    @Column({
        type: DataType.TINYINT,
        defaultValue: 0,
        allowNull: false, // Cannot be empty
    })
    is_active!: number;


    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    created_at!: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    updated_at!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena soft delete
    })
    deleted_at?: Date | null;
}
