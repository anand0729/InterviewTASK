module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
         
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null

        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['a', 'i', 'd'],
            defaultValue: 'a',
            comment: "a - Active, i - Inactive, d - Deleted"
        },
         
         
        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),

        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),

        }
    });
   


    return user;
}