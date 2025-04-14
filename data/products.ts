export interface Product {
       id: number;
       name: string;
       price: number;
       image: string;
       category: string;
       stock: number;
     }
     
     export const products: Product[] = [
       {
         id: 1,
         name: 'Laptop',
         price: 999.99,
         image: '/laptop.jpg',
         category: 'Electronics',
         stock: 10,
       },
       {
         id: 2,
         name: 'Headphones',
         price: 99.99,
         image: '/headphones.jpg',
         category: 'Electronics',
         stock: 50,
       },
     ];