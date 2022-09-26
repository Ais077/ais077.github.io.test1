import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema ({ 
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;

    next();
})

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;

    }
})

UserSchema.methods.checkPassword = function(paswword){
    return bcrypt.compare(paswword, this.password);
};

UserSchema.methods.generateToken = function(){
   this.token = nanoid();
};

const User = mongoose.model('User', UserSchema);

export default User;