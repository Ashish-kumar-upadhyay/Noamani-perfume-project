import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const country = useCountry();

  return (
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {item.name}
        </h3>
        {item.size && (
          <p className="mt-1 text-sm text-gray-500">
            Size: {item.size}
          </p>
        )}
      </div>
      <p className="text-lg font-medium text-gray-900">
        {formatPrice(item.price * item.quantity, country)}
      </p>
    </div>
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal, country)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : formatPrice(shipping, country)}</span>
      </div>
      <div className="flex justify-between text-lg font-medium">
        <span>Total</span>
        <span>{formatPrice(total, country)}</span>
      </div>
    </div>
  );
} 