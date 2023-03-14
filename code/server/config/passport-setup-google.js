const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const userController = require('../controller/loginSignUp/google/googleSignUp');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    buyerModel.findById(id).then((user)=>{
        done(null,user);
    });
    sellerModel.findById(id).then((user)=>{
        done(null,user);
    });
})


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/api/signup/google/redirect',
        scope: ['profile', 'email']
    }, (accessToken, refreshToken, profile, done) => {
        const user=userController.createUserOrUpdate(profile,'buyer');
        if(user){
            console.log(user);
            done(null,user);
        }
        else{
            console.log('Cant be created');
        }
    })
);

