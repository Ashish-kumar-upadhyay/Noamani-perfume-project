import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const country = useCountry();

  return (
    <div key={item.id} className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative h-16 w-16 flex-shrink-0">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          )}
          <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center">
            {item.quantity}
          </span>
        </div>
        <span className="ml-4 text-sm">{item.name}</span>
      </div>
      <span className="text-sm">
        {formatPrice(item.price * item.quantity, country)}
      </span>
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