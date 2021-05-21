import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  form: FormGroup;
  aSub: Subscription

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        console.log('register success')
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
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
