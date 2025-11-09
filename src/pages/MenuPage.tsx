import { useEffect, useState } from 'react';
import { supabase, Category, FoodItem } from '../lib/supabase';
import { Plus, Filter, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type MenuPageProps = {
  categoryId?: string;
  onBack: () => void;
};

export function MenuPage({ categoryId, onBack }: MenuPageProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || 'all');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, filterType, foodItems]);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('food_items').select('*').eq('is_available', true).order('name')
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setFoodItems(itemsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...foodItems];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category_id === selectedCategory);
    }

    if (filterType === 'offers') {
      filtered = filtered.filter((item) => item.discount_percentage > 0);
    } else if (filterType === 'combos') {
      filtered = filtered.filter((item) => item.is_combo);
    } else if (filterType === 'customizable') {
      filtered = filtered.filter((item) => item.is_customizable);
    }

    setFilteredItems(filtered);
  };

  const addToCart = async (foodItem: FoodItem) => {
    if (!user) return;

    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('food_item_id', foodItem.id)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase.from('cart_items').insert({
          user_id: user.id,
          food_item_id: foodItem.id,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white shadow-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </button>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'all'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('offers')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'offers'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setFilterType('combos')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'combos'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Combos
            </button>
            <button
              onClick={() => setFilterType('customizable')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === 'customizable'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Customizable
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {item.discount_percentage > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {item.discount_percentage}% OFF
                    </div>
                  )}
                  {item.is_combo && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      COMBO
                    </div>
                  )}
                  {item.is_customizable && (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      CUSTOMIZABLE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description || 'Delicious food item'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {item.discount_percentage > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-orange-600">
                            ₹{calculateDiscountedPrice(item.price, item.discount_percentage).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-800">
                          ₹{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
