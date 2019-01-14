
//  User schema is designed as a module based program.

//  It allows you to only use this schema for authentication and allows you to use other databases to store user data.

//  You can assign an owner to the other parts of your details schema, fully separating your user details.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'USER'
    },
    verified: {
        type: Boolean,
        default: false
    }
});

//  Allows updated timestamp to be updated aside from updating user details
userSchema.methods.setCurrentTime = function(cb) {
    this.updatedAt = Date.now;
    return cb;
};

userSchema.methods.comparePasswords = function(cb) {
    return this.passwords == cb;
}

module.exports = mongoose.model('User', userSchema);