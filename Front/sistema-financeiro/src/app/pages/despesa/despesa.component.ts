import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/Categoria';
import { Despesa } from 'src/app/models/Despesa';
import { SelectModel } from 'src/app/models/SelectModel';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { DespesaService } from 'src/app/services/despesa.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-despesa',
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.scss']
})
export class DespesaComponent {

  tipoTela: number = 1;//1 listagem, 2 cadastro, 3 edição
  tableListDespesas: Array<Despesa>;

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
    this.despesaForm.reset();
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

  ListarDespesasUsuario() {
    this.tipoTela = 1;

    this.despesaService.ListarDespesasUsuario(this.authService.getEmailUser())
      .subscribe((response: Array<Despesa>) => {

        this.tableListDespesas = response;

      }, (error) => console.error(error),
        () => { })

  }


  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
             public despesaService : DespesaService,  public categoriaService : CategoriaService,
             public authService : AuthService) {
  }

  listSistemas = new Array<SelectModel>();
  sistemaSelect = new SelectModel();

  
  listCategorias = new Array<SelectModel>();
  categoriaSelect = new SelectModel();

  
  color = 'accent';
  checked = false;
  disabled = false;

  despesaForm: FormGroup;


  ngOnInit() {
    this.menuService.menuSelecionado = 4;

    this.configpag();
    this.ListarDespesasUsuario();

    this.despesaForm = this.formBuilder.group
      (
        {
          name: ['', [Validators.required]],
          valor: ['', [Validators.required]],
          data: ['', [Validators.required]],
          sistemaSelect: ['', [Validators.required]],
          categoriaSelect: ['', [Validators.required]],
        }
      )

      this.ListarCategoriasUsuario();
  }

  dadorForm() {
    return this.despesaForm.controls;
  }

  enviar() {
    var dados = this.dadorForm();

    let item = new Despesa();
    item.Nome = dados["name"].value;
    item.Valor = dados["valor"].value;
    item.Pago = this.checked;
    item.DataVencimento = dados["data"].value;
    item.IdCategoria = parseInt(this.categoriaSelect.id);

    this.despesaService.AdicionarDespesa(item)
    .subscribe((response: Despesa) => {
  
      this.despesaForm.reset();
      this.ListarDespesasUsuario();
     
    }, (error) => console.error(error),
      () => { })
  }

  handleChangePago(item: any) {
    this.checked = item.checked as boolean;
  }

  ListarCategoriasUsuario() {
    this.categoriaService.ListarCategoriasUsuario(this.authService.getEmailUser())
      .subscribe((reponse: Categoria[]) => {
        var listaCatagorias = [];

        reponse.forEach(x => {
          var item = new SelectModel();
          item.id = x.Id.toString();
          item.name = x.Nome;
          listaCatagorias.push(item);

        });

        this.listCategorias = listaCatagorias;

      }

      )
  }

}
