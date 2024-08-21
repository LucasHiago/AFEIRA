import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  productTipNames = ['Arroz', 'Arroz integral', 'Abacate', 'Alface', 'Açaí', 'Toddy', 'Biscoito de sal', 'Biscoito doce', 'Feijão', 'Macarrão', 'Azeite', 'Farofa', 'Óleo', 'Fubá', 'Massa de lasanha', 'Milho de pipoca', 'Milho cozido', 'Ervilha', 'Massa de tomate', 'Extrato de tomate', 'Maionese', 'Mostarda', 'Molho de salada', 'Ketchup', 'Molho inglês', 'Batata palha', 'Miojo', 'Nescau', 'Leite', 'Leite em pó', 'Cup noodles', 'Batata', 'Pimenta', 'Champignon', 'Palmito', 'Farinha lactea', 'Farinha de trigo', 'Açúcar', 'Sazón', 'Chimichurry', 'Lemon pepper', 'Sal', 'Sal de limão', 'Vinagre', 'Café', 'Filtro de papel', 'Curry', 'Açafrão', 'Orégano', 'Creme de leite', 'Leite condensado', 'Suco', 'Energético', 'Cerveja', 'Queijo ralado', 'Queijo', 'Presunto', 'Mussarela', 'Sucrilho', 'Desodorante', 'Rexona', 'Old Spice', 'Bolinho', 'Sabonete', 'Papel higiênico', 'Veja', 'Batutinha', 'Cloro', 'Desinfetante', 'Vanish', 'Bucha', 'Bombrill', 'Detergente', 'Pasta de dente', 'Colgate', 'Sensodyne', 'Alcoól', 'Sabão em pó', 'Amaciante', 'Papel toalha', 'Cotonete', 'Lenço umedecido', 'Papel alumínio', 'Saco de congelar', 'Saco de lixo', 'Pano de prato', 'Salgadinho', 'Kapo', 'Feijão branco', 'Canjiquinha', 'Cebola', 'Brócoli', 'Beterraba', 'Cenoura', 'Milho', 'Tomate', 'Pimentão', 'Pêra', 'Maçã', 'Maçã verde', 'Ameixa', 'Ovo', 'Uva', 'Bacon', 'Requeijão', 'Manteiga', 'Yorgute', 'Chamito', 'Massa de pastel', 'Massa pronta de lasanha', 'Couve-flor', 'Alho', 'Abacaxi', 'Mandioca', 'Limão', 'Maracujá', 'Cenoura baroa', 'Morango', 'Abobora', 'Amora', 'Acerola', 'Nutela', 'Cebolinha', 'Laranja', 'Mexerica', 'Chocolate', 'Doce', 'Peito de frango', 'Hamburguer', 'Pão de forma', 'Cereja', 'Shampoo', 'Creme', 'Clear Men', 'Listerini', 'Tandy', 'Fio dental', 'Aveia', 'Limpa alumínio', 'Sabonete Líquido', 'Feijão preto', 'Feijão carioca', 'Lentilha', 'Grão-de-bico', 'Arroz parboilizado', 'Arroz arbóreo', 'Farinha de mandioca', 'Tapioca', 'Flocos de milho', 'Cuscuz', 'Aipim', 'Farinha de rosca', 'Polvilho doce', 'Granola', 'Mel', 'Manteiga de amendoim', 'Molho shoyu', 'Molho de pimenta', 'Açúcar mascavo', 'Açúcar demerara', 'Achocolatado em pó', 'Leite de coco', 'Leite de amêndoas', 'Leite de soja', 'Leite de arroz', 'Bebida de aveia', 'Refrigerante', 'Água com gás', 'Água de coco', 'Bebida isotônica', 'Banana'];
    

  filteredProductTipNames: string[] = [];
  productName: string = '';
  productValue: number = 0;
  limit: number = 1200;
  nextId: number = 1;
  getTotalProductList: number = 0;

  productOrderList: { id: number; value: number; name: string; quantity: number; }[] = [];

  hideMobile: boolean = false;
  expand: boolean = false;
  chatActive: boolean = false;
  chatUser: any;

  chatName: string = '';
  chatMessage: string = '';

  totalUsers: number = 0;
  messages: any = [];
  mySocketId: any = '';

  @ViewChild('areaMessage') areaMessage!: ElementRef;
  
  chatInitialized: boolean = false;

  constructor(private api: AppService) {}

  ngOnInit(): void {
    this.feed();
    this.listenersSocket();
    this.getWindowSize();
    window.addEventListener('resize', this.getWindowSize.bind(this));
  }

  //TODO: PRODUCT LIST SPACE

  expandAction() {
    this.expand = !this.expand;
  }

  feed() {
    this.api.feed().subscribe(items => {
      this.productOrderList = items.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.getTotalValue()
    })
  }

  addFeed(product: any) {
    this.api.addFeed(product)
    .pipe(debounceTime(1000))
    .subscribe(() => this.executeActions());
    this.api.emit('feed', {});
  }

  updateFeed(product: any, id: any) {
    this.api.updateFeed(product, id)
    .pipe(debounceTime(1000))
    .subscribe(() => this.executeActions());
    this.api.emit('feed', {});
  }

  deleteFeed(id: any) {
    this.api.deleteFeed(id).subscribe(() => this.executeActions());
    this.api.emit('feed', {});
  }

  onProductNameInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if(input.length > 0) {
      this.filteredProductTipNames = this.productTipNames.filter(name => name.toLowerCase().includes(input.toLowerCase()));
    } else {
      this.filteredProductTipNames = [];
    }
  }

  selectProductName(name: string): void {
    this.productName = name;
    this.filteredProductTipNames = [];
  }

  addProduct(): void {
    if (this.productName && this.productValue) {
      this.addFeed({ name: this.productName, value: this.productValue, quantity: 1 });
      this.productName = '';
      this.productValue = 0;
    } else {
      alert('Preencha os campos de nome e valor do produto corretamente.');
    }

    this.executeActions();
  }

  checkListQuantity() {
    return this.productOrderList.length >= this.nextId ? this.productOrderList.length + 1 : this.nextId++;
  }

  changeQuantity(product: any) {
    this.updateFeed(product, product.id);
  }

  changeValue(product: any) {
    this.updateFeed(product, product.id);
  }

  getTotalValue() {
    this.getTotalProductList = this.productOrderList.reduce((acc, product) => acc + this.calculateValueByQuantity(product), 0);
  }

  calculateValueByQuantity(product: any): number {
    return product.value * product.quantity;
  }

  get getProgressPercentage(): number {
    if (this.limit > 0) {
      return Math.min((this.getTotalProductList / this.limit) * 100, 100);
    }
    return 0;
  }

  get getRemanescentValue() {
    return this.limit - this.getTotalProductList;
  }

  get getLimitProgress() {
    let message = 'normal';
    if(this.getProgressPercentage > 50 && this.getProgressPercentage < 79) {
      message = 'warning'
    } else if (this.getProgressPercentage > 80) {
      message = 'danger';
    }
    return message;
  }

  executeActions() {
    this.feed();
    this.getTotalValue();
    this.getProgressPercentage;
  }

  //TODO: SOCKET SPACE
  getSocketMessage() {
    this.api.listen('message').subscribe((data: any) => {
      this.mySocketId = data.socketId;
      console.log(data.data.message)
    });
  }

  onUserChatName(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if(input.length > 0) {
      this.chatName = input;
    } else {
      this.chatName = '';
    }
  }

  onUserTextMessage(event: Event): void {
    let input = (event.target as HTMLInputElement).value;
    if(input.length > 0) {
      this.chatMessage = input;
    } else {
      this.chatMessage = '';
    }
  }
  

  initChat() {
    if(!this.chatInitialized) {
      this.api.emit('clientEvent', { name: this.chatName, message: 'Juntou-se ao chat' });
      this.chatInitialized = true;
    }
  }

  openChat() {
    this.chatActive = true;
  }

  closeChat() {
    this.chatActive = false;
  }

  endChat() {
    this.api.emit('buceta', null);
    this.api.emit('sair', { endchat: 'end' });
    this.chatInitialized = false;
    this.chatActive = false;
  }

  sendMessage() {
    console.log(this.chatMessage)
    this.api.emit('chat', this.chatMessage);
    this.areaMessage.nativeElement.value = '';
    this.chatInitialized = true;
  }

  getUserList() {
    this.api.listen('connectedUsers').subscribe((data: any) => {
      this.totalUsers = data.data.length;
    });
  }

  getChatMesage() {
    this.api.listen('chat').subscribe((data: any) => {
      const message = data.data.message.data;
      const name = data.data.name;
      const socketId = data.data.id;
      this.messages.push({ message, name, socketId });
    });
  }

  getFeed() {
    this.api.listen('feed').subscribe(() => {
      console.log('feed executou')
      this.executeActions();
    })
  }

  listenersSocket() {
    this.getSocketMessage();
    this.getUserList();
    this.getChatMesage();
    this.getFeed();
  }

  //TODO: DOM SPACE
  getWindowSize() {
    if(window.innerWidth > 992) {
      this.hideMobile = true;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.getWindowSize.bind(this));
  }
}
