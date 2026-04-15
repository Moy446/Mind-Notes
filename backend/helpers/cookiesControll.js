import 'dotenv/config';
import jwt from 'jsonwebtoken';
class CookiesController {

    constructor() {
        this.ACCESS_SECRET = process.env.ACCESS_SECRET || 'default_secret';
        this.REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';
        this.ACCESS_TTL_MS = process.env.ACCESS_TTL_MS ? parseInt(process.env.ACCESS_TTL_MS) : 15 * 60 * 1000; // 15 minutos   
        this.REFRESH_TTL_MS = process.env.REFRESH_TTL_MS ? parseInt(process.env.REFRESH_TTL_MS) : 7 * 24 * 60 * 60 * 1000; // 7 días   
    }
    signAccess(payload) {
        return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: this.ACCESS_TTL_MS / 1000 });
    }

    signRefresh(payload) {
        return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: this.REFRESH_TTL_MS / 1000 });
    }

    setAuthCookies(res, accessToken, refreshToken) {
        const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.STAGE === 'production';
        const sameSite = useSecure ? 'None' : 'Lax';
        const cookiesOptions = { httpOnly: true, secure: useSecure, sameSite };
        res.cookie('accessToken', accessToken, { ...cookiesOptions, maxAge: this.ACCESS_TTL_MS });
        res.cookie('refreshToken', refreshToken, { ...cookiesOptions, maxAge: this.REFRESH_TTL_MS });
    }
    clearAuthCookies(res) {
        const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.STAGE === 'production';
        const sameSite = useSecure ? 'None' : 'Lax';
        const cookiesOptions = { httpOnly: true, secure: useSecure, sameSite };
        res.clearCookie('accessToken', cookiesOptions);
        res.clearCookie('refreshToken', cookiesOptions);
    }

    refreshAccessToken(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, this.REFRESH_SECRET);
            return jwt.sign({ id: payload.id, role: payload.role }, this.ACCESS_SECRET, { expiresIn: this.ACCESS_TTL_MS / 1000 });
        } catch (error) {
            throw new Error('Refresh token inválido o expirado');
        }
    }

    requireAuth(req, res, next) {
        const accessToken = req.cookies.accessToken;
        const legacyToken = req.cookies.token;
        const token = accessToken || legacyToken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No autenticado' });
        }
        try {
            const secret = accessToken ? this.ACCESS_SECRET : process.env.JWT_SECRET;
            req.user = jwt.verify(token, secret);
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }
    }
}

export default new CookiesController();