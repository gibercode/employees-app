import { Component, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  employees: Array<any> = [];
  positions: any = []
  employeeForm: FormGroup;
  baseUrl: string = 'https://my-json-server.typicode.com/gibercode/employees-db/db';
  editing: boolean = false
  currenIndex: number = -1

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.setForm();
    this.getData();
  }

  fetch(route: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(route, headers);
  }

  createHeaders() {
    const options: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
    };

    const httpHeaders: any = {
      headers: new HttpHeaders(options)
    }

    return httpHeaders;
  }

  getData() {
    this.fetch(this.baseUrl).subscribe(response => {
      if (response) this.positions = response['positions']
    })
  }

  setForm() {
    this.employeeForm = this.formBuilder.group({
      name: [''],
      lastname: [''],
      job: [''],
      born_date: ['']
    })
  }

  transformDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${day}/${month}/${year}`
  }

  validation(values: any) {
    const fields = Object.values(values)
    if (fields.every((item: any) => Boolean(item))) return true
    return false
  }

  onSubmit() {
    const { value } = this.employeeForm

    if (!this.validation(value)) return

    if (typeof value.born_date == 'object') {
      const parsedDate = this.transformDate(value.born_date)
      value.born_date = parsedDate
    }

    if (!this.editing) {
      const employee = value;
      this.employees.push(employee);
      this.employeeForm.reset()
      return
    }

    this.employees[this.currenIndex] = value
    this.editing = false
    this.currenIndex = -1
    this.employeeForm.reset()
  }

  onEdit(employee: any, index: number) {
    for (const key in employee) {
      this.employeeForm.controls[key].setValue(employee[key]);
    }

    this.editing = true
    this.currenIndex = index
  }

  onDelete(index: number) {
    this.employees.splice(index, 1)
  }
}
