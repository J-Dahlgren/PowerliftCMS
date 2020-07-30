import { Controller, Post, Request, Body } from "@nestjs/common";
import { SimpleAuthService } from "./simple-auth.service";
import { SimpleLoginDTO } from "./simple-login.dto";

@Controller("auth")
export class SimpleAuthController {
  constructor(private authService: SimpleAuthService) {}
  @Post("login")
  login(@Body() dto: SimpleLoginDTO) {
    return this.authService.login(dto.password);
  }
}
