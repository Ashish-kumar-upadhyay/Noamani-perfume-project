import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const allProductsScrollRef = useRef<HTMLDivElement>(null);
  const country = useCountry();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <p className="text-xl font-extrabold text-pink-600 mb-2">
      {typeof product.price === 'number'
        ? formatPrice(product.price, country)
        : product.price}
    </p>
  );
} 