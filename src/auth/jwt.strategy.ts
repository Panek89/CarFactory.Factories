import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { AppConfigService } from 'src/configuration/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: AppConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `http://${config.keycloakHost}:${config.keycloakPort}/realms/${config.keycloakRealm}/protocol/openid-connect/certs`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: 'account',
      issuer: `http://${config.keycloakHost}:${config.keycloakPort}/realms/${config.keycloakRealm}`,
      algorithms: ['RS256'],
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any) {
    if (payload.azp !== this.config.keycloakClientId) {
      throw new UnauthorizedException('Invalid client');
    }

    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.realm_access?.roles || [],
      resourceAccess: payload.resource_access || {},
      clientId: payload.azp,
    };
  }
}
