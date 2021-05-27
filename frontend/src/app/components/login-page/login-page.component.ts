import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {


  form: FormGroup;
  aSub: Subscription

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if(params['register']) {
        MaterialService.toast('Поздравлем, вы зарегестрировались! Можете войти в систему, используя свои данные')
      } else if(params['accessDenied']){
        MaterialService.toast('Для начала авторизуйтесь в системе.')
      } else if(params['sessionFailed']) {
        MaterialService.toast('Пожалуйста, войдите в систему заново')
      }
    })

  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        console.log('login success')
        this.router.navigate(['/contacts'])
      },
      (e) => {
        MaterialService.toast(e.error.message)
        this.form.enable()
      }
    )
  }

  ngOnDestroy() {
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }


}
