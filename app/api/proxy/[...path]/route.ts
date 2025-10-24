import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "http://product.amigoscodeplayground.com:8080";

// api/proxy/api/v1/products
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const url = new URL(`${API_BASE_URL}/${path}`);

  const searchParams = new URL(request.url).searchParams;
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  console.log(url.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Check if response has content and is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For non-JSON responses, return the response as-is
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Check if response has content and is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For non-JSON responses, return the response as-is
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response has content and is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For non-JSON responses, return the response as-is
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Check if response has content and is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For non-JSON responses, return the response as-is
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": contentType || "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
