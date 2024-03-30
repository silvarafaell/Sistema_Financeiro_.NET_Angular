import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SistemaFinanceiro } from 'src/app/models/SistemaFinanceiro';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SistemaService } from 'src/app/services/sistema.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss']
})
export class SistemaComponent {

  tipoTela: number = 1;//1 listagem, 2 cadastro, 3 edição
  tableListSistemas: Array<SistemaFinanceiro>;

  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10;
  id:string;

  configpag()
  {
    this.id = this.gerarIdParaConfigDePaginacao();

    this.config = {
      id: this.id,
      currentPage: this.page,
      itemsPerPage: this.itemsPorPagina
    }
  }

  gerarIdParaConfigDePaginacao() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  cadastro()
  {
    this.tipoTela = 2;
    this.sistemaForm.reset();
  }

  mudarItemsPorPage() {
    this.page = 1
    this.config.currentPage = this.page;
    this.config.itemsPerPage = this.itemsPorPagina;
  }

  mudarPage(event: any) {
    this.page = event;
    this.config.currentPage = this.page;
  }

  ListaSistemasUsuario() {
    this.itemEdicao = null;
    this.tipoTela = 1;

    this.sistemaService.ListaSistemasUsuario(this.authService.getEmailUser())
      .subscribe((response: Array<SistemaFinanceiro>) => {

        this.tableListSistemas = response;

      }, (error) => console.error(error),
        () => { })

  }

  constructor(public menuService: MenuService, public formBuilder: FormBuilder, 
              public sistemaService: SistemaService, public authService: AuthService) {
  }

  sistemaForm: FormGroup;
  checked=false;
  gerarCopiaDespesa = 'accent';
  disabled = false;
  
  ngOnInit() {
    this.menuService.menuSelecionado = 2;

    this.configpag();
    this.ListaSistemasUsuario();

    this.sistemaForm = this.formBuilder.group
    (
      {
        name: ['', [Validators.required]],
        mes: ['', [Validators.required]],
        ano: ['', [Validators.required]],
        diaFechamento: ['', [Validators.required]],
        mesCopia: ['', [Validators.required]],
        anoCopia: ['', [Validators.required]],
      }
    )
  }

  dadorForm() {
    return this.sistemaForm.controls;
  }

  enviar() {
    var dados = this.dadorForm();

    if(this.itemEdicao) {
      this.itemEdicao.Nome = dados["name"].value;
      this.itemEdicao.Mes = dados["mes"].value;
      this.itemEdicao.Ano = dados["ano"].value;
      this.itemEdicao.DiaFechamento = dados["diaFechamento"].value;
      this.itemEdicao.GerarCopiaDespesa = this.checked;
      this.itemEdicao.MesCopia = dados["mesCopia"].value;
      this.itemEdicao.AnoCopia = dados["anoCopia"].value;

      this.itemEdicao.NomePropriedade = "";
      this.itemEdicao.mensagem = "";
      this.itemEdicao.notificacoes = [];

      this.sistemaService.AtualizarSistemaFinanceiro(this.itemEdicao)
      .subscribe((response: SistemaFinanceiro) => {
        debugger
        this.sistemaForm.reset();
        this.ListaSistemasUsuario();       
      },(error) => console.error(error), 
      () => {})

    } else {
      let item = new SistemaFinanceiro();
      item.Nome = dados["name"].value;
  
      item.Id = 0;
      item.Mes = dados["mes"].value;
      item.Ano = dados["ano"].value;
      item.DiaFechamento = dados["diaFechamento"].value;
      item.GerarCopiaDespesa = this.checked;
      item.MesCopia = dados["mesCopia"].value;
      item.AnoCopia = dados["anoCopia"].value;
  
      this.sistemaService.AdicionarSistemaFinanceiro(item)
      .subscribe((response: SistemaFinanceiro) => {
        this.sistemaForm.reset();
  
        this.sistemaService.CadastrarUsuarioNoSistema(response.Id, this.authService.getEmailUser())
        .subscribe((response: any) => {    
          this.ListaSistemasUsuario(); 
        }, (error) => console.error(error), 
           () => {})
        
      },(error) => console.error(error), 
      () => {})
    }     
  }

  itemEdicao: SistemaFinanceiro;

  edicao(id: number) {
    this.sistemaService.ObterSistemaFinanceiro(id)
        .subscribe((response: SistemaFinanceiro) => {

        if(response) {
          this.itemEdicao = response;
          this.tipoTela = 2;

          var dados = this.dadorForm();
          dados["name"].setValue(this.itemEdicao.Nome);
          dados["mes"].setValue(this.itemEdicao.Mes);
          dados["ano"].setValue(this.itemEdicao.Ano);
          dados["diaFechamento"].setValue(this.itemEdicao.DiaFechamento);
          this.checked = this.itemEdicao.GerarCopiaDespesa;
          dados["mesCopia"].setValue(this.itemEdicao.MesCopia);
          dados["anoCopia"].setValue(this.itemEdicao.AnoCopia);
        }
          
      },
      (error) => console.error(error),
      () => {
        
      });
  }

  handleChangePago(item: any) {
    this.checked = item.checked as boolean;
  }

}
