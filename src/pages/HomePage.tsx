import { useEffect, useState } from 'react';
import { supabase, Category, FoodItem } from '../lib/supabase';
import { Plus, Tag, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type HomePageProps = {
  onCategoryClick: (categoryId: string) => void;
};

export function HomePage({ onCategoryClick }: HomePageProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('food_items')
          .select('*')
          .eq('is_available', true)
          .gt('discount_percentage', 0)
          .limit(6)
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setFeaturedItems(itemsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: 'url(/103a202026dc0f53ca74ce5ebbdb521c.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Delicious Food Awaits
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Order your favorite meals from our college canteen
            </p>
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-xl transform hover:scale-105"
            >
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {featuredItems.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-3xl font-bold text-gray-800">Special Offers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
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
          </section>
        )}

        <section>
          <div className="flex items-center mb-6">
            <Tag className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center group hover:scale-105 transform"
              >
                <div className="text-4xl mb-3">
                  {category.slug === 'indian' && '🍛'}
                  {category.slug === 'chinese' && '🥢'}
                  {category.slug === 'japanese' && '🍱'}
                  {category.slug === 'snacks' && '🍔'}
                  {category.slug === 'juice' && '🥤'}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
