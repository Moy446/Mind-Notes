import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Usuario from '../models/Usuario.js';
import 'dotenv/config';

/**
 * Google OAuth con Passport Strategy - Compatible con Passport 0.7.0
 */
export default function setupPassport(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const usuarioModel = new Usuario();
            
            let usuario = await usuarioModel.findByGoogleId(profile.id);
            
            if (!usuario) {
                usuario = await usuarioModel.findByEmail(profile.emails[0].value);
                
                if (usuario) {
                    await usuarioModel.actualizarGoogleId(usuario.idUsuario, profile.id);
                } else {
                    usuario = await usuarioModel.create({
                        nombre: profile.displayName,
                        email: profile.emails[0].value,
                        fotoPerfil: profile.photos[0]?.value || null,
                        googleId: profile.id,
                        password: null,
                        verificado: true
                    }, false);
                }
            }
            
            return done(null, usuario);
        } catch (error) {
            console.error('Error en Google Strategy:', error);
            return done(error);
        }
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.idUsuario);
    });

    passport.deserializeUser(async (idUsuario, done) => {
        try {
            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findById(idUsuario);
            done(null, usuario);
        } catch (error) {
            done(error);
        }
    });
}