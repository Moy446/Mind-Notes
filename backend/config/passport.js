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
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            const usuarioModel = new Usuario();
            const googleEmail = profile.emails?.[0]?.value;
            const googleName = profile.displayName || googleEmail?.split('@')[0] || 'Usuario';
            const googlePhoto = profile.photos?.[0]?.value || null;

            if (!googleEmail) {
                return done(null, false, { code: 'GOOGLE_EMAIL_NOT_AVAILABLE' });
            }
            
            let usuario = await usuarioModel.findByGoogleId(profile.id);
            
            if (!usuario) {
                usuario = await usuarioModel.findByEmail(googleEmail);
                
                if (usuario) {
                    await usuarioModel.actualizarGoogleId(usuario.idUsuario, profile.id);
                } else {
                    const esPsicologo = req?.cookies?.google_role === 'psicologo';
                    await usuarioModel.create(
                        {
                            nombre: googleName,
                            email: googleEmail,
                            googleId: profile.id,
                            fotoPerfil: googlePhoto,
                            verificado: true
                        },
                        esPsicologo
                    );
                }

                usuario = await usuarioModel.findByEmail(googleEmail);
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