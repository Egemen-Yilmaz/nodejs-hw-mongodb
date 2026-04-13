import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Şifreyi yanıtlarda gizlemek için toJSON metodunu özelleştiriyoruz
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password; // Parolayı JSON çıktısından kaldır
    return obj;
};

export const UserCollection = model('user', userSchema);