const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

const SALT_ROUNDS = 5

const Student = db.define('student', {
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

module.exports = Student

/**
 * instanceMethods
 */
Student.prototype.correctPassword = function (candidatePwd) {
    return bcrypt.compare(candidatePwd, this.password)
}

Student.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT)
}

/**
 * classMethods
 */
Student.authenticate = async function ({ email, password }) {
    const student = await this.findOne({ where: { email } })
    if (!student || !(await student.correctPassword(password))) {
        const error = Error('Incorrect username/password')
        error.status = 401
        throw error
    }
    return student.generateToken()
}

Student.findByToken = async function (token) {
    try {
        console.log(token)
        const { id } = await jwt.verify(token, process.env.JWT)
        const student = Student.findByPk(id)
        if (!student) {
            throw 'nooo'
        }
        return student
    } catch (ex) {
        const error = Error('bad token')
        error.status = 401
        throw error
    }
}

Student.authenticateGithub = async function (code) {
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
    let student = await Student.findOne({ where: { githubId: id, email } })
    if (!student) {
        student = await Student.create({ email, githubId: id })
    }
    //step 4: return jwt token
    return student.generateToken()
}

/**
 * hooks
 */
const hashPassword = async (student) => {
    if (student.changed('password')) {
        student.password = await bcrypt.hash(student.password, SALT_ROUNDS)
    }
}

Student.beforeCreate(hashPassword)
Student.beforeUpdate(hashPassword)
Student.beforeBulkCreate((students) => {
    students.forEach(hashPassword)
})
