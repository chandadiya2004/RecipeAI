export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  cuisineEmoji: string;
  cookingTime: string;
  difficulty: string;
  servings: number;
  calories: number;
  healthScore: number;
  tags: string[];
  ingredients: { name: string; quantity: string; checked?: boolean }[];
  steps: { number: number; icon: string; text: string }[];
}

export const suggestedRecipes: Omit<Recipe, 'ingredients' | 'steps' | 'calories' | 'healthScore' | 'tags'>[] = [
  {
    id: '1',
    title: 'Butter Chicken',
    description: 'Rich, creamy tomato-based curry with tender chicken pieces and aromatic spices.',
    image: 'butter-chicken',
    cuisine: 'Indian',
    cuisineEmoji: '🍛',
    cookingTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
  },
  {
    id: '2',
    title: 'Pasta Alfredo',
    description: 'Silky smooth fettuccine in a luxurious parmesan cream sauce with fresh basil.',
    image: 'pasta-alfredo',
    cuisine: 'Italian',
    cuisineEmoji: '🍝',
    cookingTime: '25 min',
    difficulty: 'Easy',
    servings: 2,
  },
  {
    id: '3',
    title: 'Veg Fried Rice',
    description: 'Wok-tossed rice with colorful vegetables, soy sauce, and aromatic garlic.',
    image: 'veg-fried-rice',
    cuisine: 'Chinese',
    cuisineEmoji: '🍜',
    cookingTime: '20 min',
    difficulty: 'Easy',
    servings: 3,
  },
  {
    id: '4',
    title: 'Chicken Tacos',
    description: 'Spiced pulled chicken with fresh guacamole, salsa, and lime in warm tortillas.',
    image: 'tacos',
    cuisine: 'Mexican',
    cuisineEmoji: '🌮',
    cookingTime: '35 min',
    difficulty: 'Easy',
    servings: 4,
  },
  {
    id: '5',
    title: 'Buddha Bowl',
    description: 'Nourishing grain bowl with avocado, greens, cherry tomatoes, and seeds.',
    image: 'salad-bowl',
    cuisine: 'Healthy',
    cuisineEmoji: '🥗',
    cookingTime: '15 min',
    difficulty: 'Easy',
    servings: 1,
  },
];

export const fullRecipe: Recipe = {
  id: '1',
  title: 'Butter Chicken',
  description: 'A classic North Indian dish with tender chicken in a rich, creamy tomato gravy.',
  image: 'butter-chicken',
  cuisine: 'Indian',
  cuisineEmoji: '🍛',
  cookingTime: '45 min',
  difficulty: 'Medium',
  servings: 4,
  calories: 487,
  healthScore: 72,
  tags: ['High Protein', 'Gluten Free', 'Rich in Vitamins'],
  ingredients: [
    { name: 'Chicken thighs', quantity: '600g' },
    { name: 'Greek yogurt', quantity: '200ml' },
    { name: 'Tomato puree', quantity: '400g' },
    { name: 'Heavy cream', quantity: '120ml' },
    { name: 'Butter', quantity: '50g' },
    { name: 'Garam masala', quantity: '2 tsp' },
    { name: 'Turmeric', quantity: '1 tsp' },
    { name: 'Garlic cloves', quantity: '4' },
    { name: 'Fresh ginger', quantity: '2 inch' },
    { name: 'Kashmiri chili', quantity: '2 tsp' },
  ],
  steps: [
    { number: 1, icon: '🥣', text: 'Marinate chicken in yogurt, turmeric, chili powder, and salt for at least 30 minutes.' },
    { number: 2, icon: '🔥', text: 'Grill or pan-sear the marinated chicken until lightly charred. Set aside.' },
    { number: 3, icon: '🍳', text: 'In a heavy pan, melt butter and sauté minced garlic and ginger until fragrant.' },
    { number: 4, icon: '🍅', text: 'Add tomato puree and cook on medium heat for 15 minutes until oil separates.' },
    { number: 5, icon: '🧂', text: 'Stir in garam masala, kashmiri chili, and season to taste.' },
    { number: 6, icon: '🥄', text: 'Add the grilled chicken pieces and simmer for 10 minutes.' },
    { number: 7, icon: '🍶', text: 'Pour in heavy cream, stir gently, and cook for another 5 minutes.' },
    { number: 8, icon: '✨', text: 'Finish with a knob of butter, garnish with cream and cilantro. Serve hot with naan.' },
  ],
};

export const cuisines = [
  { value: 'indian', label: 'Indian', emoji: '🍛' },
  { value: 'chinese', label: 'Chinese', emoji: '🍜' },
  { value: 'italian', label: 'Italian', emoji: '🍝' },
  { value: 'mexican', label: 'Mexican', emoji: '🌮' },
  { value: 'japanese', label: 'Japanese', emoji: '🍣' },
  { value: 'thai', label: 'Thai', emoji: '🍲' },
];
