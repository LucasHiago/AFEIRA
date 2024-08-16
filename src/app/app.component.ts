import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  productTipNames = ['Arroz', 'Arroz integral', 'Abacate', 'Alface', 'Açaí', 'Toddy', 'Biscoito de sal', 'Biscoito doce', 'Feijão', 'Macarrão', 'Azeite', 'Farofa', 'Óleo', 'Fubá', 'Massa de lasanha', 'Milho de pipoca', 'Milho cozido', 'Ervilha', 'Massa de tomate', 'Extrato de tomate', 'Maionese', 'Mostarda', 'Molho de salada', 'Ketchup', 'Molho inglês', 'Batata palha', 'Miojo', 'Nescau', 'Leite', 'Leite em pó', 'Cup noodles', 'Batata', 'Pimenta', 'Champignon', 'Palmito', 'Farinha lactea', 'Farinha de trigo', 'Açúcar', 'Sazón', 'Chimichurry', 'Lemon pepper', 'Sal', 'Sal de limão', 'Vinagre', 'Café', 'Filtro de papel', 'Curry', 'Açafrão', 'Orégano', 'Creme de leite', 'Leite condensado', 'Suco', 'Energético', 'Cerveja', 'Queijo ralado', 'Queijo', 'Presunto', 'Mussarela', 'Sucrilho', 'Desodorante', 'Rexona', 'Old Spice', 'Bolinho', 'Sabonete', 'Papel higiênico', 'Veja', 'Batutinha', 'Cloro', 'Desinfetante', 'Vanish', 'Bucha', 'Bombrill', 'Detergente', 'Pasta de dente', 'Colgate', 'Sensodyne', 'Alcoól', 'Sabão em pó', 'Amaciante', 'Papel toalha', 'Cotonete', 'Lenço umedecido', 'Papel alumínio', 'Saco de congelar', 'Saco de lixo', 'Pano de prato', 'Salgadinho', 'Kapo', 'Feijão branco', 'Canjiquinha', 'Cebola', 'Brócoli', 'Beterraba', 'Cenoura', 'Milho', 'Tomate', 'Pimentão', 'Pêra', 'Maçã', 'Maçã verde', 'Ameixa', 'Ovo', 'Uva', 'Bacon', 'Requeijão', 'Manteiga', 'Yorgute', 'Chamito', 'Massa de pastel', 'Massa pronta de lasanha', 'Couve-flor', 'Alho', 'Abacaxi', 'Mandioca', 'Limão', 'Maracujá', 'Cenoura baroa', 'Morango', 'Abobora', 'Amora', 'Acerola', 'Nutela', 'Cebolinha', 'Laranja', 'Mexerica', 'Chocolate', 'Doce', 'Peito de frango', 'Hamburguer', 'Pão de forma', 'Cereja', 'Shampoo', 'Creme', 'Clear Men', 'Listerini', 'Tandy', 'Fio dental', 'Aveia', 'Limpa alumínio', 'Sabonete Líquido'];

  filteredProductTipNames: string[] = [];
  productName: string = '';
  productValue: number = 0;
  limit: number = 1200;
  nextId: number = 1;
  getTotalProductList: number = 0;

  productOrderList: { id: number; value: number; name: string; quantity: number; }[] = [
    {
      "id": 1,
      "name": "Arroz",
      "value": 29.8,
      "quantity": 5
    },
    {
      "id": 2,
      "name": "Feijão",
      "value": 12.88,
      "quantity": 5
    },
    {
      "id": 3,
      "name": "Macarrão Vilma Espaguete n°8",
      "value": 4.69,
      "quantity": 5
    },
    {
      "id": 4,
      "name": "Molho de tomate",
      "value": 2.99,
      "quantity": 10
    },
    {
      "id": 5,
      "name": "Óleo Soja",
      "value": 6.79,
      "quantity": 5
    }
  ];

  ngOnInit(): void {
      this.getTotalValue();
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
      this.productOrderList.push({ id: this.checkListQuantity(), name: this.productName, value: this.productValue, quantity: 1 });
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
    this.productOrderList = this.productOrderList.map(productOrder => {
      if (product.id === productOrder.id) {
        return {
          ...productOrder,
          quantity: product.quantity
        };
      }
      return productOrder;
    });

    this.executeActions();
  }

  changeValue(product: any) {
    this.productOrderList = this.productOrderList.map(productOrder => {
      if (product.id === productOrder.id) {
        return {
          ...productOrder,
          value: product.value
        };
      }
      return productOrder;
    });

    this.executeActions();
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
    this.getTotalValue();
    this.getProgressPercentage;
  }
}
