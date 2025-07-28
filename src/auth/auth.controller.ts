import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/LoginDto';
import { AppConfigService } from 'src/configuration/app-config.service';
import axios from 'axios';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	
	constructor(private config: AppConfigService) { }

	@Post('login')
	@ApiResponse({ status: 200, description: 'Login successful' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	async login(@Body() loginDto: LoginDto) {
		try {
			const response = await axios.post(
				`http://${this.config.keycloakHost}:${this.config.keycloakPort}/realms/${this.config.keycloakRealm}/protocol/openid-connect/token`,
				new URLSearchParams({
					grant_type: 'password',
					client_id: this.config.keycloakClientId,
					client_secret: this.config.keycloakClientSecret,
					username: loginDto.username,
					password: loginDto.password,
				}),
				{
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				}
			);

			return {
				access_token: response.data.access_token,
				refresh_token: response.data.refresh_token,
				expires_in: response.data.expires_in,
			};
		} catch (error) {
			throw new HttpException(
				'Invalid credentials',
				HttpStatus.UNAUTHORIZED
			);
		}
	}
}