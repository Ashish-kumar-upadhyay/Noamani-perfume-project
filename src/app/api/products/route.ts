import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    let query: any = {};

    if (page && page !== 'Shop All') {
      query = { assignedPages: { $in: [page] } };
      console.log(`Backend: Filtering products for page: ${page}`);
      console.log(`Backend: Using query: ${JSON.stringify(query)}`);
    }

    const products = await Product.find(query);
    console.log(`Backend: Found ${products.length} products.`);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Backend: Failed to fetch products:", error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 