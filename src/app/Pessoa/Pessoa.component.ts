
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap/modal';
import { Pessoa } from 'src/_models/Pessoa';
import { PessoaService } from 'src/_services/pessoa.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale);

defineLocale('',ptBrLocale);


@Component({
  selector: 'app-Pessoa',
  templateUrl: './Pessoa.component.html',
  styleUrls: ['./Pessoa.component.css']
})
export class PessoaComponent implements OnInit {

  _filtroLista!: string;
  pessoas: any = [];
  pessoasFiltradas: any = [];
  perso: Pessoa | any;
  saveMode = 'post';
  bodyDeletePessoa = '';
  modalRef: any = BsModalRef;
  registerForm: any = FormGroup;

  get filtroLista() : string {
    return this._filtroLista;
  } 

  set filtroLista(value: string){
    this._filtroLista = value;
    this.pessoasFiltradas = this.filtroLista ? this.listarPessoas(this.filtroLista) : this.pessoas;
  }

  listarPessoas(listar: string): any {
    listar = listar.toLocaleLowerCase();
    return this.pessoas.filter(
      (pessoa:any) => pessoa.nome.toLocaleLowerCase().indexOf(listar) !== -1
    );
  }
  
  constructor(private personService: PessoaService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService) { 
      this.localeService.use('pt-br');
    }

    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }

  ngOnInit() {
    this.getPessoa();
    this.validation();
  }

  validation() {
    this.registerForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      sexo: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      dataNascimento: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)])
    });
  }

  editarPerson(person: Pessoa, template: any) {
    this.saveMode = 'put';
    this.openModal(template);
    this.perso = person;
    this.registerForm.patchValue(person);
  }

  novaPessoa(template: any) {
    this.saveMode = 'post';
    this.openModal(template);
  }

  deletePerson(person: Pessoa, template: any) {
    this.openModal(template);
    this.perso = person;
    this.bodyDeletePessoa = `Do you confirm delete ?: ${person.nome}, Id: ${person.id}`;
  }
  
  confirmeDelete(template: any) {
    this.personService.deletePerson(this.perso.id).subscribe(
      () => {
          template.hide();
          this.getPessoa();
        }, error => {
          console.log(error);
        }
    );
  }
  
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.saveMode === 'post') {
        this.perso = Object.assign({}, this.registerForm.value);

        this.personService.postPerson(this.perso).subscribe(
          (novoPerson) => {
            console.log(novoPerson);
            template.hide();
            this.getPessoa();
          }, error => {
            console.log(error);
          }
        );
      } else {
        this.perso = Object.assign({id: this.perso.id}, this.registerForm.value);

        this.personService.putPerson(this.perso).subscribe(
          (novoPerson) => {
            console.log(novoPerson);
            template.hide();
            this.getPessoa();
          }, error => {
            console.log(error);
          }
        );
      }
    }
  }

  getPessoa() {
    this.personService.getPessoa().subscribe(
      (_person: Pessoa[]) => {
        this.pessoas = _person;
      },
      error => {
        console.log(error);
      }
    );
  }
}
