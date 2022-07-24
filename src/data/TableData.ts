import CustomVisualizer from './CustomVisualizer.vue';
import type { Column } from '../components/DataTableTypes.js';

function getText(id: any) {
    return rows.find(row => row.id === id)?.dessert;
}

export const columns: Array<Column> = [
    { id: 'dessert', label: 'Dessert (100g serving)', field: 'dessert', type: 'text', freeze: 'left' },
    { id: 'price', label: 'Price', field: 'price', type: 'number', visualizer: CustomVisualizer },
    { id: 'calories', label: 'Calories', field: 'calories', type: 'number' },
    { id: 'fat', label: 'Fat (g)', field: 'fat', type: 'number' },
    { id: 'carbs', label: 'Carbs (g)', field: 'carbs', type: 'number' },
    { id: 'protein', label: 'Protein (g)', field: 'protein', type: 'number' },
    { id: 'sodium', label: 'Sodium (mg)', field: 'sodium', type: 'number' },
    { id: 'calcium', label: 'Calcium (%)', field: 'calcium', type: 'number' },
    { id: 'iron', label: 'Iron (%)', field: 'iron', type: 'number' },
    { id: 'available', label: 'In Stock', field: 'available', type: 'boolean' },
    { id: 'rating', label: 'Rating', field: 'rating', type: 'number' },
    { id: 'add', label: 'Add to Cart', field: '', type: 'action', actionLabel: 'Add', actionFunction: (id: any) => console.log(`ACTION: ${getText(id)}`), freeze: 'right' }
];

export const rows = [
    { id: 0, dessert: 'Frozen Yoghurt', price: 4.50, calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87, calcium: 14, iron: 1, available: true, rating: 4 },
    { id: 1, dessert: 'Ice Cream Sandwich', price: 3.99, calories: 237, fat: 9.0, carbs: 37, protein: 4.3, sodium: 129, calcium: 8, iron: 1, available: true, rating: 3 },
    { id: 2, dessert: 'Eclair', price: 2.99, calories: 262, fat: 16.0, carbs: 24, protein: 6.0, sodium: 337, calcium: 6, iron: 7, available: false, rating: 4 },
    { id: 3, dessert: 'Cupcake', price: 2.50, calories: 305, fat: 3.7, carbs: 67, protein: 4.3, sodium: 413, calcium: 3, iron: 8, available: true, rating: 5 },
    { id: 4, dessert: 'Gingerbread', price: 1.75, calories: 356, fat: 16.0, carbs: 49, protein: 3.9, sodium: 327, calcium: 7, iron: 16, available: true, rating: 2 },
    { id: 5, dessert: 'Jelly Bean', price: 0.35, calories: 375, fat: 0.0, carbs: 94, protein: 0.0, sodium: 50, calcium: 0, iron: 0, available: true, rating: 4 },
    { id: 6, dessert: 'Lollipop', price: 0.50, calories: 392, fat: 0.2, carbs: 98, protein: 0.0, sodium: 38, calcium: 0, iron: 2, available: false, rating: 4 },
    { id: 7, dessert: 'Honeycomb', price: 1.45, calories: 408, fat: 3.2, carbs: 87, protein: 6.5, sodium: 562, calcium: 0, iron: 45, available: false, rating: 5 },
    { id: 8, dessert: 'Donut', price: 0.99, calories: 452, fat: 25.0, carbs: 51, protein: 4.9, sodium: 326, calcium: 2, iron: 22, available: true, rating: 1 },
    { id: 9, dessert: 'KitKat', price: 0.99, calories: 518, fat: 26.0, carbs: 65, protein: 7.0, sodium: 54, calcium: 12, iron: 6, available: true, rating: 1 }
];