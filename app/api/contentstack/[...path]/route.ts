import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(request.url);
    
    // Construct the Contentstack API URL
    const baseUrl = 'https://dev9-cdn.csnonprod.com/v3';
    const pathString = path.join('/');
    const queryString = searchParams.toString();
    const apiUrl = `${baseUrl}/${pathString}?${queryString}`;
    
    console.log('Proxying request to:', apiUrl);
    
    // Make the request to Contentstack
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
        'access_token': process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '',
      },
    });
    
    if (!response.ok) {
      console.error(`Contentstack API error: ${response.status}`, await response.text());
      throw new Error(`Contentstack API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, api_key, access_token',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Contentstack' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, api_key, access_token',
    },
  });
}
