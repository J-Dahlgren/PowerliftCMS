import { Controller, Post, Request, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SimpleAuthService } from "./simple-auth.service";
import { SimpleLoginDTO } from "./simple-login.dto";
import { api } from "@dt/power-comp/shared";

@Controller("auth")
@ApiTags(api.auth.root.toUpperCase())
export class SimpleAuthController {
  constructor(private authService: SimpleAuthService) {}
  @Post("login")
  login(@Body() dto: SimpleLoginDTO) {
    return this.authService.login(dto.password);
  }
}
