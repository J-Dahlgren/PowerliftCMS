import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { SnackBarService } from "../../material";
import { finalize, delay } from "rxjs/operators";

@Component({
  templateUrl: "./simple-login.component.html"
})
export class SimpleLoginComponent implements OnInit {
  loginForm!: FormGroup;

  loading$ = new BehaviorSubject<boolean>(false);
  returnUrl: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snack: SnackBarService,
    private authenticationService: AuthService
  ) {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(["/"]);
    }
  }
  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.loginForm = this.formBuilder.group({
      password: ["", Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    document.getElementById("password_input")?.focus();
  }

  onSubmit() {
    this.loading$.next(true);
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(
        () => {
          this.snack.openTranslate("authentication.logged-in", "primary", 2500);
          this.router.navigate([this.returnUrl]);
        },
        e => {
          this.snack.openTranslate("authentication.failed-login", "warn", 2500);
          console.log(e);
        }
      );
  }
}
