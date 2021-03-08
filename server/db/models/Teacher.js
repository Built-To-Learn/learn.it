const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

const SALT_ROUNDS = 5

const Teacher = db.define('teacher', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
    },
    githubId: {
        type: Sequelize.INTEGER,
    },
})

module.exports = Teacher

/**
 * instanceMethods
 */
Teacher.prototype.correctPassword = function (candidatePwd) {
    return bcrypt.compare(candidatePwd, this.password)
}

Teacher.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT)
}

/**
 * classMethods
 */

Teacher.authenticate = async function ({ email, password }) {
    const teacher = await this.findOne({ where: { email } })
    if (!teacher || !(await teacher.correctPassword(password))) {
        const error = Error('Incorrect username/password')
        error.status = 401
        throw error
    }
    return teacher.generateToken()
}

Teacher.findByToken = async function (token) {
    try {
        const { id } = await jwt.verify(token, process.env.JWT)
        const teacher = Teacher.findByPk(id)
        if (!teacher) {
            throw 'nooo'
        }
        return teacher
    } catch (ex) {
        const error = Error('bad token')
        error.status = 401
        throw error
    }
}

Teacher.authenticateGithub = async function (code) {
    //step 1: exchange code for token
    let response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        },
        {
            headers: {
                accept: 'application/json',
            },
        }
    )
    const { data } = response
    if (data.error) {
        const error = Error(data.error)
        error.status = 401
        throw error
    }
    //step 2: use token for user info
    response = await axios.get('https://api.github.com/user', {
        headers: {
            authorization: `token ${data.access_token}`,
        },
    })
    const { email, id } = response.data

    //step 3: either find user or create user
    let teacher = await Teacher.findOne({ where: { githubId: id, email } })
    if (!teacher) {
        teacher = await Teacher.create({ email, githubId: id })
    }
    //step 4: return jwt token
    return teacher.generateToken()
}



/**
 * hooks
 */
const hashPassword = async (teacher) => {
    if (teacher.changed('password')) {
        teacher.password = await bcrypt.hash(teacher.password, SALT_ROUNDS)
    }
}

Teacher.beforeCreate(hashPassword)
Teacher.beforeUpdate(hashPassword)
Teacher.beforeBulkCreate((teachers) => {
    teachers.forEach(hashPassword)
})
