import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from 'src/_models/Pessoa';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  baseUrl = 'http://localhost:5000/api/pessoa';

  constructor(private http: HttpClient) { }
  getPessoa(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.baseUrl);
  }

  getPessoaById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseUrl}/${id}`);
  }

  postPerson(pessoa: Pessoa)  {
    return this.http.post(this.baseUrl,pessoa);
  }

  putPerson(pessoa: Pessoa)  {
    return this.http.put(`${this.baseUrl}/${pessoa.id}`,pessoa);
  }

  deletePerson(id: number)  {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
